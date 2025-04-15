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
                        본 서비스는 사용자 경험 향상을 위해 로컬 스토리지를 사용할 수 있으며,
                        Google AdSense와 같은 광고 서비스 제공을 위해 쿠키가 사용될 수 있습니다.
                        이러한 쿠키는 맞춤형 광고 제공 및 광고 효과 측정을 위해 사용될 수 있습니다.
                    </p>

                    <h3>4. 외부 서비스 연계</h3>
                    <p>
                        본 서비스는 Google AdSense를 사용하여 광고를 제공합니다. Google AdSense는
                        쿠키를 사용하여 사용자에게 관련성 높은 광고를 제공하며, 이 과정에서 사용자의
                        브라우저 정보, IP 주소, 방문 페이지 등의 정보가 Google에 전송될 수 있습니다.
                        더 자세한 정보는 <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">Google 광고 정책</a>을
                        참조하시기 바랍니다.
                    </p>

                    <h3>5. 개인정보의 제3자 제공</h3>
                    <p>
                        본 서비스는 사용자의 개인식별정보를 직접 수집하지 않으나, 광고 서비스를 통해
                        수집된 정보는 Google의 개인정보처리방침에 따라 처리됩니다.
                    </p>

                    <h3>6. 사용자 권리 및 선택</h3>
                    <p>
                        사용자는 <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer">Google 광고 설정</a>에서
                        맞춤형 광고를 비활성화하거나 설정을 관리할 수 있습니다.
                    </p>

                    <h3>7. 개인정보 보호 책임자</h3>
                    <p>
                        본 서비스 관련 개인정보 보호 문의사항은 GitHub 저장소의 이슈를 통해 문의하실 수 있습니다.
                    </p>

                    <h3>8. 개인정보 처리방침 변경</h3>
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