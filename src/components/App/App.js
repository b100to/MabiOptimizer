import React, { useState } from 'react';
import './App.css';
import CpuSelector from '../CpuSelector/CpuSelector';
import GPUOptions from '../GPUOptions/GPUOptions';
import ConfigForm from '../ConfigForm/ConfigForm';
import HelpModal from '../HelpModal/HelpModal';
import TermsModal from '../TermsModal/TermsModal';
import PrivacyModal from '../PrivacyModal/PrivacyModal';
import AnnouncementModal from '../Announcements/AnnouncementModal';
import AdBanner from '../Ads/AdBanner';
import AdSideBanner from '../Ads/AdSideBanner';
import ReactGA from 'react-ga4';

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

  return (
    <div className="app-container">
      {/* 좌측 사이드 광고 */}
      <AdSideBanner slot="6457823914" position="left" format="vertical" />

      {/* 우측 사이드 광고 */}
      <AdSideBanner slot="9138675421" position="right" format="vertical" />

      <div className="app-card">
        <div className="app-header">
          <h1 className="app-title">모비노기 PC버전 최적화</h1>
        </div>

        <div className="donation-notice">
          <h3>광고 수익 기부 안내</h3>
          <p>
            이 웹사이트의 광고 수익은 서버 운영비를 제외하고
            어려운 이웃을 돕기 위해 기부됩니다.
            <br />
            <small>수익금 사용 내역은 정기적으로 공개됩니다.</small>
          </p>
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

        <div className="help-button-container">
          <button
            onClick={() => {
              trackHelpModalOpen();
              setShowHelpModal(true);
            }}
            className="help-button"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            내 PC 사양 확인하는 방법
          </button>
        </div>

        <div className="section-divider"></div>

        <CpuSelector
          cores={cores}
          threads={threads}
          setCores={setCores}
          setThreads={setThreads}
        />

        <div className="section-divider"></div>

        <GPUOptions setGpuTier={setGpuTier} />

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
        />

        {/* 하단 광고 배너 */}
        <AdBanner slot="1973645182" className="bottom-ad-banner" />

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