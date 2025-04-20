// 공통 타입 정의
export interface User {
    id: string;
    name: string;
    email: string;
}

export interface AppConfig {
    apiUrl: string;
    environment: 'development' | 'production';
}

// API 응답 타입
export interface ApiResponse<T> {
    data: T;
    status: number;
    message: string;
} 