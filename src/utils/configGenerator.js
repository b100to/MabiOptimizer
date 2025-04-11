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
      maxChunksPerShader: 2,        // 감소: 최소 부하
      hdrEnabled: 0,
      gfxJobs: 0,
      renderThread: 0,
      textureQuality: "quarter",
      shadowDistance: 15,           // 감소: 최소 그림자 거리
      shadowCascades: 0,           // 비활성화: 그림자 캐스케이드
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
      maxChunksPerShader: 6,       // 감소: 적정 부하
      hdrEnabled: 0,
      gfxJobs: 0,                  // 비활성화: 그래픽 작업
      renderThread: 0,
      textureQuality: "half",
      shadowDistance: 35,          // 감소: 적정 그림자 거리
      shadowCascades: 1,          // 감소: 최소 캐스케이드
      particleQuality: 0,         // 감소: 파티클 비활성화
      reflections: 0,
      antiAliasing: 0            // 비활성화: AA
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
      maxChunksPerShader: 16,
      hdrEnabled: 1,
      gfxJobs: 1,
      renderThread: 1,
      textureQuality: "full",
      shadowDistance: 100,
      shadowCascades: 3,
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
      maxChunksPerShader: 20,
      hdrEnabled: 1,
      gfxJobs: 1,
      renderThread: 1,
      textureQuality: "full",
      shadowDistance: 150,
      shadowCascades: 4,
      particleQuality: 3,
      reflections: 2,
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
      maxChunksPerShader: 32,
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
    if (ram >= 256) return 5;      // 256GB 지원
    if (ram >= 128) return 4;
    if (ram >= 64) return 3.5;
    if (ram >= 32) return 2.75;
    if (ram >= 16) return 2;
    if (ram >= 8) return 1.5;
    return 1;
  };

  const getBucketCount = (ram) => {
    if (ram >= 256) return 128;    // 256GB 지원
    if (ram >= 128) return 96;     // 128GB 버킷 수 증가
    if (ram >= 64) return 64;
    if (ram >= 32) return 32;
    if (ram >= 16) return 24;
    if (ram >= 8) return 16;
    return 8;
  };

  const getBlockCount = (ram) => {
    if (ram >= 256) return 16;     // 256GB 지원
    if (ram >= 128) return 12;     // 128GB 블록 수 증가
    if (ram >= 64) return 8;
    if (ram >= 32) return 6;
    if (ram >= 16) return 4;
    if (ram >= 8) return 2;
    return 1;
  };

  const memoryMultiplier = getMemoryMultiplier(ram);
  const baseBlockSize = ram >= 128 ? 8388608 : 4194304;  // 8MB for high RAM
  const baseMainAllocatorSize = ram >= 128 ? 67108864 : 33554432;  // 64MB for high RAM

  // Unity 버전별 특수 설정
  const versionSpecificSettings = unityVersion.startsWith("2021") || unityVersion.startsWith("2022")
    ? `use-static-batch=true
use-dynamic-batch=true
use-incremental-gc=true
dynamic-batching=true
renderthread=${gpuTier === "minimum" || gpuTier === "low" ? 0 : 1}
gc-max-time-slice=${gpuTier === "minimum" || gpuTier === "low" ? 1 : 3}
use-compressed-mesh-data=1
use-compressed-texture-data=1
use-optimized-frame-pacing=1
use-fast-tier-swap=1
use-minimal-gc=1`
    : "";

  // 모바일 플랫폼 특수 설정
  const androidSettings = platform === "android"
    ? `androidStartInFullscreen=1
androidRenderOutsideSafeArea=1
adaptive-performance-samsung-boost-launch=1
use-frame-timing=1
use-job-worker-for-load-balancing=1
android-force-hard-shader-compression=1
android-enable-etw-profiling=0
android-shader-cache=1`
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
        mainSize: Math.floor(baseMainAllocatorSize * 0.75 * memoryMultiplier),
        workerSize: Math.floor(baseBlockSize * 0.5 * memoryMultiplier),
        backgroundSize: Math.floor(131072 * memoryMultiplier),
        navMeshSize: Math.floor(262144 * memoryMultiplier),
        audioSize: Math.floor(262144 * memoryMultiplier),
        cloudSize: Math.floor(131072 * memoryMultiplier),
        gfxSize: Math.floor(baseBlockSize * 0.5 * memoryMultiplier)
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
memorysetup-allocator-temp-initial-block-size-worker=${settings.temp.workerSize}
memorysetup-temp-allocator-size-ui-worker=${Math.floor(settings.temp.workerSize * 0.5)}
memorysetup-temp-allocator-size-shared-worker=${Math.floor(settings.temp.workerSize * 0.25)}
memorysetup-temp-allocator-size-job-worker=${Math.floor(settings.temp.workerSize * 0.75)}`;
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
optimize-mesh-data-jobs=${gpuTier === "minimum" || gpuTier === "low" ? 0 : 1}
use-incremental-build-roi=1
use-shader-compiler-cache=1
use-async-compilation=${gpuTier === "minimum" || gpuTier === "low" ? 0 : 1}
use-multi-threaded-compilation=${gpuTier === "minimum" || gpuTier === "low" ? 0 : 1}
use-load-time-texture-compression=1
use-background-job-worker=${gpuTier === "minimum" ? 0 : 1}
use-job-graph-recording=${gpuTier === "minimum" || gpuTier === "low" ? 0 : 1}
use-optimized-window-mode=1`;
};