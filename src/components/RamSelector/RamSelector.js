import React, { useState, useEffect } from 'react';
import './RamSelector.css';

// RAM 프리셋 정의
const RAM_PRESETS = {
    LOW: {
        name: '최소 사양',
        size: 4
    },
    BASIC: {
        name: '일반 사양',
        size: 8
    },
    MEDIUM: {
        name: '권장 사양',
        size: 16
    },
    HIGH: {
        name: '고성능',
        size: 32
    },
    ULTRA: {
        name: '초고성능',
        size: 64
    },
    EXTREME: {
        name: '프리미엄',
        size: 128
    },
    CUSTOM: {
        name: '직접 설정',
        size: null
    }
};

// 기본 값과 범위 설정
const MIN_RAM = 4;
const MAX_RAM = 256;

const RamSelector = ({ ram, setRam, autoDetected = false }) => {
    const [selectedPreset, setSelectedPreset] = useState('CUSTOM');
    const [showSlider, setShowSlider] = useState(false);
    const [sliderValue, setSliderValue] = useState(ramToSlider(ram));

    // 초기 프리셋 설정
    useEffect(() => {
        // 현재 값이 프리셋과 일치하는지 확인
        const matchingPreset = Object.entries(RAM_PRESETS).find(
            ([key, preset]) => preset.size === ram
        );
        if (matchingPreset) {
            setSelectedPreset(matchingPreset[0]);
            setShowSlider(matchingPreset[0] === 'CUSTOM');
        } else {
            setSelectedPreset('CUSTOM');
            setShowSlider(true);
        }
    }, [ram]);

    // RAM 값을 슬라이더 값(0-100)으로 변환
    function ramToSlider(ramValue) {
        const percentage = Math.log(ramValue / MIN_RAM) / Math.log(MAX_RAM / MIN_RAM) * 100;
        return Math.max(0, Math.min(100, percentage));
    }

    // 슬라이더 값을 RAM 값으로 변환
    function sliderToRam(value) {
        const normalizedValue = value / 100;
        const ramValue = MIN_RAM * Math.pow(MAX_RAM / MIN_RAM, normalizedValue);
        // 짝수값으로 반올림
        const evenRamValue = Math.round(ramValue / 2) * 2;
        return Math.max(MIN_RAM, Math.min(MAX_RAM, evenRamValue));
    }

    // 프리셋 변경 핸들러
    const handlePresetChange = (presetKey) => {
        setSelectedPreset(presetKey);
        const preset = RAM_PRESETS[presetKey];

        if (presetKey === 'CUSTOM') {
            setShowSlider(true);
        } else {
            setShowSlider(false);
            setRam(preset.size);
            setSliderValue(ramToSlider(preset.size));
        }
    };

    // 슬라이더 변경 핸들러
    const handleSliderChange = (e) => {
        const value = Number(e.target.value);
        setSliderValue(value);
        const newRamValue = sliderToRam(value);
        setRam(newRamValue);
    };

    // 현재 RAM 값에 따른 프리셋 선택 상태
    const getRamPresetType = (ramValue) => {
        if (ramValue === 4) return 'LOW';
        if (ramValue === 8) return 'BASIC';
        if (ramValue === 16) return 'MEDIUM';
        if (ramValue === 32) return 'HIGH';
        if (ramValue === 64) return 'ULTRA';
        if (ramValue === 128) return 'EXTREME';
        return 'CUSTOM';
    };

    return (
        <div className="ram-selector">
            <h3 className="ram-selector-title">
                메모리(RAM) 선택:
            </h3>

            <div className="ram-notice">
                <p>
                    <strong>중요:</strong> 브라우저 보안 제한으로 인해 RAM은 자동으로 감지되지 않습니다.
                    PC에 설치된 RAM 용량에 맞게 아래 옵션에서 <strong>반드시 직접 선택해주세요.</strong>
                </p>
            </div>

            <div className="ram-preset-grid">
                {Object.entries(RAM_PRESETS).map(([key, preset]) => (
                    <button
                        key={key}
                        className={`ram-preset-button ${getRamPresetType(ram) === key ? 'active' : ''}`}
                        onClick={() => handlePresetChange(key)}
                    >
                        <div className="preset-content">
                            <div className="preset-name">{preset.name}</div>
                            {key !== 'CUSTOM' && (
                                <div className="preset-value">
                                    {preset.size}GB {ram === preset.size && <span className="ram-check-icon">✓</span>}
                                </div>
                            )}
                        </div>
                    </button>
                ))}
            </div>

            {showSlider && (
                <div className="slider-container">
                    <div className="slider-header">
                        <label className="slider-label">
                            RAM 용량: <strong>{ram}GB</strong>
                        </label>
                    </div>
                    <div className="slider-control">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="0.1"
                            value={sliderValue}
                            onChange={handleSliderChange}
                            className="ram-range-slider"
                        />
                        <div className="slider-range-labels">
                            <span className="min-label">{MIN_RAM}GB</span>
                            <span className="max-label">{MAX_RAM}GB</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="ram-tips">
                <p>
                    <strong>RAM 선택 도움말:</strong> 일반적으로 사용하시는 PC의 RAM 양에 따라 선택하세요.
                </p>
                <ul>
                    <li>4GB: 최소 사양 (기본적인 게임 플레이)</li>
                    <li>8GB: 일반 사양 (안정적인 게임 플레이)</li>
                    <li>16GB: 권장 사양 (대부분의 기능을 원활하게 사용)</li>
                    <li>32GB 이상: 고성능 (빠른 로딩과 대규모 전투에서 안정적인 성능)</li>
                </ul>
            </div>
        </div>
    );
};

// RAM 최적화 팁 반환 함수
const getOptimizationTip = (ram) => {
    if (ram >= 128) return '대용량 캐싱으로 극대화된 성능';
    if (ram >= 64) return '빠른 캐싱과 최상의 멀티태스킹';
    if (ram >= 32) return '원활한 대규모 전투와 빠른 로딩';
    if (ram >= 16) return '안정적인 게임 플레이와 빠른 로딩';
    if (ram >= 8) return '기본적인 게임 플레이에 적합';
    return '최소 사양으로 실행 가능';
};

export default RamSelector; 