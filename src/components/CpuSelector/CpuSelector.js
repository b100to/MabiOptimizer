import React, { useState, useEffect } from 'react';
import './CpuSelector.css';
import { applyCpuPreset } from '../../utils/configGenerator';

// CPU 프리셋 정의
const CPU_PRESETS = {
    BASIC: { name: '일반 사양', cores: 4, threads: 8 },
    MEDIUM: { name: '중간 사양', cores: 6, threads: 12 },
    HIGH: { name: '고성능', cores: 8, threads: 16 },
    EXTREME: { name: '프리미엄', cores: 12, threads: 24 },
    CUSTOM: { name: '직접 설정', cores: null, threads: null }
};

// 기본 값과 범위 설정
const MIN_CORES = 2;
const MAX_CORES = 64;
const MIN_THREADS = 2;
const MAX_THREADS = 128;

const CpuSelector = ({ cores, threads, setCores, setThreads, autoDetected = false }) => {
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
    }, [cores, threads]);

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
        const coreValue = MIN_CORES + normalizedValue * (MAX_CORES - MIN_CORES);
        // 짝수로 반올림
        const evenCoreValue = Math.round(coreValue / 2) * 2;
        return Math.max(MIN_CORES, Math.min(MAX_CORES, evenCoreValue));
    }

    function sliderToThreads(value) {
        const normalizedValue = value / 100;
        const threadValue = MIN_THREADS + normalizedValue * (MAX_THREADS - MIN_THREADS);
        // 짝수로 반올림
        const evenThreadValue = Math.round(threadValue / 2) * 2;
        return Math.max(MIN_THREADS, Math.min(MAX_THREADS, evenThreadValue));
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

    // CPU 프리셋 적용 함수
    const applyCpuPresetHandler = (presetType) => {
        // configGenerator.js의 applyCpuPreset 함수와 매핑
        const presetMap = {
            'basic': 'entry-level',
            'medium': 'mid-range',
            'high': 'high-end',
            'extreme': 'premium',
            'custom': 'custom'
        };

        // 매핑된 값으로 프리셋 적용
        if (presetType === 'custom') {
            setShowSliders(true);
        } else {
            applyCpuPreset(presetMap[presetType], setCores, setThreads);
            setShowSliders(false);
            // 슬라이더 값도 업데이트
            setTimeout(() => {
                setCoreSliderValue(valueToCoreSlider(cores));
                setThreadSliderValue(valueToThreadSlider(threads));
            }, 10);
        }
    };

    return (
        <div className="cpu-selector">
            <h3 className="cpu-selector-title">
                CPU 코어/스레드 선택:
                {autoDetected && <span className="auto-detected-badge">자동 감지됨</span>}
            </h3>

            <div className="cpu-preset-grid">
                <button
                    className={`cpu-preset-button ${cores === 4 && threads === 8 ? 'active' : ''}`}
                    onClick={() => applyCpuPresetHandler('basic')}
                    disabled={autoDetected}
                >
                    <div className="preset-name">일반 사양</div>
                    <div className="preset-value">4코어 / 8스레드</div>
                </button>

                <button
                    className={`cpu-preset-button ${cores === 6 && threads === 12 ? 'active' : ''}`}
                    onClick={() => applyCpuPresetHandler('medium')}
                    disabled={autoDetected}
                >
                    <div className="preset-name">중간 사양</div>
                    <div className="preset-value">6코어 / 12스레드</div>
                </button>

                <button
                    className={`cpu-preset-button ${cores === 8 && threads === 16 ? 'active' : ''}`}
                    onClick={() => applyCpuPresetHandler('high')}
                    disabled={autoDetected}
                >
                    <div className="preset-name">고성능</div>
                    <div className="preset-value">8코어 / 16스레드</div>
                </button>

                <button
                    className={`cpu-preset-button ${cores === 12 && threads === 24 ? 'active' : ''}`}
                    onClick={() => applyCpuPresetHandler('extreme')}
                    disabled={autoDetected}
                >
                    <div className="preset-name">프리미엄</div>
                    <div className="preset-value">12코어 / 24스레드</div>
                </button>

                <button
                    className={`cpu-preset-button custom-button ${!isPresetMatch(cores, threads) ? 'active' : ''}`}
                    onClick={() => applyCpuPresetHandler('custom')}
                    disabled={autoDetected}
                >
                    <div className="preset-name">직접 설정</div>
                    <div className="preset-value">사용자 지정</div>
                </button>
            </div>

            {autoDetected && (
                <div className="auto-detected-note">
                    <span>자동으로 감지된 CPU 코어/스레드 수에 맞게 설정되었습니다. 변경하려면 위의 '초기화' 버튼을 클릭하세요.</span>
                </div>
            )}

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

// 현재 코어/스레드 값이 미리 정의된 프리셋 중 하나와 일치하는지 확인
const isPresetMatch = (cores, threads) => {
    return (cores === 4 && threads === 8) ||
        (cores === 6 && threads === 12) ||
        (cores === 8 && threads === 16) ||
        (cores === 12 && threads === 24);
};

export default CpuSelector; 