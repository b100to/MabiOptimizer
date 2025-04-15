import React, { useEffect } from 'react';
import './AdSideBanner.css';

const AdSideBanner = ({ slot, position = 'left', format = 'auto' }) => {
    useEffect(() => {
        // AdSense 초기화가 완료된 후 새 광고 로드
        if (window.adsbygoogle) {
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
                console.error('AdSense 사이드 광고 로드 중 오류 발생:', e);
            }
        }
    }, []);

    return (
        <div className={`ad-side-banner ${position}`}>
            <div className="ad-label">광고</div>
            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-9632991253223801"
                data-ad-slot={slot}
                data-ad-format={format}
            ></ins>
        </div>
    );
};

export default AdSideBanner;
