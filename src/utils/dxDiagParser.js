/**
 * DxDiag 정보를 파싱하는 유틸리티 함수
 */

/**
 * CPU 정보 파싱
 * @param {string} dxDiagText DxDiag 텍스트 전체
 * @returns {Object} CPU 정보 객체 (모델명, 코어 수, 스레드 수)
 */
export const parseCpuInfo = (dxDiagText) => {
    const cpuInfo = {
        model: '',
        cores: 0,
        threads: 0
    };

    // CPU 정보 추출 - 여러 패턴 시도
    const processorPatterns = [
        /Processor:\s*(.*?)(?:\r?\n|$)/,
        /프로세서:\s*(.*?)(?:\r?\n|$)/,
        /처리기:\s*(.*?)(?:\r?\n|$)/,
        /CPU:\s*(.*?)(?:\r?\n|$)/,
        /Processor\s+Information:\s*(.*?)(?:\r?\n|$)/
    ];

    for (const pattern of processorPatterns) {
        const processorMatch = dxDiagText.match(pattern);
        if (processorMatch && processorMatch[1]) {
            cpuInfo.model = processorMatch[1].trim();
            break;
        }
    }

    // 코어/스레드 수 직접 추출 시도
    const coreMatch = dxDiagText.match(/(\d+)[ -]Core/i);
    const threadMatch = dxDiagText.match(/(\d+)[ -]?(?:Thread|CPUs)/i);

    if (coreMatch && coreMatch[1]) {
        cpuInfo.cores = parseInt(coreMatch[1]);
    }

    if (threadMatch && threadMatch[1]) {
        cpuInfo.threads = parseInt(threadMatch[1]);
    }

    // 직접 추출 실패한 경우 CPU 모델명에서 추정
    if (cpuInfo.model && (cpuInfo.cores === 0 || cpuInfo.threads === 0)) {
        const lowerModel = cpuInfo.model.toLowerCase();

        // 인텔 i3/i5/i7/i9 또는 AMD Ryzen 3/5/7/9 감지
        if (lowerModel.includes("i3") || lowerModel.includes("ryzen 3")) {
            cpuInfo.cores = cpuInfo.cores || 4;
            cpuInfo.threads = cpuInfo.threads || 8;
        } else if (lowerModel.includes("i5") || lowerModel.includes("ryzen 5")) {
            cpuInfo.cores = cpuInfo.cores || 6;
            cpuInfo.threads = cpuInfo.threads || 12;
        } else if (lowerModel.includes("i7") || lowerModel.includes("ryzen 7")) {
            cpuInfo.cores = cpuInfo.cores || 8;
            cpuInfo.threads = cpuInfo.threads || 16;
        } else if (lowerModel.includes("i9") || lowerModel.includes("ryzen 9")) {
            cpuInfo.cores = cpuInfo.cores || 12;
            cpuInfo.threads = cpuInfo.threads || 24;
        } else if (lowerModel.includes("xeon") || lowerModel.includes("threadripper")) {
            // 서버용 CPU 추정
            cpuInfo.cores = cpuInfo.cores || 12;
            cpuInfo.threads = cpuInfo.threads || 24;
        } else {
            // 기본값
            cpuInfo.cores = cpuInfo.cores || 6;
            cpuInfo.threads = cpuInfo.threads || 12;
        }
    }

    return cpuInfo;
};

/**
 * RAM 정보 파싱
 * @param {string} dxDiagText DxDiag 텍스트 전체
 * @returns {Object} RAM 정보 객체 (용량, 감지 소스, 원본 텍스트)
 */
export const parseRamInfo = (dxDiagText) => {
    let ramSizeGB = 8; // 기본값
    const regexPatterns = [
        /Memory:\s*(.*?)(?:\r?\n|$)/i,
        /Installed Memory:\s*(.*?)(?:\r?\n|$)/i,
        /Installed RAM:\s*(.*?)(?:\r?\n|$)/i,
        /RAM:\s*(.*?)(?:\r?\n|$)/i,
        /System Memory:\s*(.*?)(?:\r?\n|$)/i,
        /Total Memory:\s*(.*?)(?:\r?\n|$)/i,
    ];

    let ramText = '';
    for (const pattern of regexPatterns) {
        const match = dxDiagText.match(pattern);
        if (match && match[1]) {
            ramText = match[1].trim();
            break;
        }
    }

    if (ramText) {
        // 숫자 추출
        const numMatch = ramText.match(/(\d+(?:\.\d+)?)/);
        if (numMatch && numMatch[1]) {
            let value = parseFloat(numMatch[1]);

            // 단위 확인
            if (ramText.toLowerCase().includes('mb') || ramText.toLowerCase().includes('m')) {
                // MB를 GB로 변환
                value = value / 1024;
            } else if (ramText.toLowerCase().includes('kb') || ramText.toLowerCase().includes('k')) {
                // KB를 GB로 변환
                value = value / (1024 * 1024);
            } else if (ramText.toLowerCase().includes('tb') || ramText.toLowerCase().includes('t')) {
                // TB를 GB로 변환
                value = value * 1024;
            }

            // 값이 너무 작으면 단위가 잘못 인식된 것일 수 있음
            if (value < 1 && !ramText.toLowerCase().includes('mb') && !ramText.toLowerCase().includes('kb')) {
                // GB 단위로 가정하고 상향 조정
                value = value * 1024;
            }

            // 가까운 표준 RAM 크기로 반올림 (4, 8, 16, 32, 64, 128)
            const standardSizes = [4, 8, 16, 32, 64, 128];
            let closestSize = standardSizes[0];
            let minDiff = Math.abs(value - standardSizes[0]);

            for (let i = 1; i < standardSizes.length; i++) {
                const diff = Math.abs(value - standardSizes[i]);
                if (diff < minDiff) {
                    minDiff = diff;
                    closestSize = standardSizes[i];
                }
            }

            ramSizeGB = closestSize;
        }
    }

    return {
        ramSizeGB,
        detectionSource: ramText ? 'DxDiag' : 'Default',
        originalText: ramText || '자동 감지 실패 (기본값 사용)'
    };
};

/**
 * GPU 정보 파싱
 * @param {string} dxDiagText DxDiag 텍스트 전체
 * @returns {Object} GPU 정보 (모델명, 추정 티어)
 */
export const parseGpuInfo = (dxDiagText) => {
    const gpuInfo = {
        model: '',
        chipName: '',
        dedicatedMemory: '',
        vendor: '',
        tier: 'medium', // 기본값
        details: []
    };

    // DxDiag에서 그래픽 카드 섹션을 찾는 다양한 패턴
    const displaySectionPatterns = [
        /---------------\s*Display Devices\s*---------------([\s\S]*?)(?=---------------)/i,
        /---------------\s*디스플레이 장치\s*---------------([\s\S]*?)(?=---------------)/i,
        /------------\s*Display Devices\s*------------([\s\S]*?)(?=------------)/i,
        /------------\s*디스플레이 장치\s*------------([\s\S]*?)(?=------------)/i,
        /Display Devices:([\s\S]*?)(?=---------------)/i,
        /디스플레이 장치:([\s\S]*?)(?=---------------)/i,
        // 기존 Display Tab 섹션도 검색
        /Display Tab 1:([\s\S]*?)(?=(?:Sound Tab|Input Tab|---------------))/i
    ];

    let displaySection = '';

    // 디스플레이 섹션 찾기
    for (const pattern of displaySectionPatterns) {
        const displayMatch = dxDiagText.match(pattern);
        if (displayMatch && displayMatch[1]) {
            displaySection = displayMatch[1];
            break;
        }
    }

    // Display Devices 섹션이 없는 경우, 전체 텍스트에서 카드 정보 검색
    if (!displaySection) {
        console.log('GPU 섹션을 찾을 수 없습니다. 전체 텍스트에서 검색합니다.');
        displaySection = dxDiagText;
    }

    // 카드 이름을 추출하는 다양한 패턴
    const cardNamePatterns = [
        /Card name:\s*(.*?)(?:\r?\n|$)/gi,
        /카드 이름:\s*(.*?)(?:\r?\n|$)/gi,
        /Name:\s*(.*?)(?:\r?\n|$)/gi,
        /이름:\s*(.*?)(?:\r?\n|$)/gi,
        /Display adapter:\s*(.*?)(?:\r?\n|$)/gi,
        /디스플레이 어댑터:\s*(.*?)(?:\r?\n|$)/gi,
        /그래픽 카드:\s*(.*?)(?:\r?\n|$)/gi
    ];

    let cardNameMatches = [];

    // 모든 패턴으로 카드 이름 검색
    for (const pattern of cardNamePatterns) {
        const matches = [...displaySection.matchAll(pattern)];
        if (matches.length > 0) {
            cardNameMatches = matches;
            break;
        }
    }

    // NVIDIA 또는 AMD 관련 텍스트 찾기 (마지막 시도)
    if (cardNameMatches.length === 0) {
        console.log('GPU 카드 이름을 찾을 수 없습니다. 알려진 GPU 제조업체 키워드를 검색합니다.');
        const gpuKeywordsPattern = /(NVIDIA|AMD|Radeon|GeForce|Intel|Graphics)([^\r\n]{5,60})(?:\r?\n|$)/gi;
        cardNameMatches = [...displaySection.matchAll(gpuKeywordsPattern)];
    }

    // 모든 그래픽 카드 정보 추출
    const cardDetailsList = [];

    if (cardNameMatches.length > 0) {
        // 여러 그래픽 카드가 존재할 경우를 대비
        cardNameMatches.forEach((match, index) => {
            if (match && match[1]) {
                const cardName = match[1].trim();

                // 해당 카드의 주변 텍스트 (앞뒤 500자) 추출하여 분석
                const cardSectionStart = Math.max(0, displaySection.indexOf(match[0]) - 500);
                const cardSectionEnd = Math.min(displaySection.length, displaySection.indexOf(match[0]) + 500);
                const cardSection = displaySection.substring(cardSectionStart, cardSectionEnd);

                // 추가 세부 정보 추출
                const chipNameMatch = cardSection.match(/Chip (?:type|name):\s*(.*?)(?:\r?\n|$)/i) ||
                    cardSection.match(/칩 (?:유형|이름):\s*(.*?)(?:\r?\n|$)/i);

                const manufacturerMatch = cardSection.match(/Manufacturer:\s*(.*?)(?:\r?\n|$)/i) ||
                    cardSection.match(/제조업체:\s*(.*?)(?:\r?\n|$)/i);

                const dedicatedMemoryMatch = cardSection.match(/Dedicated Memory:\s*(.*?)(?:\r?\n|$)/i) ||
                    cardSection.match(/전용 메모리:\s*(.*?)(?:\r?\n|$)/i) ||
                    cardSection.match(/(?:VRAM|Graphics Memory):\s*(.*?)(?:\r?\n|$)/i);

                const driverVersionMatch = cardSection.match(/Driver Version:\s*(.*?)(?:\r?\n|$)/i) ||
                    cardSection.match(/드라이버 버전:\s*(.*?)(?:\r?\n|$)/i);

                // 비정상적인 카드 이름 필터링 (너무 짧거나 관계 없는 텍스트)
                if (cardName.length < 4 || /^(N\/A|Not Available|None)$/i.test(cardName)) {
                    return;
                }

                const cardDetails = {
                    cardName: cardName,
                    chipName: chipNameMatch && chipNameMatch[1] ? chipNameMatch[1].trim() : '',
                    manufacturer: manufacturerMatch && manufacturerMatch[1] ? manufacturerMatch[1].trim() : '',
                    dedicatedMemory: dedicatedMemoryMatch && dedicatedMemoryMatch[1] ? dedicatedMemoryMatch[1].trim() : '',
                    driverVersion: driverVersionMatch && driverVersionMatch[1] ? driverVersionMatch[1].trim() : '',
                    isIntegrated: isIntegratedGPU(cardName)
                };

                cardDetailsList.push(cardDetails);
            }
        });
    }

    // 찾은 GPU가 없다면 카드 이름만이라도 직접 찾기
    if (cardDetailsList.length === 0) {
        console.log('GPU 정보를 추출할 수 없습니다. 전체 텍스트에서 GPU 이름을 검색합니다.');

        // NVIDIA 또는 AMD 또는 Intel 그래픽 카드 관련 텍스트 찾기
        const gpuBrandKeywords = [
            'NVIDIA GeForce', 'NVIDIA RTX', 'NVIDIA GTX',
            'AMD Radeon', 'AMD RX', 'Radeon RX',
            'Intel Arc', 'Intel Iris', 'Intel HD Graphics', 'Intel UHD Graphics'
        ];

        let foundGPU = false;

        for (const keyword of gpuBrandKeywords) {
            const keywordWithPattern = new RegExp(keyword + '[\\w\\d\\s\\-]+(\\d+)?', 'i');
            const gpuMatch = dxDiagText.match(keywordWithPattern);

            if (gpuMatch && gpuMatch[0]) {
                const cardDetails = {
                    cardName: gpuMatch[0].trim(),
                    chipName: '',
                    manufacturer: keyword.includes('NVIDIA') ? 'NVIDIA' :
                        keyword.includes('AMD') ? 'AMD' :
                            keyword.includes('Intel') ? 'Intel' : '',
                    dedicatedMemory: '',
                    driverVersion: '',
                    isIntegrated: isIntegratedGPU(gpuMatch[0])
                };

                cardDetailsList.push(cardDetails);
                foundGPU = true;
                break;
            }
        }

        // 마지막 수단으로 일반적인 GPU 모델 패턴 검색
        if (!foundGPU) {
            const genericGPUPatterns = [
                /(?:RTX|GTX)\s+\d{3,4}(?:\s+Ti)?/i,
                /Radeon\s+(?:RX\s+)?\d{3,4}(?:\s+XT)?/i,
                /Intel\s+(?:Arc|Iris|HD|UHD)\s+\w+/i
            ];

            for (const pattern of genericGPUPatterns) {
                const gpuMatch = dxDiagText.match(pattern);
                if (gpuMatch && gpuMatch[0]) {
                    const cardDetails = {
                        cardName: gpuMatch[0].trim(),
                        chipName: '',
                        manufacturer: gpuMatch[0].includes('RTX') || gpuMatch[0].includes('GTX') ? 'NVIDIA' :
                            gpuMatch[0].includes('Radeon') ? 'AMD' :
                                gpuMatch[0].includes('Intel') ? 'Intel' : '',
                        dedicatedMemory: '',
                        driverVersion: '',
                        isIntegrated: isIntegratedGPU(gpuMatch[0])
                    };

                    cardDetailsList.push(cardDetails);
                    break;
                }
            }
        }
    }

    // 디버깅 로그 추가
    console.log(`감지된 GPU 수: ${cardDetailsList.length}`);

    // 통합/전용 그래픽 구분하여 주 그래픽 선택
    const dedicatedGPUs = cardDetailsList.filter(card => !card.isIntegrated);
    const integratedGPUs = cardDetailsList.filter(card => card.isIntegrated);

    // 전용 그래픽을 우선적으로 선택, 없으면 통합 그래픽 선택
    const primaryGPU = dedicatedGPUs.length > 0 ? dedicatedGPUs[0] : (integratedGPUs.length > 0 ? integratedGPUs[0] : null);

    if (primaryGPU) {
        gpuInfo.model = primaryGPU.cardName;
        gpuInfo.chipName = primaryGPU.chipName;
        gpuInfo.dedicatedMemory = primaryGPU.dedicatedMemory;
        gpuInfo.vendor = primaryGPU.manufacturer;
        gpuInfo.tier = determineGpuTier(primaryGPU.cardName);

        // 세부 정보에 모든 GPU 정보 포함
        gpuInfo.details = cardDetailsList;
    } else if (cardDetailsList.length > 0) {
        // 적어도 하나의 GPU가 감지되었지만 분류에 실패한 경우
        const firstGPU = cardDetailsList[0];
        gpuInfo.model = firstGPU.cardName;
        gpuInfo.chipName = firstGPU.chipName;
        gpuInfo.dedicatedMemory = firstGPU.dedicatedMemory;
        gpuInfo.vendor = firstGPU.manufacturer;
        gpuInfo.tier = determineGpuTier(firstGPU.cardName);

        gpuInfo.details = cardDetailsList;
    } else {
        // GPU를 감지하지 못한 경우
        console.log('GPU를 감지하지 못했습니다.');
        gpuInfo.model = 'Unknown GPU';
    }

    return gpuInfo;
};

/**
 * 내장 그래픽인지 확인
 * @param {string} cardName 그래픽 카드 이름
 * @returns {boolean} 내장 그래픽 여부
 */
const isIntegratedGPU = (cardName) => {
    if (!cardName) return true;

    const lowerCardName = cardName.toLowerCase();

    // Intel 통합 그래픽 확인
    if (lowerCardName.includes('intel') ||
        lowerCardName.includes('hd graphics') ||
        lowerCardName.includes('uhd graphics') ||
        lowerCardName.includes('iris') ||
        lowerCardName.includes('gma')) {
        return true;
    }

    // AMD 통합 그래픽 확인
    if ((lowerCardName.includes('amd') || lowerCardName.includes('ati')) &&
        (lowerCardName.includes('radeon') &&
            (lowerCardName.includes('vega') ||
                lowerCardName.includes('graphics') ||
                lowerCardName.includes('igpu')))) {
        return true;
    }

    // NVIDIA 통합 그래픽 (드물지만 존재)
    if (lowerCardName.includes('nvidia') && (
        lowerCardName.includes('mx') ||
        lowerCardName.includes('integrated') ||
        lowerCardName.includes('onboard'))) {
        return true;
    }

    return false;
};

/**
 * GPU 티어 결정
 * @param {string} cardName 그래픽 카드 이름
 * @returns {string} GPU 티어 (ultra, high, medium, low, minimum)
 */
const determineGpuTier = (cardName) => {
    if (!cardName) return 'medium';

    const model = cardName.toLowerCase();

    // NVIDIA 그래픽 카드
    if (model.includes('nvidia') || model.includes('geforce')) {
        // RTX 4000 시리즈
        if (model.includes('rtx 40')) {
            if (model.includes('4090') || model.includes('4080')) {
                return 'ultra';
            } else if (model.includes('4070')) {
                return 'ultra';
            } else if (model.includes('4060')) {
                return 'high';
            } else if (model.includes('4050')) {
                return 'medium';
            }
        }
        // RTX 3000 시리즈
        else if (model.includes('rtx 30')) {
            if (model.includes('3090') || model.includes('3080')) {
                return 'ultra';
            } else if (model.includes('3070')) {
                return 'high';
            } else if (model.includes('3060')) {
                return 'high';
            } else if (model.includes('3050')) {
                return 'medium';
            }
        }
        // RTX 2000 시리즈
        else if (model.includes('rtx 20')) {
            if (model.includes('2080')) {
                return 'high';
            } else if (model.includes('2070')) {
                return 'high';
            } else if (model.includes('2060')) {
                return 'medium';
            }
        }
        // GTX 16xx 시리즈
        else if (model.includes('gtx 16')) {
            if (model.includes('1660')) {
                return 'medium';
            } else if (model.includes('1650')) {
                return 'low';
            }
        }
        // GTX 10xx 시리즈
        else if (model.includes('gtx 10')) {
            if (model.includes('1080')) {
                return 'medium';
            } else if (model.includes('1070')) {
                return 'medium';
            } else if (model.includes('1060')) {
                return 'medium';
            } else if (model.includes('1050')) {
                return 'low';
            }
        }
        // 구형 GTX 시리즈
        else if (model.includes('gtx 9')) {
            if (model.includes('980')) {
                return 'low';
            } else {
                return 'minimum';
            }
        }
        else if (model.includes('gtx 7') || model.includes('gtx 8')) {
            return 'minimum';
        }
        // 기타 엔트리급 GPU
        else if (model.includes('gt') || model.includes('mx')) {
            return 'minimum';
        }
    }
    // AMD 그래픽 카드
    else if (model.includes('amd') || model.includes('radeon') || model.includes('ati')) {
        // Radeon RX 7000 시리즈
        if (model.includes('rx 7') || model.includes('rx7')) {
            if (model.includes('7900')) {
                return 'ultra';
            } else if (model.includes('7800')) {
                return 'ultra';
            } else if (model.includes('7700')) {
                return 'high';
            } else if (model.includes('7600')) {
                return 'high';
            } else if (model.includes('7500')) {
                return 'medium';
            }
        }
        // Radeon RX 6000 시리즈
        else if (model.includes('rx 6') || model.includes('rx6')) {
            if (model.includes('6900') || model.includes('6950') || model.includes('6800 xt')) {
                return 'ultra';
            } else if (model.includes('6800') || model.includes('6750') || model.includes('6700')) {
                return 'high';
            } else if (model.includes('6650') || model.includes('6600')) {
                return 'medium';
            } else if (model.includes('6500') || model.includes('6400')) {
                return 'low';
            }
        }
        // Radeon RX 5000 시리즈
        else if (model.includes('rx 5') || model.includes('rx5')) {
            if (model.includes('5700')) {
                return 'medium';
            } else if (model.includes('5600')) {
                return 'medium';
            } else if (model.includes('5500')) {
                return 'low';
            }
        }
        // Radeon RX Vega 시리즈
        else if (model.includes('vega')) {
            if (model.includes('vega 64') || model.includes('vega 56')) {
                return 'medium';
            } else {
                return 'low';
            }
        }
        // 구형 Radeon
        else if (model.includes('rx 4') || model.includes('rx4') || model.includes('rx 3') || model.includes('rx3')) {
            return 'low';
        }
        else if (model.includes('hd')) {
            return 'minimum';
        }
    }
    // Intel 내장 그래픽 & 외장 GPU
    else if (model.includes('intel') || model.includes('hd graphics') || model.includes('uhd graphics')) {
        if (model.includes('arc a7')) {
            return 'medium';
        } else if (model.includes('arc a5')) {
            return 'low';
        } else if (model.includes('arc a3')) {
            return 'low';
        } else if (model.includes('iris xe')) {
            return 'low';
        } else if (model.includes('iris plus') || model.includes('iris pro')) {
            return 'minimum';
        } else if (model.includes('uhd graphics')) {
            return 'minimum';
        } else if (model.includes('hd graphics')) {
            return 'minimum';
        }
    }

    // 기본 GPU 티어 (알 수 없는 경우)
    return 'medium';
};

/**
 * DxDiag 텍스트에서 모든 시스템 정보 파싱
 * @param {string} dxDiagText DxDiag 텍스트 전체
 * @returns {Object} 파싱된 시스템 정보
 */
export const parseDxDiagText = (dxDiagText) => {
    if (!dxDiagText) {
        return {
            cpu: { model: 'Unknown', cores: 6, threads: 12 },
            ram: { ramSizeGB: 8, detectionSource: 'Default', originalText: '자동 감지 실패 (기본값 사용)' },
            gpu: { model: 'Unknown', tier: 'medium', details: [] }
        };
    }

    // 입력 텍스트 정규화
    const normalizedText = dxDiagText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    console.log('DxDiag 텍스트 파싱 시작...');

    const cpu = parseCpuInfo(normalizedText);
    const ram = parseRamInfo(normalizedText);
    const gpu = parseGpuInfo(normalizedText);

    console.log('파싱 결과:', { cpu, ram, gpu });

    return {
        cpu,
        ram,
        gpu
    };
}; 