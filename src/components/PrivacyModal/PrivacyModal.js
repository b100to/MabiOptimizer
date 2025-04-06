import React from 'react';
import './PrivacyModal.css';

const PrivacyModal = ({ onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content privacy-modal">
                <h2 className="modal-title">개인정보 처리방침</h2>

                <div className="privacy-content">
                    <h3>1. 개인정보 수집 및 이용 목적</h3>
                    <p>
                        본 서비스는 사용자로부터 어떠한 개인식별정보도 수집하지 않습니다.
                        다만 서비스 이용 환경 개선을 위해 다음과 같은 정보가 사용자의 기기에 저장될 수 있습니다:
                    </p>
                    <ul>
                        <li>테마 설정(다크모드/라이트모드) - 로컬 스토리지 사용</li>
                        <li>면책 조항 동의 여부 - 세션 스토리지 사용</li>
                    </ul>

                    <h3>2. 개인정보 저장 및 보관</h3>
                    <p>
                        본 서비스에서 사용되는 모든 데이터는 사용자의 로컬 기기에만 저장되며,
                        어떠한 외부 서버로도 전송되지 않습니다.
                    </p>

                    <h3>3. 쿠키 사용</h3>
                    <p>
                        본 서비스는 사용자 경험 향상을 위해 로컬 스토리지를 사용할 수 있으나,
                        제3자 쿠키를 사용하지 않습니다.
                    </p>

                    <h3>4. 외부 서비스 연계</h3>
                    <p>
                        본 서비스는 현재 외부 분석 서비스나 광고 서비스를 사용하지 않습니다.
                    </p>

                    <h3>5. 개인정보의 제3자 제공</h3>
                    <p>
                        본 서비스는 사용자의 정보를 수집하지 않으므로, 어떠한 제3자에게도 개인정보를 제공하지 않습니다.
                    </p>

                    <h3>6. 개인정보 보호 책임자</h3>
                    <p>
                        본 서비스 관련 개인정보 보호 문의사항은 GitHub 저장소의 이슈를 통해 문의하실 수 있습니다.
                    </p>

                    <h3>7. 개인정보 처리방침 변경</h3>
                    <p>
                        본 방침은 사전 통지 없이 변경될 수 있으며, 변경된 방침은 서비스에 게시됨과 동시에 효력이 발생합니다.
                    </p>
                </div>

                <button
                    onClick={onClose}
                    className="close-button"
                >
                    닫기
                </button>
            </div>
        </div>
    );
};

export default PrivacyModal; 