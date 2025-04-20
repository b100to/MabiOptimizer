import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App/App';
import './style.css';
import { inject } from '@vercel/analytics';
import ReactGA from 'react-ga4';

// Google Analytics 초기화
ReactGA.initialize('G-RS9V5SCSFR');
ReactGA.send({ hitType: 'pageview', page: window.location.pathname });

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

inject(); 