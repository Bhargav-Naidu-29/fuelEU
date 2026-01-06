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
        return this.handleResponse<T>(res);
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

        return this.handleResponse<T>(res);
    }

    private async handleResponse<T>(res: Response): Promise<T> {
        if (!res.ok) {
            const errorText = await res.text();
            let errorMessage = errorText;
            try {
                const errorJson = JSON.parse(errorText);
                errorMessage = errorJson.error || errorJson.message || errorText;
            } catch {
                // Not JSON, use errorText
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
