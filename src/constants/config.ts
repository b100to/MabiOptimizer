export const CONFIG = {
    API_URL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
    GA_TRACKING_ID: 'G-RS9V5SCSFR',
    APP_VERSION: '1.0.0',
} as const;

export const ROUTES = {
    HOME: '/',
    ABOUT: '/about',
    CONTACT: '/contact',
} as const; 