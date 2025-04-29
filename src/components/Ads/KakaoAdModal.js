import React, { useEffect } from "react";

const KakaoAdModal = ({ open, onClose }) => {
    useEffect(() => {
        if (!open) return;
        // 광고 스크립트 동적 삽입
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "//t1.daumcdn.net/kas/static/ba.min.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, [open]);

    if (!open) return null;
    return (
        <div style={{
            position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
            background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999
        }}>
            <div style={{
                background: "#fff",
                padding: 20,
                borderRadius: 8,
                position: "relative",
                minWidth: 320,
                minHeight: 360,
                boxSizing: "border-box"
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        zIndex: 10,
                        background: "#222",
                        color: "#fff",
                        border: "none",
                        borderRadius: "50%",
                        width: 36,
                        height: 36,
                        fontSize: 20,
                        cursor: "pointer",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
                    }}
                    aria-label="광고 닫기"
                >
                    ×
                </button>
                <div style={{ paddingTop: 36, display: "flex", justifyContent: "center" }}>
                    <ins className="kakao_ad_area"
                        style={{ display: "block", width: 300, height: 250 }}
                        data-ad-unit="DAN-ql6YCNJ8ZMnDovZg"
                        data-ad-width="300"
                        data-ad-height="250"></ins>
                </div>
            </div>
        </div>
    );
};

export default KakaoAdModal; 
