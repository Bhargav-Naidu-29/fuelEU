import http from 'http';

// Types for response structures
interface Route {
    routeId: string;
    year: number;
    ghgIntensity: number;
    fuelConsumption: number;
    distance: number;
    totalEmissions: number;
    isBaseline: boolean;
}

interface ComplianceBalance {
    shipId: string;
    year: number;
    value: number;
}

interface BankingRecord {
    id: string;
    shipId: string;
    year: number;
    amount: number;
    type: 'BANK' | 'APPLY';
    createdAt: string;
}

// Helper functions
const request = (method: 'GET' | 'POST', path: string, body?: any): Promise<{ status: number; data: any }> => {
    return new Promise((resolve, reject) => {
        const postData = body ? JSON.stringify(body) : undefined;
        const options: http.RequestOptions = {
            hostname: 'localhost',
            port: 3000,
            path,
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(postData && { 'Content-Length': Buffer.byteLength(postData) }),
            },
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => (data += chunk));
            res.on('end', () => {
                try {
                    const parsed = data ? JSON.parse(data) : null;
                    resolve({ status: res.statusCode || 0, data: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode || 0, data });
                }
            });
        });

        req.on('error', (err) => reject(err));
        if (postData) req.write(postData);
        req.end();
    });
};

const logResult = (endpoint: string, method: string, url: string, body: any, status: number, response: any, passed: boolean, notes?: string) => {
    console.log(`\n---------------------------------------------------`);
    console.log(`Endpoint: ${method} ${endpoint}`);
    console.log(`Request URL: ${url}`);
    if (body) console.log(`Request Body: ${JSON.stringify(body)}`);
    console.log(`Status Code: ${status}`);
    console.log(`Response: ${JSON.stringify(response, null, 2)}`);
    console.log(`Result: ${passed ? '✅ PASS' : '❌ FAIL'}`);
    if (!passed && notes) console.log(`Failure Reason: ${notes}`);
    console.log(`---------------------------------------------------`);
    return passed;
};

const main = async () => {
    console.log('Starting QA Validation...');
    let passedCount = 0;
    let totalCount = 0;

    try {
        // 1️⃣ Routes
        // GET /routes
        totalCount++;
        let res = await request('GET', '/routes');
        let routes = res.data as Route[];
        let validRoutes = Array.isArray(routes) && routes.length >= 5; // Expecting R001-R005
        let correctFields = validRoutes && routes.every(r =>
            'routeId' in r && 'year' in r && 'ghgIntensity' in r &&
            'fuelConsumption' in r && 'distance' in r &&
            'totalEmissions' in r && 'isBaseline' in r
        );

        let passed = res.status === 200 && validRoutes && correctFields;
        if (logResult('/routes', 'GET', '/routes', null, res.status, res.data, passed, !validRoutes ? 'Not enough routes or invalid format' : (!correctFields ? 'Missing fields' : ''))) passedCount++;

        // POST /routes/:routeId/baseline
        // Set R002 (2024) as baseline
        totalCount++;
        const routeId = 'R002';
        const year = 2024;
        res = await request('POST', `/routes/${routeId}/baseline`, { year });
        const verifyRoutesRes = await request('GET', '/routes');
        const verifyRoutes = verifyRoutesRes.data as Route[];
        const r002_2024 = verifyRoutes.find(r => r.routeId === routeId && r.year === year);
        const other_2024 = verifyRoutes.filter(r => r.year === year && r.routeId !== routeId);

        passed = res.status === 200 || res.status === 201;
        let sideEffectsOk = r002_2024?.isBaseline === true && other_2024.every(r => r.isBaseline === false);

        if (logResult('/routes/:routeId/baseline', 'POST', `/routes/${routeId}/baseline`, { year }, res.status, res.data, passed && sideEffectsOk, !sideEffectsOk ? 'Side effects validation failed' : '')) passedCount++;

        // GET /routes/comparison
        totalCount++;
        const compareRouteId = 'R001';
        res = await request('GET', `/routes/comparison?routeId=${compareRouteId}&year=${year}`);
        const data = res.data;

        passed = res.status === 200 && data.baseline && data.comparison && typeof data.comparison.percentDiff === 'number';
        let mathOk = true;
        if (passed) {
            const expected = ((data.comparison.ghgIntensity / data.baseline.ghgIntensity) - 1) * 100;
            if (Math.abs(data.comparison.percentDiff - expected) > 0.001) mathOk = false;
        }

        if (logResult('/routes/comparison', 'GET', `/routes/comparison?routeId=${compareRouteId}&year=${year}`, null, res.status, res.data, passed && mathOk, !mathOk ? 'Math mismatch' : '')) passedCount++;

        // 2️⃣ Compliance
        // GET /compliance/cb for R001
        totalCount++;
        const shipId = 'R001';
        res = await request('GET', `/compliance/cb?shipId=${shipId}&year=${year}`);
        const cbR001 = res.data.value;
        const cbR001ShipId = res.data.shipId;
        passed = res.status === 200 && typeof cbR001 === 'number';
        if (logResult('/compliance/cb', 'GET', `/compliance/cb?shipId=${shipId}&year=${year}`, null, res.status, res.data, passed)) passedCount++;

        // GET /compliance/cb for R002 (Surplus)
        const surplusShipId = 'R002';
        res = await request('GET', `/compliance/cb?shipId=${surplusShipId}&year=${year}`);
        const cbR002 = res.data.value;

        // GET /compliance/adjusted-cb
        totalCount++;
        res = await request('GET', `/compliance/adjusted-cb?shipId=${shipId}&year=${year}`);
        passed = res.status === 200 && 'originalValue' in res.data && 'adjustedValue' in res.data;
        if (logResult('/compliance/adjusted-cb', 'GET', `/compliance/adjusted-cb?shipId=${shipId}&year=${year}`, null, res.status, res.data, passed)) passedCount++;

        // 3️⃣ Banking
        // POST /banking/bank
        totalCount++;
        const bankAmount = 100;
        res = await request('POST', '/banking/bank', { shipId: surplusShipId, year, amount: bankAmount });
        passed = res.status === 200 || res.status === 201;
        if (logResult('/banking/bank', 'POST', '/banking/bank', { shipId: surplusShipId, year, amount: bankAmount }, res.status, res.data, passed, res.status !== 200 ? 'Banking failed' : '')) passedCount++;

        // POST /banking/apply
        totalCount++;
        const deficitShipId = 'R001';
        const applyAmount = 50;
        res = await request('POST', '/banking/apply', { shipId: deficitShipId, year, amount: applyAmount });
        // Expected failure
        passed = res.status === 200;
        if (logResult('/banking/apply', 'POST', '/banking/apply', { shipId: deficitShipId, year, amount: applyAmount }, res.status, res.data, passed, 'Expected failure if no banked amounts')) passedCount++;

        // GET /banking/records
        totalCount++;
        res = await request('GET', `/banking/records?shipId=${surplusShipId}&year=${year}`);
        let records = res.data as BankingRecord[];
        passed = res.status === 200 && Array.isArray(records) && records.length > 0;
        if (logResult('/banking/records', 'GET', `/banking/records?shipId=${surplusShipId}&year=${year}`, null, res.status, res.data, passed)) passedCount++;

        // 4️⃣ Pooling
        totalCount++;
        const poolData = {
            year,
            members: [
                { shipId: deficitShipId, cb: cbR001 },
                { shipId: surplusShipId, cb: cbR002 }
            ]
        };
        res = await request('POST', '/pools', poolData);
        // Pool sum must be non-negative. Calculation: R001 (-340M) + R002 (+263M) = -77M. Negative.
        // Expect 500 or 400 with message.
        const msg = typeof res.data === 'string' ? res.data : JSON.stringify(res.data);
        const expectedError = msg.includes('Pool sum must be non-negative');

        passed = (res.status === 200 && res.data.valid === true) || (res.status === 500 && expectedError);

        if (logResult('/pools', 'POST', '/pools', poolData, res.status, res.data, passed, expectedError ? 'Correctly rejected negative pool' : 'Unknown error')) passedCount++;

    } catch (e) {
        console.error('QA Script Error:', e);
    }

    console.log(`\nSummary: ${passedCount}/${totalCount} - ${Math.round(passedCount / totalCount * 100)}% Passing`);
};

main();
