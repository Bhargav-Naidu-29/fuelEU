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

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || `Request failed with status ${res.status}`);
            }

            const text = await res.text();
            return text ? JSON.parse(text) : ({} as T);
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

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || `Request failed with status ${res.status}`);
            }

            const text = await res.text();
            return text ? JSON.parse(text) : ({} as T);
        } catch (err) {
            if (err instanceof Error) throw err;
            throw new Error('Network error or server unreachable');
        }
    }
}
