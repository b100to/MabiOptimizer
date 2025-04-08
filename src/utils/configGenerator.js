// 설정 생성 관련 유틸리티 함수들

// CPU 프리셋 적용 함수
export const applyCpuPreset = (cpuType, setCpuCores, setCpuThreads) => {
  switch (cpuType) {
    case "entry-level":
      setCpuCores(4);
      setCpuThreads(8);
      break;
    case "mid-range-6c6t":
      setCpuCores(6);
      setCpuThreads(6);
      break;
    case "mid-range":
      setCpuCores(6);
      setCpuThreads(12);
      break;
    case "high-end":
      setCpuCores(8);
      setCpuThreads(16);
      break;
    case "premium":
      setCpuCores(12);
      setCpuThreads(24);
      break;
    default:
      // 기본값으로 중간 사양 설정
      setCpuCores(6);
      setCpuThreads(12);
      break;
  }
};

// GPU 프리셋 적용 함수
export const applyGpuPreset = (preset, setGpuTier) => {
  switch (preset) {
    case "low":
      setGpuTier("low");
      break;
    case "mid":
      setGpuTier("mid");
      break;
    case "high":
      setGpuTier("high");
      break;
    default:
      setGpuTier("mid"); // 기본값은 중간 사양
      break;
  }
};

// 파일 다운로드 함수
export const downloadConfigFile = (content) => {
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

// 설정 생성 함수
export const generateConfig = (cpuThreads, gpuTier, ram, unityVersion, platform) => {
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
  return `gfx-enable-gfx-jobs=1
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
};