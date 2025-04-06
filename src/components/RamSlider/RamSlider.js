import React, { useState, useEffect } from 'react';
import './RamSlider.css';

const RAM_OPTIONS = [4, 8, 16, 32, 64];

const RamSlider = ({ ram, setRam }) => {
  // 슬라이더 값을 위한 상태 추가
  const [sliderValue, setSliderValue] = useState(getSliderValue(ram));

  // RAM 값을 슬라이더 값(0-100)으로 변환하는 함수
  function getSliderValue(ramValue) {
    const index = RAM_OPTIONS.indexOf(ramValue);
    if (index !== -1) {
      return index * 25; // 0, 25, 50, 75, 100
    }
    // RAM 값이 기본 옵션에 없는 경우, 가장 가까운 위치를 계산
    for (let i = 0; i < RAM_OPTIONS.length - 1; i++) {
      if (ramValue > RAM_OPTIONS[i] && ramValue < RAM_OPTIONS[i + 1]) {
        const ratio = (ramValue - RAM_OPTIONS[i]) / (RAM_OPTIONS[i + 1] - RAM_OPTIONS[i]);
        return i * 25 + ratio * 25;
      }
    }
    return 50; // 기본값 (16GB)
  }

  // 슬라이더 값(0-100)을 RAM 값으로 변환하는 함수
  function getRamFromSlider(value) {
    // 가장 가까운 스텝으로 스냅
    const step = Math.round(value / 25);
    return RAM_OPTIONS[step] || 16; // 범위를 벗어난 경우 기본값 16GB
  }

  // 슬라이더 변경 시 RAM 값 업데이트
  const handleSliderChange = (e) => {
    const value = Number(e.target.value);
    setSliderValue(value);
  };

  // 슬라이더 드래그 완료 시 가장 가까운 RAM 값으로 스냅
  const handleSliderRelease = () => {
    const newRam = getRamFromSlider(sliderValue);
    setRam(newRam);
    setSliderValue(getSliderValue(newRam)); // 정확한 위치로 슬라이더 조정
  };

  // RAM 값이 외부에서 변경될 경우 슬라이더 값도 업데이트
  useEffect(() => {
    setSliderValue(getSliderValue(ram));
  }, [ram]);

  return (
    <div className="ram-slider">
      <label className="ram-label">
        RAM 용량: <strong>{ram}GB</strong>
      </label>
      <div className="slider-container">
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={sliderValue}
          onChange={handleSliderChange}
          onMouseUp={handleSliderRelease}
          onTouchEnd={handleSliderRelease}
          className="ram-range-slider"
        />
        <div className="slider-marks">
          {RAM_OPTIONS.map((size, index) => (
            <div
              key={size}
              className="slider-mark"
              style={{ left: `${index * 25}%` }}
              onClick={() => {
                setRam(size);
                setSliderValue(index * 25);
              }}
            >
              <span className="slider-mark-label">{size}GB</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RamSlider; 