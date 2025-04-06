import React, { useState, useEffect } from 'react';
import './App.css';
import CPUOptions from '../CPUOptions/CPUOptions';
import GPUOptions from '../GPUOptions/GPUOptions';
import ConfigForm from '../ConfigForm/ConfigForm';
import HelpModal from '../HelpModal/HelpModal';
import Disclaimer from '../Disclaimer/Disclaimer';
import ThemeToggle from '../ThemeToggle/ThemeToggle';

const App = () => {
  // 상태 관리
  const [cpuCores, setCpuCores] = useState(6);
  const [cpuThreads, setCpuThreads] = useState(12);
  const [ram, setRam] = useState(16);
  const [gpuTier, setGpuTier] = useState("mid");
  const [unityVersion, setUnityVersion] = useState("2021.3");
  const [platform, setPlatform] = useState("windows");
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [disclaimerAgreed, setDisclaimerAgreed] = useState(false);
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
          <h1 className="app-title">Unity Boot Config Generator</h1>
          <div className="theme-button-container">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
        </div>

        <Disclaimer
          disclaimerAgreed={disclaimerAgreed}
          setDisclaimerAgreed={setDisclaimerAgreed}
        />

        <div className="help-button-container">
          <button
            onClick={() => setShowHelpModal(true)}
            className="help-button"
          >
            🔍 내 PC 사양 확인하는 방법
          </button>
        </div>

        <CPUOptions setCpuCores={setCpuCores} setCpuThreads={setCpuThreads} />
        <GPUOptions setGpuTier={setGpuTier} />

        <ConfigForm
          cpuThreads={cpuThreads}
          gpuTier={gpuTier}
          ram={ram}
          setRam={setRam}
          unityVersion={unityVersion}
          setUnityVersion={setUnityVersion}
          platform={platform}
          setPlatform={setPlatform}
          disclaimerAgreed={disclaimerAgreed}
        />

        {showHelpModal && <HelpModal onClose={() => setShowHelpModal(false)} />}
      </div>
    </div>
  );
};

export default App; 