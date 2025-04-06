import React, { useState, useEffect } from 'react';
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
  const [configContent, setConfigContent] = useState('');
  const [showFullConfig, setShowFullConfig] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'cpu-gpu', 'memory', 'rendering'

  // GPU 티어에 따른 텍스트 반환
  const getGpuTierText = (tier) => {
    switch (tier) {
      case 'low': return '저사양';
      case 'mid': return '중간사양';
      case 'high': return '고사양';
      default: return '중간사양';
    }
  };

  // 설정 파일 생성 및 프리뷰 자동 업데이트
  useEffect(() => {
    const unityVersion = "2021.3";
    const platform = "windows";
    const config = generateConfig(cpuThreads, gpuTier, ram, unityVersion, platform);
    setConfigContent(config);
  }, [cpuThreads, gpuTier, ram]);

  // 설정 파일 생성 및 다운로드
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

  // 워커 수 계산 (보통 논리 코어/스레드 수의 3/4 정도가 최적)
  const workerCount = Math.max(1, Math.floor(cpuThreads * 0.75));

  // GPU 티어에 따른 설정 변경
  const maxChunksPerShader = gpuTier === "high" ? 12 : gpuTier === "mid" ? 8 : 4;
  const hdrEnabled = gpuTier === "low" ? 0 : 1;

  // 설정 라인이 현재 탭에 해당하는지 확인하는 함수
  const shouldShowLine = (line) => {
    if (activeTab === 'all') return true;

    if (activeTab === 'cpu-gpu' && (
      line.includes('gfx-enable') ||
      line.includes('job-worker-count') ||
      line.includes('max-chunks-per-shader')
    )) {
      return true;
    }

    if (activeTab === 'memory' && line.includes('memorysetup')) {
      return true;
    }

    if (activeTab === 'rendering' && (
      line.includes('batch') ||
      line.includes('renderthread') ||
      line.includes('hdr-display-enabled')
    )) {
      return true;
    }

    if (activeTab === 'other' && !(
      line.includes('gfx-enable') ||
      line.includes('job-worker-count') ||
      line.includes('max-chunks-per-shader') ||
      line.includes('memorysetup') ||
      line.includes('batch') ||
      line.includes('renderthread') ||
      line.includes('hdr-display-enabled')
    )) {
      return true;
    }

    return false;
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

      <div className="pc-spec-guide">
        <h3>PC 사양 확인 방법</h3>
        <div className="guide-content">
          <div className="guide-step">
            <div className="step-number">1</div>
            <div className="step-instruction">
              <div className="instruction-title">프로그램 실행</div>
              <div className="instruction-detail">
                <span className="keyboard-key">Windows</span> + <span className="keyboard-key">R</span> 키를 누른 후
                <span className="command">dxdiag</span> 입력하고 Enter
              </div>
            </div>
          </div>

          <div className="guide-step">
            <div className="step-number">2</div>
            <div className="step-instruction">
              <div className="instruction-title">CPU 및 RAM 확인</div>
              <div className="instruction-detail">
                시스템 탭에서 <strong>프로세서</strong>(CPU) 정보와 <strong>메모리</strong>(RAM) 확인
              </div>
            </div>
          </div>

          <div className="guide-step">
            <div className="step-number">3</div>
            <div className="step-instruction">
              <div className="instruction-title">그래픽 카드(GPU) 확인</div>
              <div className="instruction-detail">
                <strong>디스플레이</strong> 탭을 클릭하여 <strong>이름</strong> 항목에서 GPU 모델 확인
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-summary">
        <h3 className="summary-title">현재 최적화 설정 요약</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <div className="summary-label">CPU 스레드</div>
            <div className="summary-value">{cpuThreads}개</div>
          </div>
          <div className="summary-item">
            <div className="summary-label">GPU 사양</div>
            <div className="summary-value">{getGpuTierText(gpuTier)}</div>
          </div>
          <div className="summary-item">
            <div className="summary-label">메모리(RAM)</div>
            <div className="summary-value">{ram}GB</div>
          </div>
          <div className="summary-item">
            <div className="summary-label">작업 스레드 수</div>
            <div className="summary-value">{workerCount}개</div>
          </div>
          <div className="summary-item">
            <div className="summary-label">셰이더 청크</div>
            <div className="summary-value">{maxChunksPerShader}</div>
          </div>
          <div className="summary-item">
            <div className="summary-label">HDR 디스플레이</div>
            <div className="summary-value">{hdrEnabled === 1 ? '활성화' : '비활성화'}</div>
          </div>
        </div>
      </div>

      <div className="usage-instructions">
        <h3>사용 방법:</h3>
        <ol>
          <li>
            <strong>게임 Data 폴더에 접근하세요:</strong>
            <div className="code-path">C:\Nexon\MobinogiPC\MobinogiPC_Data</div>
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

      <div className="config-preview-section">
        <div className="preview-header">
          <h3 className="preview-title">설정 파일 상세 내용</h3>
          <button
            className={`toggle-button ${showFullConfig ? 'expanded' : 'collapsed'}`}
            onClick={() => setShowFullConfig(!showFullConfig)}
          >
            {showFullConfig ? '접기' : '펼치기'}
          </button>
        </div>

        <div className="config-preview-tabs">
          <div className="tabs-header">
            <button
              className={`tab-category ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              전체 설정
            </button>
            <button
              className={`tab-category ${activeTab === 'cpu-gpu' ? 'active' : ''}`}
              onClick={() => setActiveTab('cpu-gpu')}
            >
              CPU/GPU 최적화
            </button>
            <button
              className={`tab-category ${activeTab === 'memory' ? 'active' : ''}`}
              onClick={() => setActiveTab('memory')}
            >
              메모리 설정
            </button>
            <button
              className={`tab-category ${activeTab === 'rendering' ? 'active' : ''}`}
              onClick={() => setActiveTab('rendering')}
            >
              렌더링 옵션
            </button>
            <button
              className={`tab-category ${activeTab === 'other' ? 'active' : ''}`}
              onClick={() => setActiveTab('other')}
            >
              기타 설정
            </button>
          </div>
        </div>

        <pre className={`config-preview ${showFullConfig ? 'expanded' : ''}`}>
          {configContent.split('\n').map((line, index) => {
            // 현재 탭에 해당하는 설정만 보여주기
            if (!shouldShowLine(line)) {
              return null;
            }

            // CPU/GPU 관련 설정에 강조 표시
            if (line.includes('gfx-enable') ||
              line.includes('job-worker-count') ||
              line.includes('max-chunks-per-shader')) {
              return <div key={index} className="highlight cpu-gpu-setting">{line}</div>;
            }
            // 메모리 관련 설정에 강조 표시
            else if (line.includes('memorysetup')) {
              return <div key={index} className="highlight memory-setting">{line}</div>;
            }
            // 렌더링 관련 설정에 강조 표시
            else if (line.includes('batch') ||
              line.includes('renderthread') ||
              line.includes('hdr-display-enabled')) {
              return <div key={index} className="highlight rendering-setting">{line}</div>;
            }
            // 일반 설정
            else {
              return <div key={index} className="highlight other-setting">{line}</div>;
            }
          }).filter(Boolean)}
        </pre>

        {activeTab !== 'all' && (
          <div className="tab-info">
            {activeTab === 'cpu-gpu' && '현재 CPU/GPU 최적화 관련 설정만 표시하고 있습니다.'}
            {activeTab === 'memory' && '현재 메모리 관련 설정만 표시하고 있습니다.'}
            {activeTab === 'rendering' && '현재 렌더링 관련 설정만 표시하고 있습니다.'}
            {activeTab === 'other' && '현재 기타 설정만 표시하고 있습니다.'}
          </div>
        )}
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