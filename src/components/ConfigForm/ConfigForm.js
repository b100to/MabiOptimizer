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
  onConfigGeneration,
  autoDetected
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

    // 기타 설정 (위 카테고리에 포함되지 않은 설정들)
    if (activeTab === 'other' && !(
      line.includes('gfx-enable') ||
      line.includes('job-worker-count') ||
      line.includes('max-chunks-per-shader') ||
      line.includes('use-job-worker') ||
      line.includes('use-multi-threaded') ||
      line.includes('gc-max-time-slice') ||
      line.includes('use-job-graph') ||
      line.includes('memorysetup') ||
      line.includes('use-incremental-gc') ||
      line.includes('use-minimal-gc') ||
      line.includes('allocator') ||
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
      <div className="form-group">
        <RamSelector ram={ram} setRam={setRam} />
      </div>

      <div className="fixed-settings-info">
        <p>
          <strong>Unity 버전:</strong> Unity 2021.3 (모비노기 PC버전 전용)
        </p>
        <p>
          <strong>플랫폼:</strong> Windows
        </p>
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

      <div className="install-guide">
        <h3 className="install-guide-title">설치 가이드</h3>
        <div className="install-steps">
          <div className="install-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h4>게임 Data 폴더 접근</h4>
              <div className="path-container">
                <code className="file-path">C:\Nexon\MabinogiMobile\MabinogiMobile_Data</code>
                <button className="copy-button" onClick={() => { navigator.clipboard.writeText('C:\\Nexon\\MabinogiMobile\\MabinogiMobile_Data') }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 4v12a2 2 0 002 2h8a2 2 0 002-2V7.242a2 2 0 00-.602-1.43L16.083 2.57A2 2 0 0014.685 2H10a2 2 0 00-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 18v2a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  복사
                </button>
              </div>
              <p className="step-description">윈도우 탐색기에서 위 경로로 이동합니다</p>
            </div>
          </div>

          <div className="install-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h4>기존 파일 백업</h4>
              <div className="backup-illustration">
                <span className="file-icon">📄</span>
                <span className="file-name">boot.config</span>
                <span className="arrow">→</span>
                <span className="file-icon">📄</span>
                <span className="file-name">boot.config.backup</span>
              </div>
              <p className="step-description">기존 파일이 있다면 이름을 변경하여 백업합니다</p>
            </div>
          </div>

          <div className="install-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h4>최적화 파일 설치</h4>
              <div className="install-illustration">
                <span className="file-icon download">⤓</span>
                <span className="file-name">boot.config</span>
                <span className="arrow">→</span>
                <span className="folder-icon">📁</span>
                <span className="folder-name">MobinogiPC_Data</span>
              </div>
              <p className="step-description">다운로드한 파일을 Data 폴더에 넣습니다</p>
            </div>
          </div>

          <div className="install-step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h4>게임 재시작</h4>
              <div className="restart-illustration">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" fill="currentColor" />
                </svg>
              </div>
              <p className="step-description">모비노기 PC버전을 재시작하면 최적화 설정이 적용됩니다</p>
            </div>
          </div>
        </div>
      </div>

      <div className="config-preview-section">
        <div className="preview-header">
          <h3 className="preview-title">🛠️ 최적화 설정 상세</h3>
          <div className="preview-controls">
            <span className="preview-info">설정값을 확인하고 수정할 수 있습니다</span>
            <button
              className={`toggle-button ${showFullConfig ? 'expanded' : 'collapsed'}`}
              onClick={() => setShowFullConfig(!showFullConfig)}
            >
              {showFullConfig ? '설정 접기' : '설정 펼치기'}
              <span className="toggle-icon">{showFullConfig ? '▼' : '▶'}</span>
            </button>
          </div>
        </div>

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
            <button
              className={`tab-category ${activeTab === 'other' ? 'active' : ''}`}
              onClick={() => setActiveTab('other')}
            >
              ⚙️ 기타
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