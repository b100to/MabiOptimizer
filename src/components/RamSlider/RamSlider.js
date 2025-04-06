import React, { useState, useEffect } from 'react';
import './RamSlider.css';

// 기본 값과 범위 설정
const MIN_RAM = 4;
const MAX_RAM = 64;
const SNAP_POINTS = [4, 8, 16, 24, 32, 36, 48, 64]; // 참조용 스냅 포인트

const RamSlider = ({ ram, setRam }) => {
  // 슬라이더 값 상태
  const [sliderValue, setSliderValue] = useState(ramToSlider(ram));
  // 슬라이더가 스냅 포인트로 점프할지 여부 - 기본값 false로 변경
  const [snapEnabled, setSnapEnabled] = useState(false);

  // RAM 값을 슬라이더 값(0-100)으로 변환
  function ramToSlider(ramValue) {
    // 로그 스케일로 변환 (더 직관적인 사용감)
    const percentage = Math.log(ramValue / MIN_RAM) / Math.log(MAX_RAM / MIN_RAM) * 100;
    return Math.max(0, Math.min(100, percentage));
  }

  // 슬라이더 값(0-100)을 RAM 값으로 변환
  function sliderToRam(value) {
    // 로그 스케일 역변환
    const normalizedValue = value / 100;
    const ramValue = MIN_RAM * Math.pow(MAX_RAM / MIN_RAM, normalizedValue);
    // 정수값으로 반올림
    return Math.max(MIN_RAM, Math.min(MAX_RAM, Math.round(ramValue)));
  }

  // 가장 가까운 스냅 포인트 찾기
  function findNearestSnapPoint(value) {
    return SNAP_POINTS.reduce((prev, curr) =>
      Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
    );
  }

  // 슬라이더 변경 시 실시간으로 RAM 값 업데이트
  const handleSliderChange = (e) => {
    const value = Number(e.target.value);
    setSliderValue(value);

    // 실시간으로 RAM 값 업데이트
    const newRamValue = sliderToRam(value);
    setRam(newRamValue);
  };

  // 슬라이더 드래그 완료 시 스냅 포인트로 이동 (활성화된 경우)
  const handleSliderRelease = () => {
    if (snapEnabled) {
      const currentRam = sliderToRam(sliderValue);
      const snappedRam = findNearestSnapPoint(currentRam);

      setRam(snappedRam);
      setSliderValue(ramToSlider(snappedRam));
    }
  };

  // RAM 값이 외부에서 변경될 경우 슬라이더 값도 업데이트
  useEffect(() => {
    setSliderValue(ramToSlider(ram));
  }, [ram]);

  return (
    <div className="ram-slider">
      <div className="ram-header">
        <label className="ram-label">
          RAM 용량: <strong>{ram}GB</strong>
        </label>
        <div className="snap-toggle">
          <label className="snap-label">
            <input
              type="checkbox"
              checked={snapEnabled}
              onChange={(e) => setSnapEnabled(e.target.checked)}
              className="snap-checkbox"
            />
            <span>스냅 활성화</span>
          </label>
        </div>
      </div>

      <div className="slider-container">
        <input
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={sliderValue}
          onChange={handleSliderChange}
          onMouseUp={handleSliderRelease}
          onTouchEnd={handleSliderRelease}
          className="ram-range-slider"
        />
        <div className="slider-marks">
          {SNAP_POINTS.map((size) => {
            const position = ramToSlider(size);
            return (
              <div
                key={size}
                className="slider-mark"
                style={{ left: `${position}%` }}
                onClick={() => {
                  setRam(size);
                  setSliderValue(ramToSlider(size));
                }}
              >
                <span className="slider-mark-label">{size}GB</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RamSlider; 