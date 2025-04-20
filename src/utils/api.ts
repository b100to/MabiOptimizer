import { ApiResponse } from '../types';

export async function fetchApi<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return {
            data,
            status: response.status,
            message: response.statusText
        };
    } catch (error) {
        return {
            data: null as unknown as T,
            status: 500,
            message: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
} 