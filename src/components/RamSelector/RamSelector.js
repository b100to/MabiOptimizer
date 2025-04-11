import React, { useState, useEffect } from 'react';
import './RamSelector.css';

// RAM 프리셋 정의
const RAM_PRESETS = {
    LOW: { name: '기본', size: 4 },
    BASIC: { name: '일반', size: 8 },
    MEDIUM: { name: '권장', size: 16 },
    HIGH: { name: '고성능', size: 32 },
    ULTRA: { name: '초고성능', size: 64 },
    EXTREME: { name: '프리미엄', size: 128 },
    MAX: { name: '최대', size: 256 },
    CUSTOM: { name: '직접 설정', size: null }
};

// 기본 값과 범위 설정
const MIN_RAM = 4;
const MAX_RAM = 256;

const RamSelector = ({ ram, setRam }) => {
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
    }, []);

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

    return (
        <div className="ram-selector">
            <div className="preset-buttons">
                {Object.entries(RAM_PRESETS).map(([key, preset]) => (
                    <button
                        key={key}
                        className={`preset-button ${selectedPreset === key ? 'active' : ''}`}
                        onClick={() => handlePresetChange(key)}
                    >
                        <div className="preset-name">{preset.name}</div>
                        {key !== 'CUSTOM' && (
                            <div className="preset-specs">
                                {preset.size}GB
                            </div>
                        )}
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
        </div>
    );
};

export default RamSelector; 