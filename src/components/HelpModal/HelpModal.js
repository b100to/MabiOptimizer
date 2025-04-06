import React from 'react';
import './HelpModal.css';

const HelpModal = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="title">PC 사양 확인 방법</h2>

        <div className="section">
          <h3 className="section-title">Windows 10/11에서 사양 확인하기</h3>
          <div className="spec-guide">
            <div className="spec-item">
              <div className="spec-header">
                <div className="spec-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                    <path d="M9 9h6M9 12h6M9 15h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="spec-title">CPU 및 RAM 확인하기</span>
              </div>
              <ol className="spec-steps">
                <li>키보드에서 <span className="keyboard-shortcut">Windows 키 + R</span> 누르기</li>
                <li><span className="command">dxdiag</span> 입력하고 Enter 누르기</li>
                <li>첫 번째 탭(시스템)에서 프로세서(CPU) 정보와 메모리(RAM) 용량 확인 가능</li>
              </ol>
            </div>

            <div className="spec-item">
              <div className="spec-header">
                <div className="spec-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
                    <path d="M14 11h2M14 13h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="spec-title">그래픽 카드(GPU) 확인하기</span>
              </div>
              <ol className="spec-steps">
                <li>동일한 dxdiag 창에서 "디스플레이" 탭 클릭</li>
                <li>"이름" 항목에서 그래픽 카드 모델 확인 가능</li>
              </ol>
            </div>
          </div>
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

export default HelpModal; 