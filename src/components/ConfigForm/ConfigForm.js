import React from 'react';
import './ConfigForm.css';
import RamSlider from '../RamSlider/RamSlider';
import { generateConfig, downloadConfigFile } from '../../utils/configGenerator';

const ConfigForm = ({
  cpuThreads,
  gpuTier,
  ram,
  setRam,
  unityVersion,
  setUnityVersion,
  platform,
  setPlatform,
  disclaimerAgreed
}) => {
  const handleGenerateConfig = () => {
    // 면책조항에 동의하지 않았으면 경고
    if (!disclaimerAgreed) {
      alert("계속하시려면 면책조항에 동의해주세요.");
      return;
    }

    // 설정 생성
    const config = generateConfig(cpuThreads, gpuTier, ram, unityVersion, platform);
    
    // 파일 다운로드
    downloadConfigFile(config);
  };

  return (
    <div className="config-form">
      <div className="form-group">
        <label className="form-label">
          Unity 버전:
        </label>
        <select
          value={unityVersion}
          onChange={(e) => setUnityVersion(e.target.value)}
          className="form-select"
        >
          <option value="2019.4">Unity 2019.4</option>
          <option value="2020.3">Unity 2020.3</option>
          <option value="2021.3">Unity 2021.3</option>
          <option value="2022.3">Unity 2022.3</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">
          플랫폼:
        </label>
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="form-select"
        >
          <option value="windows">Windows</option>
          <option value="android">Android</option>
        </select>
      </div>

      <div className="form-group">
        <RamSlider ram={ram} setRam={setRam} />
      </div>

      <button
        onClick={handleGenerateConfig}
        className="generate-button"
        disabled={!disclaimerAgreed}
      >
        설정 파일 생성하기
      </button>
    </div>
  );
};

export default ConfigForm; 