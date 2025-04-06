import React from 'react';
import './ConfigForm.css';
import RamSlider from '../RamSlider/RamSlider';
import { generateConfig, downloadConfigFile } from '../../utils/configGenerator';

const ConfigForm = ({
  cpuThreads,
  gpuTier,
  ram,
  setRam,
  termsAgreed,
  setTermsAgreed,
  onShowTerms
}) => {
  const handleGenerateConfig = () => {
    // 이용약관에 동의하지 않았으면 경고
    if (!termsAgreed) {
      alert("계속하시려면 이용약관에 동의해주세요.");
      return;
    }

    // 설정 생성 - Unity 버전과 플랫폼 고정값 사용
    const unityVersion = "2021.3";
    const platform = "windows";
    const config = generateConfig(cpuThreads, gpuTier, ram, unityVersion, platform);

    // 파일 다운로드
    downloadConfigFile(config);
  };

  return (
    <div className="config-form">
      <div className="fixed-settings-info">
        <p>
          <strong>Unity 버전:</strong> Unity 2021.3 (모비노기 PC버전 전용)
        </p>
        <p>
          <strong>플랫폼:</strong> Windows
        </p>
      </div>

      <div className="form-group">
        <RamSlider ram={ram} setRam={setRam} />
      </div>

      <div className="usage-instructions">
        <h3>사용 방법:</h3>
        <ol>
          <li>
            <strong>게임 Data 폴더에 접근하세요:</strong>
            <div className="code-path">C:\Nexon\MobinogiPC\MobinogiPC_Data</div>
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
            <strong>모비노기 PC버전을 재시작하면 최적화 설정이 적용됩니다.</strong>
          </li>
        </ol>
      </div>

      <div className="terms-agreement">
        <div className="checkbox-container">
          <input
            type="checkbox"
            id="terms-checkbox"
            checked={termsAgreed}
            onChange={() => setTermsAgreed(!termsAgreed)}
          />
          <label htmlFor="terms-checkbox">
            <span className="terms-text">
              <button
                className="text-link"
                onClick={(e) => { e.preventDefault(); onShowTerms(); }}
              >
                이용약관
              </button>
              에 동의합니다. (필수)
            </span>
          </label>
        </div>
      </div>

      <button
        onClick={handleGenerateConfig}
        className="generate-button"
        disabled={!termsAgreed}
      >
        설정 파일 생성하기
      </button>

      {!termsAgreed && (
        <div className="terms-notice">
          설정 파일을 생성하려면 이용약관에 동의해주세요.
        </div>
      )}
    </div>
  );
};

export default ConfigForm; 