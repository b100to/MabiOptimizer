// 메인 애플리케이션 컴포넌트
const App = () => {
    // 기본 상태값
    const [cpuCores, setCpuCores] = React.useState(6);
    const [cpuThreads, setCpuThreads] = React.useState(12);
    const [ram, setRam] = React.useState(32);
    const [gpuTier, setGpuTier] = React.useState("mid");
    const [unityVersion, setUnityVersion] = React.useState("2021.3");
    const [platform, setPlatform] = React.useState("windows");
    const [configOutput, setConfigOutput] = React.useState("");
    const [showHelpModal, setShowHelpModal] = React.useState(false);
    const [disclaimerAgreed, setDisclaimerAgreed] = React.useState(false);
  
    // utils 참조
    const { applyCpuPreset, applyGpuPreset, downloadConfigFile, generateConfig } = window.ConfigGeneratorUtils;
    const HelpModalComponent = window.HelpModal;
  
    // RAM 프리셋 선택
    const applyRamPreset = (ramAmount) => {
      setRam(ramAmount);
    };
  
    // 설정 생성 및 다운로드 처리 함수
    const handleGenerateConfig = () => {
      // 면책조항에 동의하지 않았으면 경고
      if (!disclaimerAgreed) {
        alert("계속하시려면 면책조항에 동의해주세요.");
        return;
      }
  
      // 설정 생성
      const config = generateConfig(cpuThreads, gpuTier, ram, unityVersion, platform);
      
      // 설정 저장
      setConfigOutput(config);
  
      // 파일 다운로드
      downloadConfigFile(config);
    };
  
    return (
      <div
        style={{
          padding: "20px",
          maxWidth: "800px",
          margin: "0 auto",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}
      >
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "20px",
            textAlign: "center"
          }}
        >
          Unity Boot Config Generator
        </h1>
  
        {/* 면책조항 추가 */}
        <div
          style={{
            marginBottom: "20px",
            padding: "15px",
            backgroundColor: "#fff5f5",
            borderRadius: "6px",
            border: "1px solid #feb2b2"
          }}
        >
          <h3
            style={{
              fontWeight: "600",
              color: "#c53030",
              marginBottom: "10px"
            }}
          >
            ⚠️ 주의사항
          </h3>
          <p style={{ fontSize: "14px", color: "#742a2a", marginBottom: "10px" }}>
            이 도구는 마비노기 모바일의 비공식 최적화 도구로, 넥슨 및 게임 개발사와 무관합니다. 
            게임 파일을 수정하는 행위는 게임 이용약관에 위배될 수 있으며 계정 제재의 원인이 될 수 있습니다.
          </p>
          <p style={{ fontSize: "14px", color: "#742a2a", marginBottom: "10px" }}>
            사용으로 인해 발생할 수 있는 게임 크래시, 계정 제재, 데이터 손실 등 어떠한 문제에 대해서도 제작자는 책임을 지지 않습니다.
          </p>
          <div style={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
            <input
              type="checkbox"
              id="disclaimer-checkbox"
              checked={disclaimerAgreed}
              onChange={() => setDisclaimerAgreed(!disclaimerAgreed)}
              style={{ marginRight: "10px" }}
            />
            <label
              htmlFor="disclaimer-checkbox"
              style={{ fontSize: "14px", color: "#742a2a", fontWeight: "500" }}
            >
              위 내용을 이해했으며, 모든 책임은 본인에게 있음에 동의합니다.
            </label>
          </div>
        </div>
  
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <button
            onClick={() => setShowHelpModal(true)}
            style={{
              backgroundColor: "#f3f4f6",
              color: "#4b5563",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
              padding: "8px 15px",
              fontSize: "14px",
              cursor: "pointer"
            }}
          >
            🔍 내 PC 사양 확인하는 방법
          </button>
        </div>
  
        <div style={{ marginBottom: "20px" }}>
          <h3
            style={{ fontSize: "16px", fontWeight: "600", marginBottom: "10px" }}
          >
            CPU 모델 빠른 선택:
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "10px",
              marginBottom: "10px"
            }}
          >
            <button
              onClick={() => applyCpuPreset("intel-i5", setCpuCores, setCpuThreads)}
              style={{
                padding: "8px",
                backgroundColor: "#f0f0f0",
                border: "1px solid #ddd",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Intel i5 (6코어/12스레드)
            </button>
            <button
              onClick={() => applyCpuPreset("intel-i7", setCpuCores, setCpuThreads)}
              style={{
                padding: "8px",
                backgroundColor: "#f0f0f0",
                border: "1px solid #ddd",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Intel i7 (8코어/16스레드)
            </button>
            <button
              onClick={() => applyCpuPreset("intel-i9", setCpuCores, setCpuThreads)}
              style={{
                padding: "8px",
                backgroundColor: "#f0f0f0",
                border: "1px solid #ddd",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Intel i9 (12코어/24스레드)
            </button>
            <button
              onClick={() => applyCpuPreset("amd-r5", setCpuCores, setCpuThreads)}
              style={{
                padding: "8px",
                backgroundColor: "#f0f0f0",
                border: "1px solid #ddd",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              AMD Ryzen 5 (6코어/12스레드)
            </button>
            <button
              onClick={() => applyCpuPreset("amd-r7", setCpuCores, setCpuThreads)}
              style={{
                padding: "8px",
                backgroundColor: "#f0f0f0",
                border: "1px solid #ddd",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              AMD Ryzen 7 (8코어/16스레드)
            </button>
            <button
              onClick={() => applyCpuPreset("amd-r9", setCpuCores, setCpuThreads)}
              style={{
                padding: "8px",
                backgroundColor: "#f0f0f0",
                border: "1px solid #ddd",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              AMD Ryzen 9 (12코어/24스레드)
            </button>
          </div>
        </div>
  
        <div style={{ marginBottom: "20px" }}>
          <h3
            style={{ fontSize: "16px", fontWeight: "600", marginBottom: "10px" }}
          >
            GPU 모델 빠른 선택:
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "10px",
              marginBottom: "10px"
            }}
          >
            <button
              onClick={() => applyGpuPreset("nvidia-low", setGpuTier)}
              style={{
                padding: "8px",
                backgroundColor: "#f0f9ff",
                border: "1px solid #bae6fd",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              NVIDIA 저사양
              <br />
              (GTX 1050/1650)
            </button>
            <button
              onClick={() => applyGpuPreset("nvidia-mid", setGpuTier)}
              style={{
                padding: "8px",
                backgroundColor: "#f0f9ff",
                border: "1px solid #bae6fd",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              NVIDIA 중사양
              <br />
              (RTX 3050/3060, GTX 1070/1080)
            </button>
            <button
              onClick={() => applyGpuPreset("nvidia-high", setGpuTier)}
              style={{
                padding: "8px",
                backgroundColor: "#f0f9ff",
                border: "1px solid #bae6fd",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              NVIDIA 고사양
              <br />
              (RTX 3070+/4060+)
            </button>
            <button
              onClick={() => applyGpuPreset("amd-low", setGpuTier)}
              style={{
                padding: "8px",
                backgroundColor: "#fff1f2",
                border: "1px solid #fecdd3",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              AMD 저사양
              <br />
              (RX 550/560)
            </button>
            <button
              onClick={() => applyGpuPreset("amd-mid", setGpuTier)}
              style={{
                padding: "8px",
                backgroundColor: "#fff1f2",
                border: "1px solid #fecdd3",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              AMD 중사양
              <br />
              (RX 5600/6600)
            </button>
            <button
              onClick={() => applyGpuPreset("amd-high", setGpuTier)}
              style={{
                padding: "8px",
                backgroundColor: "#fff1f2",
                border: "1px solid #fecdd3",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              AMD 고사양
              <br />
              (RX 6700+/7600+)
            </button>
          </div>
        </div>
  
        <div style={{ marginBottom: "20px" }}>
          <h3
            style={{ fontSize: "16px", fontWeight: "600", marginBottom: "10px" }}
          >
            RAM 용량 빠른 선택:
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "10px",
              marginBottom: "10px"
            }}
          >
            <button
              onClick={() => applyRamPreset(8)}
              style={{
                padding: "8px",
                backgroundColor: "#f7fee7",
                border: "1px solid #bef264",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              8GB
            </button>
            <button
              onClick={() => applyRamPreset(16)}
              style={{
                padding: "8px",
                backgroundColor: "#f7fee7",
                border: "1px solid #bef264",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              16GB
            </button>
            <button
              onClick={() => applyRamPreset(32)}
              style={{
                padding: "8px",
                backgroundColor: "#f7fee7",
                border: "1px solid #bef264",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              32GB
            </button>
            <button
              onClick={() => applyRamPreset(64)}
              style={{
                padding: "8px",
                backgroundColor: "#f7fee7",
                border: "1px solid #bef264",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              64GB
            </button>
          </div>
        </div>
  
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "15px",
            marginBottom: "20px"
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#333"
              }}
            >
              CPU 코어 수
            </label>
            <input
              type="number"
              min="1"
              max="128"
              value={cpuCores}
              onChange={(e) => setCpuCores(parseInt(e.target.value))}
              style={{
                marginTop: "5px",
                width: "100%",
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "8px"
              }}
            />
          </div>
  
          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#333"
              }}
            >
              CPU 스레드 수
            </label>
            <input
              type="number"
              min="1"
              max="256"
              value={cpuThreads}
              onChange={(e) => setCpuThreads(parseInt(e.target.value))}
              style={{
                marginTop: "5px",
                width: "100%",
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "8px"
              }}
            />
          </div>
  
          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#333"
              }}
            >
              RAM 용량 (GB)
            </label>
            <input
              type="number"
              min="4"
              max="256"
              value={ram}
              onChange={(e) => setRam(parseInt(e.target.value))}
              style={{
                marginTop: "5px",
                width: "100%",
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "8px"
              }}
            />
          </div>
  
          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#333"
              }}
            >
              GPU 등급
            </label>
            <select
              value={gpuTier}
              onChange={(e) => setGpuTier(e.target.value)}
              style={{
                marginTop: "5px",
                width: "100%",
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "8px"
              }}
            >
              <option value="low">저사양 (GTX 1050/1650, RX 550/560)</option>
              <option value="mid">
                중사양 (RTX 3050/3060, GTX 1660/1070/1080, RX 5600/6600)
              </option>
              <option value="high">
                고사양 (RTX 3070+/4060+, RX 6700+/7600+)
              </option>
            </select>
          </div>
  
          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#333"
              }}
            >
              Unity 버전
            </label>
            <select
              value={unityVersion}
              onChange={(e) => setUnityVersion(e.target.value)}
              style={{
                marginTop: "5px",
                width: "100%",
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "8px"
              }}
            >
              <option value="2019">Unity 2019.x</option>
              <option value="2020">Unity 2020.x</option>
              <option value="2021.3">Unity 2021.3.x</option>
              <option value="2021.3">Unity 2021.3.x</option>
            <option value="2022">Unity 2022.x</option>
            <option value="2023">Unity 2023.x</option>
          </select>
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "500",
              color: "#333"
            }}
          >
            타겟 플랫폼
          </label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            style={{
              marginTop: "5px",
              width: "100%",
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "8px"
            }}
          >
            <option value="windows">Windows</option>
            <option value="mac">macOS</option>
            <option value="android">Android</option>
            <option value="ios">iOS</option>
            <option value="webgl">WebGL</option>
          </select>
        </div>
      </div>

      <button
        style={{
          width: "100%",
          backgroundColor: disclaimerAgreed ? "#22c55e" : "#9ca3af",
          color: "white",
          padding: "12px",
          borderRadius: "6px",
          border: "none",
          cursor: disclaimerAgreed ? "pointer" : "not-allowed",
          marginBottom: "20px"
        }}
        onClick={handleGenerateConfig}
      >
        boot.config 생성하기
      </button>

      {configOutput && (
        <div style={{ marginTop: "20px" }}>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "10px"
            }}
          >
            생성된 boot.config:
          </h2>
          <div style={{ position: "relative" }}>
            <pre
              style={{
                backgroundColor: "#f5f5f5",
                padding: "15px",
                borderRadius: "6px",
                overflow: "auto",
                maxHeight: "300px",
                fontSize: "13px"
              }}
            >
              {configOutput}
            </pre>
            <button
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                backgroundColor: "#444",
                color: "white",
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "12px",
                border: "none",
                cursor: "pointer"
              }}
              onClick={() => {
                navigator.clipboard.writeText(configOutput);
                alert("boot.config 내용이 클립보드에 복사되었습니다.");
              }}
            >
              복사
            </button>
          </div>

          <div
            style={{
              marginTop: "15px",
              padding: "15px",
              backgroundColor: "#ebf5ff",
              borderRadius: "6px",
              border: "1px solid #d1e9ff"
            }}
          >
            <h3
              style={{
                fontWeight: "600",
                color: "#1e40af",
                marginBottom: "10px"
              }}
            >
              사용 방법:
            </h3>
            <ol
              style={{
                paddingLeft: "20px",
                fontSize: "14px",
                color: "#1e3a8a"
              }}
            >
              <li style={{ marginBottom: "8px" }}>
                게임 Data 폴더에 접근하세요:
                <code
                  style={{
                    display: "block",
                    backgroundColor: "#e0f2fe",
                    padding: "8px",
                    margin: "5px 0",
                    borderRadius: "3px",
                    fontFamily: "monospace"
                  }}
                >
                  C:\Nexon\MabinogiMobile\MabinogiMobile_Data
                </code>
                <span style={{ color: "#4a5568", fontSize: "13px" }}>
                  (일반적으로 게임 설치 폴더 내의 [게임이름]_Data 폴더입니다)
                </span>
              </li>
              <li style={{ marginBottom: "8px" }}>
                기존 boot.config 파일이 있다면 이름을 변경하여 백업하세요:
                <code
                  style={{
                    display: "block",
                    backgroundColor: "#e0f2fe",
                    padding: "8px",
                    margin: "5px 0",
                    borderRadius: "3px",
                    fontFamily: "monospace"
                  }}
                >
                  boot.config → boot.config.backup
                </code>
              </li>
              <li style={{ marginBottom: "8px" }}>
                다운로드한 boot.config 파일을 Data 폴더에 넣으세요.
              </li>
              <li style={{ marginBottom: "0px" }}>
                마비노기 모바일을 재시작하면 최적화 설정이 적용됩니다.
              </li>
            </ol>
            
            <div
              style={{
                marginTop: "15px",
                padding: "10px",
                backgroundColor: "#fffbeb",
                borderRadius: "4px",
                border: "1px solid #fbd38d"
              }}
            >
              <p style={{ fontSize: "13px", color: "#723b13" }}>
                <strong>참고:</strong> 문제가 발생하면 백업한 원본 파일로 복원하세요. 이 설정은 모든 PC 환경에서 동일한 성능 향상을 보장하지 않습니다.
              </p>
            </div>
          </div>
        </div>
      )}

      {showHelpModal && <HelpModalComponent onClose={() => setShowHelpModal(false)} />}
    </div>
  );
};

// 다른 파일에서 사용할 수 있도록 글로벌 변수로 노출
window.App = App;