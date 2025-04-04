// React 컴포넌트 정의
const UnityConfigGenerator = () => {
  // 기본 상태값
  const [cpuCores, setCpuCores] = React.useState(6);
  const [cpuThreads, setCpuThreads] = React.useState(12);
  const [ram, setRam] = React.useState(32);
  const [gpuTier, setGpuTier] = React.useState("mid");
  const [unityVersion, setUnityVersion] = React.useState("2021.3");
  const [platform, setPlatform] = React.useState("windows");
  const [configOutput, setConfigOutput] = React.useState("");
  const [showHelpModal, setShowHelpModal] = React.useState(false);

  // 설정 생성 함수
  const generateConfig = () => {
    // 워커 수 계산 (보통 논리 코어/스레드 수의 3/4 정도가 최적)
    const workerCount = Math.max(1, Math.floor(cpuThreads * 0.75));

    // GPU 티어에 따른 설정 변경
    const maxChunksPerShader =
      gpuTier === "high" ? 12 : gpuTier === "mid" ? 8 : 4;
    const hdrEnabled = gpuTier === "low" ? 0 : 1;

    // RAM에 따른 메모리 블록 크기 계산
    const memoryMultiplier = ram >= 32 ? 2 : ram >= 16 ? 1.5 : 1;
    const baseBlockSize = 4194304;
    const baseMainAllocatorSize = 33554432;

    // Unity 버전별 특수 설정
    const versionSpecificSettings =
      unityVersion.startsWith("2021") || unityVersion.startsWith("2022")
        ? `use-static-batch=true
use-dynamic-batch=true
use-incremental-gc=true
dynamic-batching=true
renderthread=1`
        : "";

    // 모바일 플랫폼 특수 설정
    const androidSettings =
      platform === "android"
        ? `androidStartInFullscreen=1
androidRenderOutsideSafeArea=1
adaptive-performance-samsung-boost-launch=1`
        : "";

    // 최종 설정 생성
    const config = `gfx-enable-gfx-jobs=1
gfx-enable-native-gfx-jobs=1
max-chunks-per-shader=${maxChunksPerShader}
wait-for-native-debugger=0
vr-enabled=0
hdr-display-enabled=${hdrEnabled}
job-worker-count=${workerCount}
gc-max-time-slice=3
${androidSettings}
${versionSpecificSettings}
memorysetup-bucket-allocator-granularity=16
memorysetup-bucket-allocator-bucket-count=8
memorysetup-bucket-allocator-block-size=${Math.floor(
      baseBlockSize * memoryMultiplier
    )}
memorysetup-bucket-allocator-block-count=${ram >= 16 ? 2 : 1}
memorysetup-main-allocator-block-size=${Math.floor(
      baseMainAllocatorSize * memoryMultiplier
    )}
memorysetup-thread-allocator-block-size=${Math.floor(
      baseMainAllocatorSize * memoryMultiplier
    )}
memorysetup-gfx-main-allocator-block-size=${Math.floor(
      baseMainAllocatorSize * memoryMultiplier
    )}
memorysetup-gfx-thread-allocator-block-size=${Math.floor(
      baseMainAllocatorSize * memoryMultiplier
    )}
memorysetup-cache-allocator-block-size=${Math.floor(
      baseBlockSize * memoryMultiplier
    )}
memorysetup-typetree-allocator-block-size=${Math.floor(
      baseBlockSize * 0.5 * memoryMultiplier
    )}
memorysetup-profiler-bucket-allocator-granularity=16
memorysetup-profiler-bucket-allocator-bucket-count=8
memorysetup-profiler-bucket-allocator-block-size=${Math.floor(
      baseBlockSize * memoryMultiplier
    )}
memorysetup-profiler-bucket-allocator-block-count=${ram >= 16 ? 2 : 1}
memorysetup-profiler-allocator-block-size=${Math.floor(
      baseMainAllocatorSize * memoryMultiplier
    )}
memorysetup-profiler-editor-allocator-block-size=${Math.floor(
      baseBlockSize * 0.25 * memoryMultiplier
    )}
memorysetup-job-temp-allocator-block-size=${Math.floor(
      baseMainAllocatorSize * 2 * memoryMultiplier
    )}
memorysetup-job-temp-allocator-block-size-background=${Math.floor(
      baseBlockSize * 0.5 * memoryMultiplier
    )}
memorysetup-job-temp-allocator-reduction-small-platforms=262144
memorysetup-allocator-temp-initial-block-size-main=${Math.floor(
      baseBlockSize * 0.25 * memoryMultiplier
    )}
memorysetup-allocator-temp-initial-block-size-worker=${Math.floor(
      baseBlockSize * 0.25 * memoryMultiplier
    )}
memorysetup-temp-allocator-size-main=${Math.floor(
      baseMainAllocatorSize * 0.5 * memoryMultiplier
    )}
memorysetup-temp-allocator-size-preload-manager=${Math.floor(
      baseBlockSize * 0.25 * memoryMultiplier
    )}
memorysetup-temp-allocator-size-background-worker=${Math.floor(
      65536 * memoryMultiplier
    )}
memorysetup-temp-allocator-size-job-worker=${Math.floor(
      baseBlockSize * 0.25 * memoryMultiplier
    )}
memorysetup-temp-allocator-size-nav-mesh-worker=${Math.floor(
      131072 * memoryMultiplier
    )}
memorysetup-temp-allocator-size-audio-worker=${Math.floor(
      131072 * memoryMultiplier
    )}
memorysetup-temp-allocator-size-cloud-worker=${Math.floor(
      65536 * memoryMultiplier
    )}
memorysetup-temp-allocator-size-gfx=${Math.floor(
      baseBlockSize * 0.25 * memoryMultiplier
    )}`;

    // 설정 저장
    setConfigOutput(config);

    // 파일 다운로드
    downloadConfigFile(config);
  };

  // 파일 다운로드 함수
  const downloadConfigFile = (content) => {
    // Blob 객체 생성
    const blob = new Blob([content], { type: "text/plain" });

    // 다운로드 링크 생성
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "boot.config";

    // 링크 클릭 (다운로드 시작)
    document.body.appendChild(a);
    a.click();

    // 정리
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  };

  // CPU 프리셋 선택
  const applyCpuPreset = (preset) => {
    switch (preset) {
      case "intel-i5":
        setCpuCores(6);
        setCpuThreads(12);
        break;
      case "intel-i7":
        setCpuCores(8);
        setCpuThreads(16);
        break;
      case "intel-i9":
        setCpuCores(12);
        setCpuThreads(24);
        break;
      case "amd-r5":
        setCpuCores(6);
        setCpuThreads(12);
        break;
      case "amd-r7":
        setCpuCores(8);
        setCpuThreads(16);
        break;
      case "amd-r9":
        setCpuCores(12);
        setCpuThreads(24);
        break;
      default:
        break;
    }
  };

  // RAM 프리셋 선택
  const applyRamPreset = (ramAmount) => {
    setRam(ramAmount);
  };

  // GPU 프리셋 선택
  const applyGpuPreset = (preset) => {
    switch (preset) {
      case "nvidia-low":
        setGpuTier("low");
        break;
      case "nvidia-mid":
        setGpuTier("mid");
        break;
      case "nvidia-high":
        setGpuTier("high");
        break;
      case "amd-low":
        setGpuTier("low");
        break;
      case "amd-mid":
        setGpuTier("mid");
        break;
      case "amd-high":
        setGpuTier("high");
        break;
      default:
        break;
    }
  };

  // 도움말 모달
  const HelpModal = () => (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          width: "90%",
          maxWidth: "700px",
          maxHeight: "90vh",
          overflowY: "auto"
        }}
      >
        <h2
          style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "15px" }}
        >
          PC 사양 확인 방법
        </h2>

        <div style={{ marginBottom: "20px" }}>
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "600",
              marginBottom: "10px"
            }}
          >
            Windows 10/11에서 사양 확인하기
          </h3>
          <ol style={{ paddingLeft: "20px" }}>
            <li style={{ marginBottom: "8px" }}>
              <strong>CPU 및 RAM 확인:</strong>
              <ol style={{ paddingLeft: "20px", marginTop: "5px" }}>
                <li>
                  키보드에서{" "}
                  <code
                    style={{
                      backgroundColor: "#f0f0f0",
                      padding: "2px 4px",
                      borderRadius: "3px"
                    }}
                  >
                    Windows 키 + R
                  </code>{" "}
                  누르기
                </li>
                <li>
                  <code
                    style={{
                      backgroundColor: "#f0f0f0",
                      padding: "2px 4px",
                      borderRadius: "3px"
                    }}
                  >
                    dxdiag
                  </code>{" "}
                  입력하고 Enter 누르기
                </li>
                <li>
                  첫 번째 탭(시스템)에서 프로세서(CPU) 정보와 메모리(RAM) 용량
                  확인 가능
                </li>
              </ol>
            </li>
            <li style={{ marginBottom: "8px" }}>
              <strong>그래픽 카드(GPU) 확인:</strong>
              <ol style={{ paddingLeft: "20px", marginTop: "5px" }}>
                <li>동일한 dxdiag 창에서 "디스플레이" 탭 클릭</li>
                <li>"이름" 항목에서 그래픽 카드 모델 확인 가능</li>
              </ol>
            </li>
          </ol>
        </div>

        <button
          onClick={() => setShowHelpModal(false)}
          style={{
            padding: "8px 15px",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            display: "block",
            margin: "0 auto"
          }}
        >
          닫기
        </button>
      </div>
    </div>
  );

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
            onClick={() => applyCpuPreset("intel-i5")}
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
            onClick={() => applyCpuPreset("intel-i7")}
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
            onClick={() => applyCpuPreset("intel-i9")}
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
            onClick={() => applyCpuPreset("amd-r5")}
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
            onClick={() => applyCpuPreset("amd-r7")}
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
            onClick={() => applyCpuPreset("amd-r9")}
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
            onClick={() => applyGpuPreset("nvidia-low")}
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
            onClick={() => applyGpuPreset("nvidia-mid")}
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
            onClick={() => applyGpuPreset("nvidia-high")}
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
            onClick={() => applyGpuPreset("amd-low")}
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
            onClick={() => applyGpuPreset("amd-mid")}
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
            onClick={() => applyGpuPreset("amd-high")}
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
          backgroundColor: "#22c55e",
          color: "white",
          padding: "12px",
          borderRadius: "6px",
          border: "none",
          cursor: "pointer",
          marginBottom: "20px"
        }}
        onClick={generateConfig}
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
          </div>
        </div>
      )}

      {showHelpModal && <HelpModal />}
    </div>
  );
};

// 렌더링
ReactDOM.render(<UnityConfigGenerator />, document.getElementById("root"));
