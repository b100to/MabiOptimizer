import React, { useState, useEffect } from 'react';
import './App.css';
import CPUOptions from '../CPUOptions/CPUOptions';
import GPUOptions from '../GPUOptions/GPUOptions';
import ConfigForm from '../ConfigForm/ConfigForm';
import HelpModal from '../HelpModal/HelpModal';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import TermsModal from '../TermsModal/TermsModal';
import PrivacyModal from '../PrivacyModal/PrivacyModal';

const App = () => {
  // 상태 관리
  const [cpuCores, setCpuCores] = useState(6);
  const [cpuThreads, setCpuThreads] = useState(12);
  const [ram, setRam] = useState(16);
  const [gpuTier, setGpuTier] = useState("mid");
  const [unityVersion, setUnityVersion] = useState("2021.3");
  const [platform, setPlatform] = useState("windows");
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [theme, setTheme] = useState(() => {
    // 로컬 스토리지에서 테마 설정 불러오기 또는 시스템 기본 설정 확인
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    // 시스템 설정 확인
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // 테마 변경 시 로컬 스토리지 저장 및 body 클래스 업데이트
  useEffect(() => {
    localStorage.setItem('theme', theme);

    // body 클래스 처리
    if (theme === 'dark') {
      document.body.classList.remove('light');
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
      document.body.classList.add('light');
    }

    // HTML 요소에도 테마 클래스 적용 (최상위 요소)
    document.documentElement.className = theme;
  }, [theme]);

  // 테마 전환 함수
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="app-container">
      <div className={`app-card ${theme}`}>
        <div className="app-header">
          <h1 className="app-title">모비노기 PC버전 최적화</h1>
          <div className="theme-button-container">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
        </div>

        <div className="help-button-container">
          <button
            onClick={() => setShowHelpModal(true)}
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

        <CPUOptions setCpuCores={setCpuCores} setCpuThreads={setCpuThreads} />

        <div className="section-divider"></div>

        <GPUOptions setGpuTier={setGpuTier} />

        <div className="section-divider"></div>

        <ConfigForm
          cpuThreads={cpuThreads}
          gpuTier={gpuTier}
          ram={ram}
          setRam={setRam}
          unityVersion={unityVersion}
          setUnityVersion={setUnityVersion}
          platform={platform}
          setPlatform={setPlatform}
          termsAgreed={termsAgreed}
          setTermsAgreed={setTermsAgreed}
          onShowTerms={() => setShowTermsModal(true)}
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
    </div>
  );
};

export default App; 