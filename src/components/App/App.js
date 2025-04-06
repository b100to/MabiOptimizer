import React, { useState } from 'react';
import './App.css';
import CPUOptions from '../CPUOptions/CPUOptions';
import GPUOptions from '../GPUOptions/GPUOptions';
import ConfigForm from '../ConfigForm/ConfigForm';
import HelpModal from '../HelpModal/HelpModal';
import Disclaimer from '../Disclaimer/Disclaimer';

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

  return (
    <div className="app-container">
      <div className="app-card">
        <h1 className="app-title">Unity Boot Config Generator</h1>

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