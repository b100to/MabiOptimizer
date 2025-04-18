/**
 * 하드웨어 자동 감지 유틸리티
 * 브라우저의 API를 활용하여 CPU 코어/쓰레드, GPU 성능 등을 자동으로 감지
 * 
 * 참고: 이 기능은 Chrome 브라우저에서 가장 정확하게 작동합니다.
 * Firefox, Safari 등에서는 WebGL 정보 접근 제한으로 인해 정확도가 낮을 수 있습니다.
 */

/**
 * 현재 브라우저가 Chrome인지 확인
 * @returns {boolean} Chrome 브라우저 여부
 */
export const isChromeBrowser = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    return userAgent.indexOf('chrome') > -1 && userAgent.indexOf('edg') === -1 && userAgent.indexOf('opera') === -1;
};

/**
 * CPU 정보 자동 감지
 * @returns {Object} CPU 정보 (cores, threads, model)
 */
export const detectCPU = () => {
    // 기본값 설정
    const defaultInfo = {
        cores: 4,
        threads: 8,
        model: 'Unknown CPU',
        detectionSource: 'Default'
    };

    try {
        // navigator.hardwareConcurrency로 논리 프로세서(스레드) 수 확인
        const threads = navigator.hardwareConcurrency || defaultInfo.threads;

        // 코어 수 추정 (일반적으로 스레드 수의 절반이지만, 정확하진 않음)
        const estimatedCores = Math.max(1, Math.floor(threads / 2));

        // 기본 정보에 감지된 내용 병합
        return {
            cores: estimatedCores,
            threads: threads,
            model: navigator.userAgent.includes('Intel')
                ? 'Intel CPU'
                : navigator.userAgent.includes('AMD')
                    ? 'AMD CPU'
                    : 'Unknown CPU',
            detectionSource: 'navigator.hardwareConcurrency'
        };
    } catch (error) {
        console.error('CPU 감지 오류:', error);
        return defaultInfo;
    }
};

/**
 * GPU 성능 티어 추정
 * WebGL을 활용하여 GPU 성능을 추정
 * @returns {Object} GPU 정보 (model, tier, details)
 */
export const detectGPU = () => {
    // 기본값 설정
    const defaultInfo = {
        model: 'Unknown GPU',
        tier: 'medium',
        details: [],
        detectionSource: 'Default'
    };

    try {
        // WebGL 컨텍스트 생성
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

        if (!gl) {
            console.warn('WebGL을 지원하지 않는 환경입니다.');
            return defaultInfo;
        }

        // GPU 정보 수집
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');

        if (!debugInfo) {
            console.warn('WEBGL_debug_renderer_info 확장을 지원하지 않습니다.');
            return defaultInfo;
        }

        const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);

        // 성능 특성 확인
        const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        const maxCombinedTextureUnits = gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
        const maxRenderBufferSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);

        // GPU 모델명 추출
        const gpuModel = renderer || 'Unknown GPU';

        // GPU 티어 추정
        // 티어는 minimum, low, medium, high, ultra로 분류
        let tier = 'medium'; // 기본값

        const lowerRenderer = renderer ? renderer.toLowerCase() : '';

        // NVIDIA 카드 감지
        if (lowerRenderer.includes('nvidia')) {
            // Ultra 티어: 30K+ 벤치마크 점수 그래픽카드
            if (lowerRenderer.includes('rtx 5090') ||
                lowerRenderer.includes('rtx 5080') ||
                lowerRenderer.includes('geforce rtx 5090') ||
                lowerRenderer.includes('geforce rtx 5080') ||
                lowerRenderer.includes('rtx 4090') ||
                lowerRenderer.includes('rtx 4080') ||
                lowerRenderer.includes('rtx 3090 ti') ||
                lowerRenderer.includes('rtx 3090')) {
                tier = 'ultra';
            }
            // High 티어: 19K-30K 벤치마크 점수 그래픽카드
            else if (lowerRenderer.includes('rtx 5070') ||
                lowerRenderer.includes('geforce rtx 5070') ||
                lowerRenderer.includes('rtx 5060') ||
                lowerRenderer.includes('geforce rtx 5060') ||
                lowerRenderer.includes('rtx 4070') ||
                lowerRenderer.includes('rtx 4060') ||
                lowerRenderer.includes('rtx 3080') ||
                lowerRenderer.includes('rtx 3070') ||
                lowerRenderer.includes('rtx 3060 ti') ||
                lowerRenderer.includes('rtx 2080 ti')) {
                tier = 'high';
            }
            // Medium 티어: 12K-19K 벤치마크 점수 그래픽카드
            else if (lowerRenderer.includes('rtx 5050') ||
                lowerRenderer.includes('geforce rtx 5050') ||
                lowerRenderer.includes('rtx 3060') ||
                lowerRenderer.includes('rtx 3050') ||
                lowerRenderer.includes('rtx 2080') ||
                lowerRenderer.includes('rtx 2070') ||
                lowerRenderer.includes('gtx 1660') ||
                lowerRenderer.includes('gtx 1080')) {
                tier = 'medium';
            }
            // Low 티어: 8K-12K 벤치마크 점수 그래픽카드
            else if (lowerRenderer.includes('gtx 1650') ||
                lowerRenderer.includes('gtx 1060') ||
                lowerRenderer.includes('rtx 2060') ||
                lowerRenderer.includes('gtx 1050 ti')) {
                tier = 'low';
            }
            // Minimum 티어: 8K 미만 벤치마크 점수 그래픽카드
            else if (lowerRenderer.includes('gtx 1050') ||
                lowerRenderer.includes('mx') ||
                lowerRenderer.includes('gtx 9')) {
                tier = 'minimum';
            }
            // 위 조건에 해당하지 않는 경우 모델 번호로 예상
            else if (lowerRenderer.includes('rtx 50')) {
                // RTX 50 시리즈 번호 기반 분류
                if (lowerRenderer.includes('5090') || lowerRenderer.includes('5080')) {
                    tier = 'ultra';
                }
                else if (lowerRenderer.includes('5070') || lowerRenderer.includes('5060')) {
                    tier = 'high';
                }
                else if (lowerRenderer.includes('5050')) {
                    tier = 'medium';
                }
                else {
                    tier = 'high'; // 알 수 없는 RTX 50 시리즈는 기본적으로 high로 분류
                }
            }
            else if (lowerRenderer.includes('rtx 40')) {
                // 예외적으로 4050은 미디엄 티어로 분류
                if (lowerRenderer.includes('4050')) {
                    tier = 'medium';
                } else {
                    tier = 'high'; // 기본적으로 40 시리즈는 high로 간주
                }
            }
            else if (lowerRenderer.includes('rtx 30')) {
                tier = 'high';
            }
            else if (lowerRenderer.includes('rtx 20')) {
                tier = 'medium';
            }
            else if (lowerRenderer.includes('gtx 16')) {
                tier = 'medium';
            }
            else if (lowerRenderer.includes('gtx 10')) {
                tier = 'low';
            }
            else {
                tier = 'minimum';
            }
        }
        // AMD 카드 감지
        else if (lowerRenderer.includes('amd') || lowerRenderer.includes('radeon')) {
            // Ultra 티어: 30K+ 벤치마크 점수 그래픽카드
            if (lowerRenderer.includes('rx 7900 xtx') ||
                lowerRenderer.includes('rx 7900 xt')) {
                tier = 'ultra';
            }
            // High 티어: 19K-30K 벤치마크 점수 그래픽카드
            else if (lowerRenderer.includes('rx 7800 xt') ||
                lowerRenderer.includes('rx 7700 xt') ||
                lowerRenderer.includes('rx 6950 xt') ||
                lowerRenderer.includes('rx 6900 xt') ||
                lowerRenderer.includes('rx 6800 xt')) {
                tier = 'high';
            }
            // Medium 티어: 12K-19K 벤치마크 점수 그래픽카드
            else if (lowerRenderer.includes('rx 6800') ||
                lowerRenderer.includes('rx 7600 xt') ||
                lowerRenderer.includes('rx 6750 xt') ||
                lowerRenderer.includes('rx 6700 xt') ||
                lowerRenderer.includes('rx 6650 xt') ||
                lowerRenderer.includes('rx 7600')) {
                tier = 'medium';
            }
            // Low 티어: 8K-12K 벤치마크 점수 그래픽카드
            else if (lowerRenderer.includes('rx 6600') ||
                lowerRenderer.includes('rx 6500') ||
                lowerRenderer.includes('rx 5700') ||
                lowerRenderer.includes('rx 5600')) {
                tier = 'low';
            }
            // Minimum 티어: 8K 미만 벤치마크 점수 그래픽카드
            else if (lowerRenderer.includes('rx 5500') ||
                lowerRenderer.includes('rx 550') ||
                lowerRenderer.includes('rx 560')) {
                tier = 'minimum';
            }
            // 시리즈로 예상
            else if (lowerRenderer.includes('rx 7')) {
                tier = 'high';
            }
            else if (lowerRenderer.includes('rx 6')) {
                tier = 'medium';
            }
            else if (lowerRenderer.includes('rx 5')) {
                tier = 'low';
            }
            else {
                tier = 'minimum';
            }
        }
        // Intel 그래픽 감지
        else if (lowerRenderer.includes('intel')) {
            if (lowerRenderer.includes('arc a770') ||
                lowerRenderer.includes('arc a750')) {
                tier = 'medium';
            }
            else if (lowerRenderer.includes('arc a580') ||
                lowerRenderer.includes('arc a380')) {
                tier = 'low';
            }
            else if (lowerRenderer.includes('arc')) {
                tier = 'low';
            }
            else if (lowerRenderer.includes('iris')) {
                tier = 'minimum';
            }
            else {
                tier = 'minimum';
            }
        }

        // 텍스처 크기 기반 보정
        if (maxTextureSize <= 4096) {
            tier = adjustTierDown(tier);
        } else if (maxTextureSize >= 16384) {
            tier = adjustTierUp(tier);
        }

        return {
            model: gpuModel,
            vendor: vendor,
            tier: tier,
            details: [{
                cardName: gpuModel,
                vendor: vendor,
                maxTextureSize: maxTextureSize,
                maxCombinedTextureUnits: maxCombinedTextureUnits,
                maxRenderBufferSize: maxRenderBufferSize
            }],
            detectionSource: 'WebGL'
        };
    } catch (error) {
        console.error('GPU 감지 오류:', error);
        return defaultInfo;
    }
};

/**
 * RAM 크기 추정 - 개선된 버전
 * 여러 가지 방법을 조합하여 메모리 크기를 추정합니다.
 * @returns {Object} RAM 정보 (ramSizeGB)
 */
export const detectRAM = () => {
    // 메모리 감지의 정확도가 낮아 항상 기본값 반환
    return {
        ramSizeGB: 16,
        detectionSource: 'Default',
        originalText: '자동 감지 비활성화 (기본값 사용)'
    };
};

/**
 * 모든 하드웨어 정보 자동 감지
 * @returns {Object} 시스템 정보 (cpu, gpu, ram)
 */
export const detectHardware = () => {
    return {
        cpu: detectCPU(),
        gpu: detectGPU(),
        ram: detectRAM()
    };
};

// 티어 조정 유틸리티 함수들
const adjustTierUp = (currentTier) => {
    const tiers = ['minimum', 'low', 'medium', 'high', 'ultra'];
    const currentIndex = tiers.indexOf(currentTier);
    if (currentIndex < tiers.length - 1) {
        return tiers[currentIndex + 1];
    }
    return currentTier;
};

const adjustTierDown = (currentTier) => {
    const tiers = ['minimum', 'low', 'medium', 'high', 'ultra'];
    const currentIndex = tiers.indexOf(currentTier);
    if (currentIndex > 0) {
        return tiers[currentIndex - 1];
    }
    return currentTier;
}; 