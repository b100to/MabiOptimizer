import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App/App';
import './style.css';
import { inject } from '@vercel/analytics';
import ReactGA from 'react-ga4';

// Google Analytics 초기화 - 실제 측정 ID로 교체해야 합니다
ReactGA.initialize('G-RS9V5SCSFR'); // 여기에 Analytics에서 제공하는 측정 ID를 입력하세요
ReactGA.send({ hitType: 'pageview', page: window.location.pathname });

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

inject(); 