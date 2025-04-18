import React, { useState, useEffect } from 'react';
import './ConfigForm.css';
import RamSelector from '../RamSelector/RamSelector';
import { generateConfig, downloadConfigFile } from '../../utils/configGenerator';

const ConfigForm = ({
  cpuThreads,
  gpuTier,
  ram,
  setRam,
  termsAgreed,
  setTermsAgreed,
  onShowTerms,
  onConfigGeneration
}) => {
  const [configContent, setConfigContent] = useState('');
  const [showFullConfig, setShowFullConfig] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'cpu-gpu', 'memory', 'rendering'

  // GPU 티어에 따른 텍스트 반환
  const getGpuTierText = (tier) => {
    switch (tier) {
      case 'minimum': return '매우 낮은 사양';
      case 'low': return '낮은 사양';
      case 'medium': return '중간 사양';
      case 'high': return '높은 사양';
      case 'ultra': return '최고 사양';
      default: return '중간 사양';
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

    // 이벤트 추적 호출
    if (onConfigGeneration) {
      onConfigGeneration();
    }

    // 파일 다운로드
    downloadConfigFile(config);
  };

  // 워커 수 계산 (보통 논리 코어/스레드 수의 3/4 정도가 최적)
  const workerCount = Math.max(1, Math.floor(cpuThreads * 0.75));

  // GPU 티어에 따른 설정 변경
  const maxChunksPerShader = (() => {
    switch (gpuTier) {
      case 'minimum': return 4;
      case 'low': return 8;
      case 'medium': return 12;
      case 'high': return 16;
      case 'ultra': return 24;
      default: return 12;
    }
  })();

  const hdrEnabled = gpuTier === "minimum" || gpuTier === "low" ? 0 : 1;

  // 설정 라인이 현재 탭에 해당하는지 확인하는 함수
  const shouldShowLine = (line) => {
    if (activeTab === 'all') return true;

    // CPU/GPU 설정
    if (activeTab === 'cpu-gpu' && (
      line.includes('gfx-enable') ||
      line.includes('job-worker-count') ||
      line.includes('max-chunks-per-shader') ||
      line.includes('use-job-worker') ||
      line.includes('use-multi-threaded') ||
      line.includes('gc-max-time-slice') ||
      line.includes('use-job-graph')
    )) {
      return true;
    }

    // 메모리 설정
    if (activeTab === 'memory' && (
      line.includes('memorysetup') ||
      line.includes('use-incremental-gc') ||
      line.includes('use-minimal-gc') ||
      line.includes('allocator')
    )) {
      return true;
    }

    // 렌더링 설정
    if (activeTab === 'rendering' && (
      line.includes('batch') ||
      line.includes('renderthread') ||
      line.includes('hdr-display-enabled') ||
      line.includes('shadow') ||
      line.includes('texture-quality') ||
      line.includes('particle-quality') ||
      line.includes('reflection-quality') ||
      line.includes('anti-aliasing') ||
      line.includes('use-compressed-mesh') ||
      line.includes('use-compressed-texture') ||
      line.includes('use-shader') ||
      line.includes('optimize-mesh')
    )) {
      return true;
    }

    return false;
  };

  return (
    <div className="config-form">
      <h3 className="config-title">메모리 및 최적화 설정</h3>

      <div className="form-group">
        <RamSelector ram={ram} setRam={setRam} />
      </div>

      <div className="settings-summary">
        <h3 className="summary-title">최적화 적용 요약</h3>
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

      <div className="install-guide">
        <div className="install-steps">
          <div className="install-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h4>최적화 설정 다운로드</h4>
              <button
                onClick={handleGenerateConfig}
                className="generate-button"
                disabled={!termsAgreed}
              >
                최적화 설정 파일 생성하기
              </button>
              {!termsAgreed && (
                <div className="terms-notice">
                  설정 파일을 생성하려면 이용약관에 동의해주세요.
                </div>
              )}
            </div>
          </div>

          <div className="install-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h4>게임 Data 폴더에 파일 추가</h4>
              <div className="path-container">
                <code className="file-path">C:\Nexon\MabinogiMobile\MabinogiMobile_Data</code>
                <button className="copy-button" onClick={() => { navigator.clipboard.writeText('C:\\Nexon\\MabinogiMobile\\MabinogiMobile_Data') }}>
                  복사
                </button>
              </div>
            </div>
          </div>

          <div className="install-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h4>게임 재시작</h4>
              <p className="step-description">모비노기 PC버전을 재시작하면 최적화 설정이 적용됩니다</p>
            </div>
          </div>
        </div>
      </div>

      <div className="config-preview-section">
        <div className="preview-header">
          <h3 className="preview-title">🛠️ 상세 설정 정보</h3>
          <div className="preview-controls">
            <button
              className={`toggle-button ${showFullConfig ? 'expanded' : 'collapsed'}`}
              onClick={() => setShowFullConfig(!showFullConfig)}
            >
              {showFullConfig ? '설정 접기' : '설정 펼치기'}
            </button>
          </div>
        </div>

        {showFullConfig && (
          <>
            <div className="config-preview-tabs">
              <div className="tabs-header">
                <button
                  className={`tab-category ${activeTab === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveTab('all')}
                >
                  📋 모든 설정
                </button>
                <button
                  className={`tab-category ${activeTab === 'cpu-gpu' ? 'active' : ''}`}
                  onClick={() => setActiveTab('cpu-gpu')}
                >
                  💻 CPU/GPU
                </button>
                <button
                  className={`tab-category ${activeTab === 'memory' ? 'active' : ''}`}
                  onClick={() => setActiveTab('memory')}
                >
                  💾 메모리
                </button>
                <button
                  className={`tab-category ${activeTab === 'rendering' ? 'active' : ''}`}
                  onClick={() => setActiveTab('rendering')}
                >
                  🎨 그래픽
                </button>
              </div>
            </div>

            <pre className="config-preview">
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
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ConfigForm; 