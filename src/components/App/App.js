import React, { useState, useEffect } from 'react';
import './App.css';
import CpuSelector from '../CpuSelector/CpuSelector';
import CpuSlider from '../CpuSlider/CpuSlider';
import GPUOptions from '../GPUOptions/GPUOptions';
import ConfigForm from '../ConfigForm/ConfigForm';
import HelpModal from '../HelpModal/HelpModal';
import TermsModal from '../TermsModal/TermsModal';
import PrivacyModal from '../PrivacyModal/PrivacyModal';
import AnnouncementModal from '../Announcements/AnnouncementModal';
import DxDiagUploader from '../DxDiagUploader/DxDiagUploader';
import ReactGA from 'react-ga4';
import { applyCpuPreset, applyGpuPreset } from '../../utils/configGenerator';

const App = () => {
  // 상태 관리
  const [cores, setCores] = useState(8);
  const [threads, setThreads] = useState(16);
  const [ram, setRam] = useState(16);
  const [gpuTier, setGpuTier] = useState("medium");
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showNotice, setShowNotice] = useState(true);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [autoDetected, setAutoDetected] = useState(false);
  const [systemInfo, setSystemInfo] = useState(null);
  const [useCpuSlider, setUseCpuSlider] = useState(false);  // 슬라이더 사용 여부 상태

  // GPU 또는 RAM 정보가 변경되면 UI에 반영하기 위한 Effect
  useEffect(() => {
    if (systemInfo && autoDetected) {
      // 해당 UI 영역으로 스크롤
      const autoDetectedSection = document.querySelector('.auto-detected-info');
      if (autoDetectedSection) {
        setTimeout(() => {
          autoDetectedSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    }
  }, [systemInfo, autoDetected]);

  // 이벤트 추적 함수들
  const trackConfigGeneration = (config) => {
    ReactGA.event({
      category: '최적화',
      action: '설정 생성',
      label: `CPU스레드:${config.cpuThreads}_GPU:${config.gpuTier}_RAM:${config.ram}GB`
    });
  };

  const trackHelpModalOpen = () => {
    ReactGA.event({
      category: '사용자 행동',
      action: '도움말 모달 열기'
    });
  };

  const trackAutoDetection = (info) => {
    ReactGA.event({
      category: '사용자 행동',
      action: 'DxDiag 자동 감지',
      label: `CPU:${info.cpu.model}_GPU:${info.gpu.model}`
    });
  };

  // DxDiag 자동 감지 처리 함수
  const handleSystemInfoDetected = (info) => {
    if (!info) return;

    setSystemInfo(info);
    setAutoDetected(true);

    // CPU 정보 업데이트
    setCores(info.cpu.cores);
    setThreads(info.cpu.threads);

    // RAM 정보 업데이트 - ramSizeGB 속성만 사용
    setRam(info.ram.ramSizeGB);

    // GPU 정보 업데이트
    setGpuTier(info.gpu.tier);

    // 이벤트 추적
    trackAutoDetection(info);
  };

  // 자동 감지된 정보를 초기화하고 기본값으로 되돌리는 함수
  const handleResetAutoDetection = () => {
    setAutoDetected(false);
    setSystemInfo(null);
    setCores(8);
    setThreads(16);
    setRam(16);
    setGpuTier('medium');

    ReactGA.event({
      category: '사용자 행동',
      action: '자동 감지 초기화'
    });
  };

  // CPU 선택기 토글 함수
  const toggleCpuControl = () => {
    setUseCpuSlider(!useCpuSlider);

    ReactGA.event({
      category: '사용자 행동',
      action: `CPU ${useCpuSlider ? '프리셋' : '슬라이더'} 전환`
    });
  };

  return (
    <div className="app-container">

      <div className="app-card">
        <div className="app-header">
          <h1 className="app-title">모비노기 PC버전 최적화</h1>
        </div>
        
        {showNotice && (
          <div className="notice-container">
            <div className="notice-content">
              <span className="notice-badge">공지사항</span>
              <p>
                <span className="notice-date">2025.04.11</span>
                모비노기 PC버전 최적화 툴 업데이트: 사양별 최적화 강화, 메모리 관리 개선, 배칭 시스템 최적화
                <button
                  onClick={() => setShowAnnouncementModal(true)}
                  className="notice-link"
                >
                  자세히 보기
                </button>
              </p>
            </div>
            <button
              className="notice-close-button"
              onClick={() => setShowNotice(false)}
            >
              닫기
            </button>
          </div>
        )}

        {/* DxDiag 업로더 추가 */}
        <DxDiagUploader onSystemInfoDetected={handleSystemInfoDetected} />

        {autoDetected && systemInfo && (
          <div className="auto-detected-info">
            <div className="auto-detected-header">
              <h3>자동 감지된 PC 사양</h3>
              <button
                className="reset-detection-button"
                onClick={handleResetAutoDetection}
                title="자동 감지된 사양을 초기화하고 기본값으로 돌아갑니다."
              >
                초기화
              </button>
            </div>
            <div className="system-info-grid">
              <div className="system-info-item">
                <span className="info-label">CPU:</span>
                <span className="info-value">{systemInfo.cpu.model}</span>
              </div>
              <div className="system-info-item">
                <span className="info-label">코어/스레드:</span>
                <span className="info-value">{systemInfo.cpu.cores}코어 / {systemInfo.cpu.threads}스레드</span>
              </div>
              <div className="system-info-item">
                <span className="info-label">RAM:</span>
                <span className="info-value">{systemInfo.ram.ramSizeGB}GB</span>
              </div>
              <div className="system-info-item">
                <span className="info-label">GPU:</span>
                <span className="info-value">{systemInfo.gpu.model}</span>
              </div>
              {systemInfo.gpu.dedicatedMemory && (
                <div className="system-info-item">
                  <span className="info-label">그래픽 메모리:</span>
                  <span className="info-value">{systemInfo.gpu.dedicatedMemory}</span>
                </div>
              )}
              <div className="system-info-item">
                <span className="info-label">그래픽 성능 티어:</span>
                <span className="info-value">{systemInfo.gpu.tier === 'ultra' ? '최상' :
                  systemInfo.gpu.tier === 'high' ? '상' :
                    systemInfo.gpu.tier === 'medium' ? '중' :
                      systemInfo.gpu.tier === 'low' ? '하' : '최하'}</span>
              </div>
            </div>

            {/* 다중 그래픽 카드 정보 표시 */}
            {systemInfo.gpu.details && systemInfo.gpu.details.length > 1 && (
              <div className="additional-gpu-info">
                <h4>복수 그래픽 카드 감지됨</h4>
                <div className="multi-gpu-grid">
                  {systemInfo.gpu.details.map((gpu, index) => (
                    <div key={index} className="multi-gpu-item">
                      <div className="gpu-item-header">
                        <span>{index === 0 ? '기본 그래픽' : '보조 그래픽'} {index + 1}</span>
                        {gpu.isIntegrated && <span className="gpu-badge">내장</span>}
                        {!gpu.isIntegrated && <span className="gpu-badge dedicated">전용</span>}
                      </div>
                      <div className="gpu-item-content">
                        <div className="gpu-detail">
                          <span className="gpu-label">모델:</span>
                          <span className="gpu-value">{gpu.cardName}</span>
                        </div>
                        {gpu.dedicatedMemory && (
                          <div className="gpu-detail">
                            <span className="gpu-label">메모리:</span>
                            <span className="gpu-value">{gpu.dedicatedMemory}</span>
                          </div>
                        )}
                        {gpu.driverVersion && (
                          <div className="gpu-detail">
                            <span className="gpu-label">드라이버:</span>
                            <span className="gpu-value">{gpu.driverVersion}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="gpu-note">성능 최적화는 기본 그래픽 카드(첫 번째 항목)를 기준으로 적용됩니다.</p>
              </div>
            )}

            <div className="auto-detected-message">
              <p>
                <strong>자동으로 감지된 하드웨어에 맞게 CPU, GPU, RAM 설정이 적용되었습니다.</strong>
              </p>
              <p className="auto-detected-tip">
                설정을 수동으로 조정하시려면 아래 옵션을 변경하거나, 자동 감지를 초기화하려면 위의 '초기화' 버튼을 클릭하세요.
              </p>
            </div>
          </div>
        )}

        {/* CPU 선택 토글 버튼 */}
        <div className="toggle-container">
          <button
            className="toggle-button"
            onClick={toggleCpuControl}
            disabled={autoDetected}
          >
            {useCpuSlider ? "CPU 프리셋으로 전환" : "CPU 스레드 직접 설정으로 전환"}
          </button>
        </div>

        {/* CPU 설정 (프리셋 또는 슬라이더) */}
        {useCpuSlider ? (
          <CpuSlider
            threads={threads}
            setThreads={setThreads}
          />
        ) : (
          <CpuSelector
            cores={cores}
            threads={threads}
            setCores={setCores}
            setThreads={setThreads}
            autoDetected={autoDetected}
          />
        )}

        <div className="section-divider"></div>

        <GPUOptions
          setGpuTier={setGpuTier}
          currentTier={gpuTier}
          autoDetected={autoDetected}
        />

        <div className="section-divider"></div>

        <ConfigForm
          cpuThreads={threads}
          gpuTier={gpuTier}
          ram={ram}
          setRam={setRam}
          termsAgreed={termsAgreed}
          setTermsAgreed={setTermsAgreed}
          onShowTerms={() => setShowTermsModal(true)}
          onConfigGeneration={() => {
            trackConfigGeneration({ cpuThreads: threads, gpuTier, ram });
          }}
          autoDetected={autoDetected}
        />

        <footer className="app-footer">
          <button
            className="text-button"
            onClick={() => setShowTermsModal(true)}
          >
            이용약관
          </button>
          <span className="footer-divider">|</span>
          <button
            className="text-button"
            onClick={() => setShowPrivacyModal(true)}
          >
            개인정보 처리방침
          </button>
        </footer>
      </div>

      {showHelpModal && <HelpModal onClose={() => setShowHelpModal(false)} />}
      {showTermsModal && (
        <TermsModal onClose={() => setShowTermsModal(false)} />
      )}
      {showPrivacyModal && (
        <PrivacyModal onClose={() => setShowPrivacyModal(false)} />
      )}
      <AnnouncementModal
        isOpen={showAnnouncementModal}
        onClose={() => setShowAnnouncementModal(false)}
      />
    </div>
  );
};

export default App;