import React, { useState, useEffect, useCallback } from 'react';
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
import { detectHardware, isChromeBrowser } from '../../utils/hardwareDetector';

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
  const [detectionSource, setDetectionSource] = useState('');

  // 이벤트 추적
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

  const trackAutoDetection = useCallback((info, source) => {
    ReactGA.event({
      category: '사용자 행동',
      action: `하드웨어 자동 감지 (${source})`,
      label: `CPU:${info.cpu.model}_GPU:${info.gpu.model}`
    });
  }, []);

  // DxDiag 자동 감지 처리 함수
  const handleSystemInfoDetected = useCallback((info) => {
    if (!info) return;

    setSystemInfo(info);
    setAutoDetected(true);
    setDetectionSource('dxdiag');

    // CPU 정보 업데이트
    setCores(info.cpu.cores);
    setThreads(info.cpu.threads);

    // RAM 정보 업데이트 - 기본값 16GB 사용
    setRam(16);

    // GPU 정보 업데이트
    setGpuTier(info.gpu.tier);

    // 이벤트 추적
    trackAutoDetection(info, 'dxdiag');
  }, [trackAutoDetection, setCores, setThreads, setRam, setGpuTier, setSystemInfo, setAutoDetected, setDetectionSource]);

  // 브라우저 API를 사용한 하드웨어 자동 감지
  const detectBrowserHardware = useCallback(() => {
    try {
      const hardwareInfo = detectHardware();
      console.log('브라우저 API로 감지된 하드웨어:', hardwareInfo);

      // 하드웨어 정보가 충분히 감지되었는지 확인
      if (
        hardwareInfo.cpu.threads > 0 &&
        hardwareInfo.gpu.model !== 'Unknown GPU'
      ) {
        // 시스템 정보 설정
        setSystemInfo(hardwareInfo);
        setAutoDetected(true);
        setDetectionSource('browser');

        // CPU 정보 업데이트
        setCores(hardwareInfo.cpu.cores);
        setThreads(hardwareInfo.cpu.threads);

        // RAM 정보 업데이트 - 기본값 16GB 사용
        setRam(16);

        // GPU 정보 업데이트
        setGpuTier(hardwareInfo.gpu.tier);

        // 이벤트 추적
        trackAutoDetection(hardwareInfo, 'browser-api');

        return true;
      }
      return false;
    } catch (error) {
      console.error('브라우저 하드웨어 감지 오류:', error);
      return false;
    }
  }, [trackAutoDetection, setCores, setThreads, setRam, setGpuTier, setSystemInfo, setAutoDetected, setDetectionSource]);

  // 하드웨어 감지를 다시 수행하는 함수
  const handleRedetectHardware = () => {
    // 자동 감지 플래그 초기화
    localStorage.removeItem('autoDetectionDisabled');

    // 크롬 브라우저가 아닌 경우 경고 메시지
    if (!isChromeBrowser()) {
      alert('현재 Chrome 브라우저가 아닙니다. 하드웨어 감지 정확도가 낮을 수 있으니 DxDiag 파일 분석을 권장합니다.');
    }

    // 하드웨어 감지 실행
    const detected = detectBrowserHardware();

    if (!detected) {
      alert('하드웨어 감지에 실패했습니다. 수동으로 설정하거나 DxDiag 파일을 업로드해 보세요.');
    }

    ReactGA.event({
      category: '사용자 행동',
      action: '하드웨어 재감지 시도',
      label: isChromeBrowser() ? 'Chrome 브라우저' : '기타 브라우저'
    });
  };

  // 컴포넌트 마운트 시 하드웨어 자동 감지
  useEffect(() => {
    // 사용자의 로컬 스토리지에서 이전에 자동 감지를 비활성화했는지 확인
    const autoDetectionDisabled = localStorage.getItem('autoDetectionDisabled') === 'true';

    if (!autoDetectionDisabled) {
      detectBrowserHardware();
    }
  }, [detectBrowserHardware]);

  // 자동 감지된 정보를 초기화하고 기본값으로 되돌리는 함수
  const handleResetAutoDetection = () => {
    setAutoDetected(false);
    setSystemInfo(null);
    setDetectionSource('');
    setCores(8);
    setThreads(16);
    setRam(16);
    setGpuTier('medium');

    // 자동 감지 비활성화 상태 제거 (새로고침 후에도 다시 자동 감지 될 수 있도록)
    localStorage.removeItem('autoDetectionDisabled');

    ReactGA.event({
      category: '사용자 행동',
      action: '자동 감지 초기화'
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
                모비노기 PC버전 최적화 툴 업데이트: 사양별 최적화 강화
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

        {/* 자동 감지 섹션 */}
        <div className="detection-section">
          <h2 className="section-title">PC 사양 분석</h2>

          {/* 브라우저 API 감지 영역 */}
          <div className="detection-method browser-detection">
            <h3 className="detection-subtitle">브라우저 API 자동 감지</h3>
            <p className="detection-description">
              브라우저 API를 활용하여 기본적인 하드웨어 정보를 감지합니다.
            </p>
            <div className="browser-info">
              <span className="browser-warning">⚠️ 자동 감지 기능은 Chrome 브라우저에서 가장 정확하게 작동합니다.</span>
            </div>

            <div className="detection-actions">
              <button
                className="detect-button"
                onClick={handleRedetectHardware}
                title="브라우저 API를 사용하여 하드웨어를 다시 감지합니다."
              >
                브라우저로 하드웨어 감지하기
              </button>
            </div>
          </div>

          <div className="method-divider">
            <span className="method-divider-text">또는</span>
          </div>

          {/* DxDiag 파일 분석 영역 */}
          <div className="detection-method dxdiag-detection">
            <h3 className="detection-subtitle">DxDiag 파일 상세 분석 <span className="badge-accurate">더 정확함</span></h3>
            <p className="detection-description">
              DxDiag 파일 업로드를 통해 더 정확한 하드웨어 정보 분석이 가능합니다.
            </p>
            <DxDiagUploader onSystemInfoDetected={handleSystemInfoDetected} />
          </div>

          {/* 감지된 정보 표시 영역 */}
          {autoDetected && systemInfo && (
            <div className="auto-detected-info">
              <div className="auto-detected-header">
                <h3>감지된 PC 사양
                  <span className={`source-badge ${detectionSource === 'browser' ? 'browser-source' : 'dxdiag-source'}`}>
                    {detectionSource === 'browser' ? '브라우저 API 감지' : 'DxDiag 분석'}
                  </span>
                </h3>
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
                  <span className="info-value">16GB (기본값)</span>
                </div>
                <div className="system-info-item">
                  <span className="info-label">GPU:</span>
                  <span className="info-value">{systemInfo.gpu.model}</span>
                </div>
                <div className="system-info-item">
                  <span className="info-label">그래픽 성능 티어:</span>
                  <span className="info-value">{systemInfo.gpu.tier === 'ultra' ? '최상' :
                    systemInfo.gpu.tier === 'high' ? '상' :
                      systemInfo.gpu.tier === 'medium' ? '중' :
                        systemInfo.gpu.tier === 'low' ? '하' : '최하'}</span>
                </div>
                <div className="system-info-item">
                  <span className="info-label">감지 소스:</span>
                  <span className="info-value">
                    {detectionSource === 'browser' ? '브라우저 API' : 'DxDiag 분석'}
                  </span>
                </div>
              </div>

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
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="section-divider"></div>

        {/* 수동 설정 섹션 */}
        <div className="manual-section">
          <h2 className="section-title">수동 설정</h2>

          <h3 className="subsection-title">CPU 스레드 설정</h3>
          <CpuSlider
            threads={threads}
            setThreads={setThreads}
          />

          <div className="sub-divider"></div>

          <h3 className="subsection-title">GPU 설정</h3>
          <GPUOptions
            setGpuTier={setGpuTier}
            currentTier={gpuTier}
            autoDetected={autoDetected}
          />

          <div className="sub-divider"></div>

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
          />
        </div>

        <footer className="app-footer">
          <button
            className="text-button"
            onClick={() => {
              setShowHelpModal(true);
              trackHelpModalOpen();
            }}
          >
            도움말
          </button>
          <span className="footer-divider">|</span>
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