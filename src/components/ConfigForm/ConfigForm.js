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

      <div className="usage-instructions">
        <h3>사용 방법:</h3>
        <ol>
          <li>
            <strong>게임 Data 폴더에 접근하세요:</strong>
            <div className="code-path">C:\Nexon\MabinogiMobile\MabinogiMobile_Data</div>
            <div className="path-note">(일반적으로 게임 설치 폴더 내의 [게임이름]_Data 폴더입니다)</div>
          </li>
          <li>
            <strong>기존 boot.config 파일이 있다면 이름을 변경하여 백업하세요:</strong>
            <div className="backup-example">boot.config → boot.config.backup</div>
          </li>
          <li>
            <strong>다운로드한 boot.config 파일을 Data 폴더에 넣으세요.</strong>
          </li>
          <li>
            <strong>마비노기 모바일을 재시작하면 최적화 설정이 적용됩니다.</strong>
          </li>
        </ol>
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