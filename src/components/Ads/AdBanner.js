import React, { useEffect } from 'react';
import './AdBanner.css';

const AdBanner = ({ slot, format = 'auto', responsive = true, className = '' }) => {
    useEffect(() => {
        // AdSense 초기화가 완료된 후 새 광고 로드
        if (window.adsbygoogle) {
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
                console.error('AdSense 광고 로드 중 오류 발생:', e);
            }
        }
    }, []);

    return (
        <div className={`ad-banner ${className}`}>
            <div className="ad-label">광고</div>
            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-9632991253223801"
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive={responsive ? 'true' : 'false'}
            ></ins>
        </div>
    );
};

export default AdBanner; 