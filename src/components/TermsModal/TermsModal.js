import React from 'react';
import './TermsModal.css';

const TermsModal = ({ onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content terms-modal">
                <h2 className="modal-title">이용약관</h2>

                <div className="terms-content">
                    <h3>1. 서비스 개요</h3>
                    <p>
                        본 서비스는 모비노기 PC버전의 성능 최적화를 위한 설정 파일을 생성하는 비공식 도구입니다.
                        본 서비스는 게임 개발사 및 퍼블리셔와 관련이 없는 팬 제작 도구입니다.
                    </p>

                    <h3>2. 이용 조건</h3>
                    <p>
                        본 서비스를 이용하는 사용자는 다음 조건에 동의하는 것으로 간주됩니다:
                    </p>
                    <ul>
                        <li>서비스 이용은 전적으로 사용자 자신의 판단과 책임하에 이루어집니다.</li>
                        <li>생성된 설정 파일의 적용 결과에 대한 모든 책임은 사용자에게 있습니다.</li>
                        <li>사용자는 게임 이용약관을 위반하여 발생하는 불이익에 대해 스스로 책임을 집니다.</li>
                        <li>본 서비스는 언제든지 예고 없이 변경되거나 중단될 수 있습니다.</li>
                    </ul>

                    <h3>3. 면책 조항</h3>
                    <p>
                        서비스 제공자는 다음 사항에 대해 어떠한 책임도 지지 않습니다:
                    </p>
                    <ul>
                        <li>설정 파일 적용으로 인한 게임 기능 장애 또는 크래시</li>
                        <li>계정 제재 또는 정지</li>
                        <li>게임 데이터 손실 또는 변경</li>
                        <li>서비스 이용 중 발생하는 직접 또는 간접적인 손해</li>
                    </ul>

                    <h3>4. 지적재산권</h3>
                    <p>
                        본 서비스는 오픈 소스로 제공되며, 서비스 내 콘텐츠에 대한 저작권은 각 원저작자에게 있습니다.
                        게임 관련 명칭, 로고, 이미지 등의 지적재산권은 해당 게임 개발사 및 퍼블리셔에게 있습니다.
                    </p>

                    <h3>5. 약관 변경</h3>
                    <p>
                        본 이용약관은 사전 통지 없이 변경될 수 있으며, 변경된 약관은 서비스에 게시됨과 동시에 효력이 발생합니다.
                        지속적인 서비스 이용은 변경된 약관에 동의하는 것으로 간주됩니다.
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

export default TermsModal; 