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
        console.log('WebGL 감지된 그래픽카드:', lowerRenderer); // 디버깅용 로그

        // ANGLE과 같은 특수 형식 처리를 위한 검색 패턴 제작
        // 그래픽카드 이름을 추출하기 위한 정규식 패턴
        const cardPattern = (card) => {
            return new RegExp(`\\b${card}\\b`, 'i');
        };

        // 정확한 모델명 추출을 위한 정규식
        const extractModelRegex = /(?:nvidia geforce|amd|intel) (rtx|gtx|rx|arc|iris)[ -]([0-9a-z]+)/i;
        const modelMatch = lowerRenderer.match(extractModelRegex);

        let extractedModel = '';
        if (modelMatch && modelMatch.length >= 3) {
            extractedModel = `${modelMatch[1]} ${modelMatch[2]}`.toLowerCase();
            console.log('추출된 그래픽카드 모델:', extractedModel);
        }

        // NVIDIA 카드 감지
        if (lowerRenderer.includes('nvidia')) {
            // 정확한 모델 번호 체크 (추출된 모델이나 원본 문자열에서)
            const checkModel = (model) => {
                return cardPattern(model).test(lowerRenderer) || (extractedModel && cardPattern(model).test(extractedModel));
            };

            // Ultra 티어: 30K+ 벤치마크 점수 그래픽카드
            if (checkModel('rtx 5090') ||
                checkModel('rtx 5080') ||
                checkModel('rtx 4090') ||
                checkModel('rtx 4080') ||
                checkModel('rtx 3090 ti') ||
                checkModel('rtx 3090')) {
                tier = 'ultra';
            }
            // High 티어: 19K-30K 벤치마크 점수 그래픽카드
            else if (checkModel('rtx 5070') ||
                checkModel('rtx 5060') ||
                checkModel('rtx 4070') ||
                checkModel('rtx 4070 ti') ||
                checkModel('rtx 3080') ||
                checkModel('rtx 3070') ||
                checkModel('rtx 3060 ti') ||
                checkModel('rtx 2080 ti')) {
                tier = 'high';
            }
            // Medium 티어: 12K-19K 벤치마크 점수 그래픽카드
            else if (checkModel('rtx 5050') ||
                checkModel('rtx 4060') ||
                checkModel('rtx 3060') ||
                checkModel('rtx 3050') ||
                checkModel('rtx 2080') ||
                checkModel('rtx 2070') ||
                checkModel('gtx 1660') ||
                checkModel('gtx 1080')) {
                tier = 'medium';
            }
            // Low 티어: 8K-12K 벤치마크 점수 그래픽카드
            else if (checkModel('rtx 40')) {
                // RTX 40 시리즈 분류
                if (checkModel('4090') || checkModel('4080')) {
                    tier = 'ultra';
                }
                else if (checkModel('4070')) {
                    tier = 'high';
                }
                else if (checkModel('4060') || checkModel('4050')) {
                    tier = 'medium';  // 4060은 medium 티어
                }
                else {
                    tier = 'high'; // 기타 알 수 없는 40 시리즈
                }
            }
            else if (checkModel('rtx 30')) {
                tier = 'high';
            }
            else if (checkModel('rtx 20')) {
                tier = 'medium';
            }
            else if (checkModel('gtx 16')) {
                tier = 'medium';
            }
            else if (checkModel('gtx 10')) {
                tier = 'low';
            }
            else {
                tier = 'minimum';
            }
        }
        // AMD 카드 감지
        else if (lowerRenderer.includes('amd') || lowerRenderer.includes('radeon')) {
            // 정확한 모델 번호 체크 (추출된 모델이나 원본 문자열에서)
            const checkModel = (model) => {
                return cardPattern(model).test(lowerRenderer) || (extractedModel && cardPattern(model).test(extractedModel));
            };

            // Ultra 티어: 30K+ 벤치마크 점수 그래픽카드
            if (checkModel('rx 7900 xtx') ||
                checkModel('rx 7900 xt')) {
                tier = 'ultra';
            }
            // High 티어: 19K-30K 벤치마크 점수 그래픽카드
            else if (checkModel('rx 7800 xt') ||
                checkModel('rx 7700 xt') ||
                checkModel('rx 6950 xt') ||
                checkModel('rx 6900 xt') ||
                checkModel('rx 6800 xt')) {
                tier = 'high';
            }
            // Medium 티어: 12K-19K 벤치마크 점수 그래픽카드
            else if (checkModel('rx 6800') ||
                checkModel('rx 7600 xt') ||
                checkModel('rx 6750 xt') ||
                checkModel('rx 6700 xt') ||
                checkModel('rx 6650 xt') ||
                checkModel('rx 7600')) {
                tier = 'medium';
            }
            // Low 티어: 8K-12K 벤치마크 점수 그래픽카드
            else if (checkModel('rx 6600') ||
                checkModel('rx 6500') ||
                checkModel('rx 5700') ||
                checkModel('rx 5600')) {
                tier = 'low';
            }
            // Minimum 티어: 8K 미만 벤치마크 점수 그래픽카드
            else if (checkModel('rx 5500') ||
                checkModel('rx 550') ||
                checkModel('rx 560')) {
                tier = 'minimum';
            }
            // 시리즈로 예상
            else if (checkModel('rx 7')) {
                tier = 'high';
            }
            else if (checkModel('rx 6')) {
                tier = 'medium';
            }
            else if (checkModel('rx 5')) {
                tier = 'low';
            }
            else {
                tier = 'minimum';
            }
        }
        // Intel 그래픽 감지
        else if (lowerRenderer.includes('intel')) {
            // 정확한 모델 번호 체크 (추출된 모델이나 원본 문자열에서)
            const checkModel = (model) => {
                return cardPattern(model).test(lowerRenderer) || (extractedModel && cardPattern(model).test(extractedModel));
            };

            if (checkModel('arc a770') ||
                checkModel('arc a750')) {
                tier = 'medium';
            }
            else if (checkModel('arc a580') ||
                checkModel('arc a380')) {
                tier = 'low';
            }
            else if (checkModel('arc')) {
                tier = 'low';
            }
            else if (checkModel('iris')) {
                tier = 'minimum';
            }
            else {
                tier = 'minimum';
            }
        }

        // 모델명에서 직접 RTX 4060 감지
        if (lowerRenderer.includes('4060') ||
            (extractedModel && extractedModel.includes('rtx 4060'))) {
            // RTX 4060은 벤치마크 점수가 19,789점으로 medium 티어로 강제 설정
            console.log('RTX 4060 감지됨 - medium 티어로 분류');
            tier = 'medium';
            return {
                model: gpuModel,
                vendor: vendor,
                tier: tier,
                details: [{
                    cardName: gpuModel,
                    vendor: vendor,
                    maxTextureSize: maxTextureSize,
                    maxCombinedTextureUnits: maxCombinedTextureUnits,
                    maxRenderBufferSize: maxRenderBufferSize,
                    detectionNote: 'RTX 4060 직접 감지'
                }],
                detectionSource: 'WebGL + Direct Model Detection'
            };
        }

        // 텍스처 크기 기반 보정 (RTX 4060을 제외한 나머지 그래픽카드에 적용)
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