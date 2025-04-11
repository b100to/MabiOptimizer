import React, { useState, useEffect } from 'react';
import './CpuSelector.css';

// CPU 프리셋 정의
const CPU_PRESETS = {
    BASIC: { name: '일반 사양', cores: 4, threads: 8 },
    MEDIUM: { name: '중간 사양', cores: 8, threads: 16 },
    HIGH: { name: '고성능', cores: 16, threads: 32 },
    EXTREME: { name: '프리미엄', cores: 32, threads: 64 },
    CUSTOM: { name: '직접 설정', cores: null, threads: null }
};

// 기본 값과 범위 설정
const MIN_CORES = 2;
const MAX_CORES = 64;
const MIN_THREADS = 4;
const MAX_THREADS = 128;

const CpuSelector = ({ cores, threads, setCores, setThreads }) => {
    const [selectedPreset, setSelectedPreset] = useState('MEDIUM');
    const [showSliders, setShowSliders] = useState(false);
    const [coreSliderValue, setCoreSliderValue] = useState(valueToCoreSlider(cores));
    const [threadSliderValue, setThreadSliderValue] = useState(valueToThreadSlider(threads));

    // 초기 프리셋 설정
    useEffect(() => {
        // 현재 값이 프리셋과 일치하는지 확인
        const matchingPreset = Object.entries(CPU_PRESETS).find(
            ([key, preset]) => preset.cores === cores && preset.threads === threads
        );
        if (matchingPreset) {
            setSelectedPreset(matchingPreset[0]);
            setShowSliders(matchingPreset[0] === 'CUSTOM');
        } else {
            setSelectedPreset('CUSTOM');
            setShowSliders(true);
        }
    }, []);

    // 값을 슬라이더 값(0-100)으로 변환하는 함수들
    function valueToCoreSlider(value) {
        const percentage = Math.log(value / MIN_CORES) / Math.log(MAX_CORES / MIN_CORES) * 100;
        return Math.max(0, Math.min(100, percentage));
    }

    function valueToThreadSlider(value) {
        const percentage = Math.log(value / MIN_THREADS) / Math.log(MAX_THREADS / MIN_THREADS) * 100;
        return Math.max(0, Math.min(100, percentage));
    }

    // 슬라이더 값을 실제 값으로 변환하는 함수들
    function sliderToCores(value) {
        const normalizedValue = value / 100;
        const coreValue = MIN_CORES * Math.pow(MAX_CORES / MIN_CORES, normalizedValue);
        // 2의 배수로 반올림
        const powerOfTwo = Math.round(Math.log2(coreValue));
        return Math.max(MIN_CORES, Math.min(MAX_CORES, Math.pow(2, powerOfTwo)));
    }

    function sliderToThreads(value) {
        const normalizedValue = value / 100;
        const threadValue = MIN_THREADS * Math.pow(MAX_THREADS / MIN_THREADS, normalizedValue);
        // 코어 수의 배수로 반올림
        const multiplier = Math.round(threadValue / cores);
        return Math.max(MIN_THREADS, Math.min(MAX_THREADS, cores * multiplier));
    }

    // 프리셋 변경 핸들러
    const handlePresetChange = (presetKey) => {
        setSelectedPreset(presetKey);
        const preset = CPU_PRESETS[presetKey];

        if (presetKey === 'CUSTOM') {
            setShowSliders(true);
        } else {
            setShowSliders(false);
            setCores(preset.cores);
            setThreads(preset.threads);
            setCoreSliderValue(valueToCoreSlider(preset.cores));
            setThreadSliderValue(valueToThreadSlider(preset.threads));
        }
    };

    // 슬라이더 변경 핸들러
    const handleCoreSliderChange = (e) => {
        const value = Number(e.target.value);
        setCoreSliderValue(value);
        const newCoreValue = sliderToCores(value);
        setCores(newCoreValue);

        // 코어가 변경되면 스레드도 자동으로 조정
        const newThreadValue = Math.max(newCoreValue * 2, threads);
        setThreads(newThreadValue);
        setThreadSliderValue(valueToThreadSlider(newThreadValue));
    };

    const handleThreadSliderChange = (e) => {
        const value = Number(e.target.value);
        setThreadSliderValue(value);
        const newThreadValue = sliderToThreads(value);
        setThreads(Math.max(cores, newThreadValue));
    };

    return (
        <div className="cpu-selector">
            <h3 className="option-title">CPU 성능 선택:</h3>
            <div className="preset-buttons">
                {Object.entries(CPU_PRESETS).map(([key, preset]) => (
                    <button
                        key={key}
                        className={`preset-button ${selectedPreset === key ? 'active' : ''}`}
                        onClick={() => handlePresetChange(key)}
                    >
                        <div className="preset-name">{preset.name}</div>
                        {key !== 'CUSTOM' && (
                            <div className="preset-specs">
                                {preset.cores}코어 / {preset.threads}스레드
                            </div>
                        )}
                    </button>
                ))}
            </div>

            {showSliders && (
                <div className="sliders-container">
                    <div className="slider-section">
                        <div className="slider-header">
                            <label className="slider-label">
                                CPU 코어: <strong>{cores}개</strong>
                            </label>
                        </div>
                        <div className="slider-control">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                step="0.1"
                                value={coreSliderValue}
                                onChange={handleCoreSliderChange}
                                className="cpu-range-slider"
                            />
                            <div className="slider-range-labels">
                                <span className="min-label">{MIN_CORES}개</span>
                                <span className="max-label">{MAX_CORES}개</span>
                            </div>
                        </div>
                    </div>

                    <div className="slider-section">
                        <div className="slider-header">
                            <label className="slider-label">
                                CPU 스레드: <strong>{threads}개</strong>
                            </label>
                        </div>
                        <div className="slider-control">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                step="0.1"
                                value={threadSliderValue}
                                onChange={handleThreadSliderChange}
                                className="cpu-range-slider"
                            />
                            <div className="slider-range-labels">
                                <span className="min-label">{MIN_THREADS}개</span>
                                <span className="max-label">{MAX_THREADS}개</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CpuSelector; 