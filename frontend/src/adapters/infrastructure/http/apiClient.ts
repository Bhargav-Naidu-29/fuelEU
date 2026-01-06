import { HttpClientPort } from '@/core/ports';

const BASE_URL = 'http://localhost:3000';

export class ApiClient implements HttpClientPort {
    async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
        const query = params
            ? `?${new URLSearchParams(
                Object.entries(params).reduce((acc, [key, value]) => ({
                    ...acc,
                    [key]: String(value)
                }), {})
            ).toString()}`
            : '';

        try {
            const res = await fetch(`${BASE_URL}${url}${query}`);
            return this.handleResponse<T>(res);
        } catch (err) {
            if (err instanceof Error) throw err;
            throw new Error('Network error or server unreachable');
        }
    }

    async post<T>(url: string, body?: unknown): Promise<T> {
        try {
            const res = await fetch(`${BASE_URL}${url}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: body ? JSON.stringify(body) : undefined,
            });

            return this.handleResponse<T>(res);
        } catch (err) {
            if (err instanceof Error) throw err;
            throw new Error('Network error or server unreachable');
        }
    }

    private async handleResponse<T>(res: Response): Promise<T> {
        if (!res.ok) {
            const errorText = await res.text();
            let errorMessage = errorText;
            try {
                const errorJson = JSON.parse(errorText);
                errorMessage = errorJson.error || errorJson.message || errorText;
            } catch {
                // Not JSON
            }
            throw new Error(errorMessage || `Request failed with status ${res.status}`);
        }

        if (res.status === 204) {
            return {} as T;
        }

        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            return {} as T;
        }

        const text = await res.text();
        return text ? JSON.parse(text) : ({} as T);
    }
}
