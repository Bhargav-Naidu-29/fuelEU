import http from 'http';

const get = (path: string) => {
    return new Promise<string>((resolve, reject) => {
        http.get(`http://localhost:3000${path}`, (res) => {
            let data = '';
            res.on('data', (chunk) => (data += chunk));
            res.on('end', () => resolve(data));
            res.on('error', (err) => reject(err));
        });
    });
};

const post = (path: string, body: any) => {
    return new Promise<string>((resolve, reject) => {
        const postData = JSON.stringify(body);
        const options = {
            hostname: 'localhost',
            port: 3000,
            path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': postData.length,
            },
        };
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => (data += chunk));
            res.on('end', () => resolve(data));
            res.on('error', (err) => reject(err));
        });
        req.on('error', (err) => reject(err));
        req.write(postData);
        req.end();
    });
};

const main = async () => {
    console.log('Verifying Routes API...');

    try {
        // 1. Get all routes
        console.log('GET /routes');
        const routes = await get('/routes');
        console.log('Result:', JSON.parse(routes).length, 'routes found');

        // 2. Set Baseline
        console.log('POST /routes/R001/baseline');
        await post('/routes/R001/baseline', { year: 2024 });
        console.log('Set R001 as 2024 baseline OK');

        // 3. Compare R002 vs R001 (baseline)
        console.log('GET /routes/comparison?routeId=R002&year=2024');
        const compareRes = await get('/routes/comparison?routeId=R002&year=2024');
        const compare = JSON.parse(compareRes);
        console.log('Comparison:', compare);

        // Check specific math
        // R001 (Baseline): 91.0
        // R002 (Comparison): 88.0
        // Expected Diff: ((88/91) - 1) * 100 = -3.2967...
        const expectedDiff = ((88.0 / 91.0) - 1) * 100;
        console.log('Expected Diff:', expectedDiff);
        console.log('Actual Diff:', compare.comparison.percentDiff);

    } catch (err) {
        console.error('Verification failed:', err);
    }
};

main();
