// 설정 생성 관련 유틸리티 함수들

// CPU 프리셋 적용 함수
export const applyCpuPreset = (cpuType, setCpuCores, setCpuThreads) => {
  switch (cpuType) {
    case "entry-level":
      setCpuCores(4);
      setCpuThreads(8);
      break;
    case "mid-range-4c4t":
      setCpuCores(4);
      setCpuThreads(4);
      break;
    case "mid-range-6c6t":
      setCpuCores(6);
      setCpuThreads(6);
      break;
    case "mid-range":
      setCpuCores(6);
      setCpuThreads(12);
      break;
    case "high-end-8c8t":
      setCpuCores(8);
      setCpuThreads(8);
      break;
    case "high-end":
      setCpuCores(8);
      setCpuThreads(16);
      break;
    case "premium-12c12t":
      setCpuCores(12);
      setCpuThreads(12);
      break;
    case "premium":
      setCpuCores(12);
      setCpuThreads(24);
      break;
    case "hybrid-14c20t":
      setCpuCores(14);
      setCpuThreads(20);
      break;
    default:
      // 기본값으로 중간 사양 설정
      setCpuCores(6);
      setCpuThreads(12);
      break;
  }
};

// GPU 설정 정의
const GPU_SETTINGS = {
  "minimum": {
    description: "인텔 내장 그래픽 또는 매우 낮은 사양의 그래픽카드",
    examples: [
      "Intel HD Graphics 4000+",
      "Intel UHD Graphics 610/620",
      "AMD Radeon Vega 3/6",
      "NVIDIA GeForce GT 710/730"
    ],
    settings: {
      maxChunksPerShader: 4,
      hdrEnabled: 0,
      gfxJobs: 0,
      renderThread: 0,
      textureQuality: "quarter",
      shadowDistance: 25,
      shadowCascades: 1,
      particleQuality: 0,
      reflections: 0,
      antiAliasing: 0
    }
  },
  "low": {
    description: "엔트리급 전용 그래픽카드",
    examples: [
      "NVIDIA GeForce GTX 1050/1050 Ti",
      "NVIDIA GeForce GTX 1630",
      "AMD Radeon RX 550/560",
      "Intel Arc A380"
    ],
    settings: {
      maxChunksPerShader: 8,
      hdrEnabled: 0,
      gfxJobs: 0,
      renderThread: 0,
      textureQuality: "half",
      shadowDistance: 50,
      shadowCascades: 2,
      particleQuality: 1,
      reflections: 0,
      antiAliasing: 0
    }
  },
  "medium": {
    description: "중급 게이밍용 그래픽카드",
    examples: [
      "NVIDIA GeForce GTX 1060/1660",
      "NVIDIA GeForce RTX 2060",
      "NVIDIA GeForce RTX 3050",
      "AMD Radeon RX 5500 XT",
      "AMD Radeon RX 6600"
    ],
    settings: {
      maxChunksPerShader: 12,
      hdrEnabled: 1,
      gfxJobs: 1,
      renderThread: 1,
      textureQuality: "full",
      shadowDistance: 100,
      shadowCascades: 2,
      particleQuality: 2,
      reflections: 1,
      antiAliasing: 1
    }
  },
  "high": {
    description: "고성능 게이밍용 그래픽카드",
    examples: [
      "NVIDIA GeForce RTX 2070/2080",
      "NVIDIA GeForce RTX 3060 Ti/3070",
      "NVIDIA GeForce RTX 4060 Ti",
      "AMD Radeon RX 6700 XT",
      "AMD Radeon RX 7600"
    ],
    settings: {
      maxChunksPerShader: 16,
      hdrEnabled: 1,
      gfxJobs: 1,
      renderThread: 1,
      textureQuality: "full",
      shadowDistance: 150,
      shadowCascades: 3,
      particleQuality: 3,
      reflections: 1,
      antiAliasing: 2
    }
  },
  "ultra": {
    description: "최고급 게이밍용 그래픽카드",
    examples: [
      "NVIDIA GeForce RTX 3080/3090",
      "NVIDIA GeForce RTX 4070/4080/4090",
      "AMD Radeon RX 6800 XT/6900 XT",
      "AMD Radeon RX 7700 XT/7800 XT/7900 XTX"
    ],
    settings: {
      maxChunksPerShader: 24,
      hdrEnabled: 1,
      gfxJobs: 1,
      renderThread: 1,
      textureQuality: "full",
      shadowDistance: 200,
      shadowCascades: 4,
      particleQuality: 3,
      reflections: 2,
      antiAliasing: 2
    }
  }
};

// GPU 프리셋 적용 함수
export const applyGpuPreset = (gpuType, setGpuTier) => {
  // GPU 설정이 존재하는지 확인
  if (GPU_SETTINGS[gpuType]) {
    setGpuTier(gpuType);
  } else {
    // 존재하지 않는 설정일 경우 medium으로 기본 설정
    setGpuTier("medium");
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
  // 워커 수 계산 (CPU 스레드의 80%를 활용)
  const workerCount = Math.max(1, Math.floor(cpuThreads * 0.8));

  // GPU 설정 가져오기
  const gpuConfig = GPU_SETTINGS[gpuTier]?.settings || GPU_SETTINGS.medium.settings;
  const {
    maxChunksPerShader,
    hdrEnabled,
    gfxJobs,
    renderThread,
    textureQuality,
    shadowDistance,
    shadowCascades,
    particleQuality,
    reflections,
    antiAliasing
  } = gpuConfig;

  // RAM에 따른 메모리 설정 계산
  const getMemoryMultiplier = (ram) => {
    if (ram >= 64) return 3;
    if (ram >= 32) return 2.5;
    if (ram >= 16) return 1.75;
    if (ram >= 8) return 1.25;
    return 1;
  };

  const getBucketCount = (ram) => {
    if (ram >= 32) return 32;
    if (ram >= 16) return 16;
    return 8;
  };

  const getBlockCount = (ram) => {
    if (ram >= 32) return 4;
    if (ram >= 16) return 2;
    return 1;
  };

  const memoryMultiplier = getMemoryMultiplier(ram);
  const baseBlockSize = 4194304;  // 4MB
  const baseMainAllocatorSize = 33554432;  // 32MB

  // Unity 버전별 특수 설정
  const versionSpecificSettings = unityVersion.startsWith("2021") || unityVersion.startsWith("2022")
    ? `use-static-batch=true
use-dynamic-batch=true
use-incremental-gc=true
dynamic-batching=true
renderthread=${gpuTier === "minimum" || gpuTier === "low" ? 0 : 1}
gc-max-time-slice=${gpuTier === "minimum" || gpuTier === "low" ? 1 : 3}`
    : "";

  // 모바일 플랫폼 특수 설정
  const androidSettings = platform === "android"
    ? `androidStartInFullscreen=1
androidRenderOutsideSafeArea=1
adaptive-performance-samsung-boost-launch=1`
    : "";

  // 메모리 설정 생성
  const generateMemorySettings = () => {
    const settings = {
      bucket: {
        blockSize: Math.floor(baseBlockSize * memoryMultiplier),
        mainAllocSize: Math.floor(baseMainAllocatorSize * memoryMultiplier),
        bucketCount: getBucketCount(ram),
        blockCount: getBlockCount(ram)
      },
      temp: {
        mainSize: Math.floor(baseMainAllocatorSize * 0.5 * memoryMultiplier),
        workerSize: Math.floor(baseBlockSize * 0.25 * memoryMultiplier),
        backgroundSize: Math.floor(65536 * memoryMultiplier),
        navMeshSize: Math.floor(131072 * memoryMultiplier),
        audioSize: Math.floor(131072 * memoryMultiplier),
        cloudSize: Math.floor(65536 * memoryMultiplier),
        gfxSize: Math.floor(baseBlockSize * 0.25 * memoryMultiplier)
      }
    };

    return `memorysetup-bucket-allocator-granularity=16
memorysetup-bucket-allocator-bucket-count=${settings.bucket.bucketCount}
memorysetup-bucket-allocator-block-size=${settings.bucket.blockSize}
memorysetup-bucket-allocator-block-count=${settings.bucket.blockCount}
memorysetup-main-allocator-block-size=${settings.bucket.mainAllocSize}
memorysetup-thread-allocator-block-size=${settings.bucket.mainAllocSize}
memorysetup-gfx-main-allocator-block-size=${settings.bucket.mainAllocSize}
memorysetup-gfx-thread-allocator-block-size=${settings.bucket.mainAllocSize}
memorysetup-cache-allocator-block-size=${settings.bucket.blockSize}
memorysetup-typetree-allocator-block-size=${Math.floor(settings.bucket.blockSize * 0.5)}
memorysetup-profiler-bucket-allocator-granularity=16
memorysetup-profiler-bucket-allocator-bucket-count=${settings.bucket.bucketCount}
memorysetup-profiler-bucket-allocator-block-size=${settings.bucket.blockSize}
memorysetup-profiler-bucket-allocator-block-count=${settings.bucket.blockCount}
memorysetup-profiler-allocator-block-size=${settings.bucket.mainAllocSize}
memorysetup-profiler-editor-allocator-block-size=${Math.floor(settings.bucket.blockSize * 0.25)}
memorysetup-temp-allocator-size-main=${settings.temp.mainSize}
memorysetup-temp-allocator-size-worker=${settings.temp.workerSize}
memorysetup-temp-allocator-size-background-worker=${settings.temp.backgroundSize}
memorysetup-temp-allocator-size-nav-mesh-worker=${settings.temp.navMeshSize}
memorysetup-temp-allocator-size-audio-worker=${settings.temp.audioSize}
memorysetup-temp-allocator-size-cloud-worker=${settings.temp.cloudSize}
memorysetup-temp-allocator-size-gfx=${settings.temp.gfxSize}
memorysetup-job-temp-allocator-block-size=${Math.floor(settings.bucket.mainAllocSize * 2)}
memorysetup-job-temp-allocator-block-size-background=${Math.floor(settings.bucket.blockSize * 0.5)}
memorysetup-job-temp-allocator-reduction-small-platforms=262144
memorysetup-allocator-temp-initial-block-size-main=${settings.temp.workerSize}
memorysetup-allocator-temp-initial-block-size-worker=${settings.temp.workerSize}`;
  };

  // 최종 설정 생성
  return `gfx-enable-gfx-jobs=${gfxJobs}
gfx-enable-native-gfx-jobs=${gfxJobs}
max-chunks-per-shader=${maxChunksPerShader}
wait-for-native-debugger=0
vr-enabled=0
hdr-display-enabled=${hdrEnabled}
job-worker-count=${workerCount}
gc-max-time-slice=${gpuTier === "minimum" || gpuTier === "low" ? 1 : 3}
renderthread=${renderThread}
texture-quality=${textureQuality}
shadow-distance=${shadowDistance}
shadow-cascades=${shadowCascades}
particle-quality=${particleQuality}
reflection-quality=${reflections}
anti-aliasing=${antiAliasing}
${androidSettings}
${versionSpecificSettings}
${generateMemorySettings()}
use-optimized-mesh-data=1
use-shader-cache=1
use-job-worker-for-mesh-data=${gpuTier === "minimum" || gpuTier === "low" ? 0 : 1}
optimize-mesh-data-jobs=${gpuTier === "minimum" || gpuTier === "low" ? 0 : 1}`;
};