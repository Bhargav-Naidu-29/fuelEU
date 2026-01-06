import { HttpClientPort } from '@/core/ports';

export class HttpClient implements HttpClientPort {
    constructor(private readonly baseUrl: string) { }

    async get<T>(
        url: string,
        params?: Record<string, unknown>
    ): Promise<T> {
        const query = params
            ? `?${new URLSearchParams(
                params as Record<string, string>
            ).toString()}`
            : '';

        const res = await fetch(`${this.baseUrl}${url}${query}`);

        if (!res.ok) {
            throw new Error(await res.text());
        }

        return res.json();
    }

    async post<T>(
        url: string,
        body?: unknown
    ): Promise<T> {
        const res = await fetch(`${this.baseUrl}${url}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: body ? JSON.stringify(body) : undefined,
        });

        if (!res.ok) {
            throw new Error(await res.text());
        }

        return res.json();
    }
}
