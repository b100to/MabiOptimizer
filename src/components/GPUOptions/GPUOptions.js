import React, { useState, useEffect } from 'react';
import './GPUOptions.css';
import { applyGpuPreset } from '../../utils/configGenerator';

const GPUOptions = ({ setGpuTier }) => {
  const [selectedGpu, setSelectedGpu] = useState("medium");

  useEffect(() => {
    applyGpuPreset("medium", setGpuTier);
  }, [setGpuTier]);

  const handleGpuSelect = (gpuType) => {
    applyGpuPreset(gpuType, setGpuTier);
    setSelectedGpu(gpuType);
  };

  return (
    <div className="gpu-options">
      <h3 className="option-title">GPU 성능 선택:</h3>
      <div className="option-grid">
        <button
          onClick={() => handleGpuSelect("minimum")}
          className={`option-button ${selectedGpu === "minimum" ? "active" : ""}`}
        >
          <div className="option-content">
            <div className="option-title-main">매우 낮은 사양</div>
            <div className="option-subtitle">내장 그래픽 / 구형 그래픽카드</div>
            <div className="option-examples">
              <div className="brand">Intel HD/UHD Graphics</div>
              <div className="brand">AMD Vega 3/6</div>
              <div className="brand">NVIDIA GT 710/730</div>
            </div>
          </div>
        </button>
        <button
          onClick={() => handleGpuSelect("low")}
          className={`option-button ${selectedGpu === "low" ? "active" : ""}`}
        >
          <div className="option-content">
            <div className="option-title-main">낮은 사양</div>
            <div className="option-subtitle">엔트리급 전용 그래픽</div>
            <div className="option-examples">
              <div className="brand">NVIDIA GTX 1050/1630</div>
              <div className="brand">AMD RX 550/560</div>
              <div className="brand">Intel Arc A380</div>
            </div>
          </div>
        </button>
        <button
          onClick={() => handleGpuSelect("medium")}
          className={`option-button ${selectedGpu === "medium" ? "active" : ""}`}
        >
          <div className="option-content">
            <div className="option-title-main">중간 사양</div>
            <div className="option-subtitle">메인스트림 게이밍</div>
            <div className="option-examples">
              <div className="brand">NVIDIA GTX 1060-1660, RTX 2060</div>
              <div className="brand">AMD RX 5500 XT, RX 6600</div>
              <div className="brand">NVIDIA RTX 3050</div>
            </div>
          </div>
        </button>
        <button
          onClick={() => handleGpuSelect("high")}
          className={`option-button ${selectedGpu === "high" ? "active" : ""}`}
        >
          <div className="option-content">
            <div className="option-title-main">높은 사양</div>
            <div className="option-subtitle">고성능 게이밍</div>
            <div className="option-examples">
              <div className="brand">NVIDIA RTX 2070/2080</div>
              <div className="brand">NVIDIA RTX 3060 Ti/3070</div>
              <div className="brand">AMD RX 6700 XT, RX 7600</div>
            </div>
          </div>
        </button>
        <button
          onClick={() => handleGpuSelect("ultra")}
          className={`option-button ${selectedGpu === "ultra" ? "active" : ""}`}
        >
          <div className="option-content">
            <div className="option-title-main">최고 사양</div>
            <div className="option-subtitle">프리미엄 게이밍</div>
            <div className="option-examples">
              <div className="brand">NVIDIA RTX 3080/3090</div>
              <div className="brand">NVIDIA RTX 4070/4080/4090</div>
              <div className="brand">AMD RX 6800 XT/6900 XT</div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default GPUOptions; 