import React, { useState, useEffect } from 'react';
import './RamSlider.css';

// 기본 값과 범위 설정
const MIN_RAM = 4;
const MAX_RAM = 64;

const RamSlider = ({ ram, setRam }) => {
  // 슬라이더 값 상태
  const [sliderValue, setSliderValue] = useState(ramToSlider(ram));

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

  // 슬라이더 변경 시 실시간으로 RAM 값 업데이트
  const handleSliderChange = (e) => {
    const value = Number(e.target.value);
    setSliderValue(value);

    // 실시간으로 RAM 값 업데이트
    const newRamValue = sliderToRam(value);
    setRam(newRamValue);
  };

  // RAM 값이 외부에서 변경될 경우 슬라이더 값도 업데이트
  useEffect(() => {
    setSliderValue(ramToSlider(ram));
  }, [ram]);

  const scrollToGuide = () => {
    const guideElement = document.querySelector('.pc-spec-guide');
    if (guideElement) {
      guideElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="ram-slider">
      <div className="ram-header">
        <label className="ram-label">
          RAM 용량: <strong>{ram}GB</strong>
        </label>
        <button
          type="button"
          className="check-specs-button"
          onClick={scrollToGuide}>
          PC 사양 확인 방법
        </button>
      </div>

      <div className="slider-container">
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
  );
};

export default RamSlider; 