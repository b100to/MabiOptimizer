import React, { useState, useEffect } from 'react';
import './CpuSlider.css';

// 기본 값과 범위 설정
const MIN_CORES = 2;
const MAX_CORES = 64;
const MIN_THREADS = 4;
const MAX_THREADS = 128;

const CpuSlider = ({ cores, threads, setCores, setThreads }) => {
    // 슬라이더 값 상태
    const [coreSliderValue, setCoreSliderValue] = useState(valueToCoreSlider(cores));
    const [threadSliderValue, setThreadSliderValue] = useState(valueToThreadSlider(threads));

    // 코어 값을 슬라이더 값(0-100)으로 변환
    function valueToCoreSlider(value) {
        const percentage = Math.log(value / MIN_CORES) / Math.log(MAX_CORES / MIN_CORES) * 100;
        return Math.max(0, Math.min(100, percentage));
    }

    // 스레드 값을 슬라이더 값(0-100)으로 변환
    function valueToThreadSlider(value) {
        const percentage = Math.log(value / MIN_THREADS) / Math.log(MAX_THREADS / MIN_THREADS) * 100;
        return Math.max(0, Math.min(100, percentage));
    }

    // 슬라이더 값을 코어 값으로 변환
    function sliderToCores(value) {
        const normalizedValue = value / 100;
        const coreValue = MIN_CORES * Math.pow(MAX_CORES / MIN_CORES, normalizedValue);
        // 일반적인 짝수로 반올림
        return Math.max(MIN_CORES, Math.min(MAX_CORES, Math.round(coreValue / 2) * 2));
    }

    // 슬라이더 값을 스레드 값으로 변환
    function sliderToThreads(value) {
        const normalizedValue = value / 100;
        const threadValue = MIN_THREADS * Math.pow(MAX_THREADS / MIN_THREADS, normalizedValue);
        // 일반적인 짝수로 반올림
        return Math.max(MIN_THREADS, Math.min(MAX_THREADS, Math.round(threadValue / 2) * 2));
    }

    // 코어 슬라이더 변경 핸들러
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

    // 스레드 슬라이더 변경 핸들러
    const handleThreadSliderChange = (e) => {
        const value = Number(e.target.value);
        setThreadSliderValue(value);
        const newThreadValue = sliderToThreads(value);
        // 스레드 수는 항상 코어 수보다 같거나 커야 함
        setThreads(Math.max(cores, newThreadValue));
    };

    // 외부 값 변경 시 슬라이더 업데이트
    useEffect(() => {
        setCoreSliderValue(valueToCoreSlider(cores));
    }, [cores]);

    useEffect(() => {
        setThreadSliderValue(valueToThreadSlider(threads));
    }, [threads]);

    return (
        <div className="cpu-slider">
            {/* 코어 슬라이더 */}
            <div className="cpu-section">
                <div className="cpu-header">
                    <label className="cpu-label">
                        CPU 코어: <strong>{cores}개</strong>
                    </label>
                </div>
                <div className="slider-container">
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

            {/* 스레드 슬라이더 */}
            <div className="cpu-section">
                <div className="cpu-header">
                    <label className="cpu-label">
                        CPU 스레드: <strong>{threads}개</strong>
                    </label>
                </div>
                <div className="slider-container">
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
    );
};

export default CpuSlider; 