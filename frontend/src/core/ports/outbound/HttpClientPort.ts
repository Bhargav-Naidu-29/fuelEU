export interface HttpClientPort {
    get<T>(url: string, params?: Record<string, unknown>): Promise<T>;

    post<T>(
        url: string,
        body?: unknown
    ): Promise<T>;
}
