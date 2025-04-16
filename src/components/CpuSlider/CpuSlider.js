import React, { useState, useEffect } from 'react';
import './CpuSlider.css';

// 기본 값과 범위 설정
const MIN_THREADS = 4;
const MAX_THREADS = 128;

const CpuSlider = ({ threads, setThreads }) => {
    // 슬라이더 값 상태
    const [threadSliderValue, setThreadSliderValue] = useState(valueToThreadSlider(threads));

    // 스레드 값을 슬라이더 값(0-100)으로 변환
    function valueToThreadSlider(value) {
        // 로그 스케일로 변환
        const percentage = Math.log(value / MIN_THREADS) / Math.log(MAX_THREADS / MIN_THREADS) * 100;
        return Math.max(0, Math.min(100, percentage));
    }

    // 슬라이더 값을 스레드 값으로 변환
    function sliderToThreads(value) {
        // 로그 스케일로 변환
        const normalizedValue = value / 100;
        // 지수 함수를 사용하여 로그 스케일 변환
        const rawValue = MIN_THREADS * Math.pow(MAX_THREADS / MIN_THREADS, normalizedValue);
        // 가장 가까운 짝수로 반올림
        const threadValue = Math.round(rawValue / 2) * 2;
        return Math.max(MIN_THREADS, Math.min(MAX_THREADS, threadValue));
    }

    // 스레드 슬라이더 변경 핸들러
    const handleThreadSliderChange = (e) => {
        const value = Number(e.target.value);
        setThreadSliderValue(value);
        const newThreadValue = sliderToThreads(value);
        setThreads(newThreadValue);
    };

    // 외부 값 변경 시 슬라이더 업데이트
    useEffect(() => {
        setThreadSliderValue(valueToThreadSlider(threads));
    }, [threads]);

    // 워커 수 계산 (CPU 스레드의 80%를 활용)
    const workerCount = Math.max(1, Math.floor(threads * 0.8));

    return (
        <div className="cpu-slider">
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

            {/* 워커 수 정보 표시 */}
            <div className="worker-info">
                <div className="worker-count">
                    <span className="worker-label">작업자 수(Job Workers):</span>
                    <span className="worker-value">{workerCount}개</span>
                </div>
                <div className="worker-description">
                    스레드 수의 80%가 게임 작업자로 사용됩니다. 작업자는 게임의 계산 작업을 분산 처리합니다.
                </div>
            </div>

            {/* 도움말 정보 */}
            <div className="cpu-info">
                <p className="info-text">
                    CPU 스레드 수는 게임의 병렬 처리 성능에 직접적인 영향을 줍니다.
                    하이퍼스레딩 또는 SMT가 있는 CPU는 코어당 2개의 스레드를 지원합니다.
                </p>
            </div>
        </div>
    );
};

export default CpuSlider; 