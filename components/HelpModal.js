import React from 'react';
import { styles } from '../styles/HelpModalStyles';
import RamSlider from './RamSlider';

const HelpModal = ({ onClose }) => {
  const [ram, setRam] = React.useState(16);

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <h2 style={styles.title}>PC 사양 확인 방법</h2>

        <div style={{ marginBottom: "20px" }}>
          <h3 style={styles.sectionTitle}>Windows 10/11에서 사양 확인하기</h3>
          <ol style={{ paddingLeft: "20px" }}>
            <li style={{ marginBottom: "8px" }}>
              <strong>CPU 및 RAM 확인:</strong>
              <ol style={{ paddingLeft: "20px", marginTop: "5px" }}>
                <li>
                  키보드에서{" "}
                  <code style={styles.code}>Windows 키 + R</code>{" "}
                  누르기
                </li>
                <li>
                  <code style={styles.code}>dxdiag</code>{" "}
                  입력하고 Enter 누르기
                </li>
                <li>
                  첫 번째 탭(시스템)에서 프로세서(CPU) 정보와 메모리(RAM) 용량
                  확인 가능
                </li>
              </ol>
            </li>
            <li style={{ marginBottom: "8px" }}>
              <strong>그래픽 카드(GPU) 확인:</strong>
              <ol style={{ paddingLeft: "20px", marginTop: "5px" }}>
                <li>동일한 dxdiag 창에서 "디스플레이" 탭 클릭</li>
                <li>"이름" 항목에서 그래픽 카드 모델 확인 가능</li>
              </ol>
            </li>
          </ol>
        </div>

        <RamSlider ram={ram} setRam={setRam} />

        <button
          onClick={onClose}
          style={styles.closeButton}
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default HelpModal;