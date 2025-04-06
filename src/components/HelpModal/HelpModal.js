import React, { useState } from 'react';
import RamSlider from '../RamSlider/RamSlider';
import './HelpModal.css';

const HelpModal = ({ onClose }) => {
  const [ram, setRam] = useState(16);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="title">PC 사양 확인 방법</h2>

        <div className="section">
          <h3 className="section-title">Windows 10/11에서 사양 확인하기</h3>
          <ol className="instruction-list">
            <li className="instruction-item">
              <strong>CPU 및 RAM 확인:</strong>
              <ol className="sub-instruction-list">
                <li>
                  키보드에서 <code className="code">Windows 키 + R</code> 누르기
                </li>
                <li>
                  <code className="code">dxdiag</code> 입력하고 Enter 누르기
                </li>
                <li>
                  첫 번째 탭(시스템)에서 프로세서(CPU) 정보와 메모리(RAM) 용량
                  확인 가능
                </li>
              </ol>
            </li>
            <li className="instruction-item">
              <strong>그래픽 카드(GPU) 확인:</strong>
              <ol className="sub-instruction-list">
                <li>동일한 dxdiag 창에서 "디스플레이" 탭 클릭</li>
                <li>"이름" 항목에서 그래픽 카드 모델 확인 가능</li>
              </ol>
            </li>
          </ol>
        </div>

        <RamSlider ram={ram} setRam={setRam} />

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