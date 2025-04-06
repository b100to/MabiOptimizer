import React, { useState, useEffect } from 'react';
import './GPUOptions.css';
import { applyGpuPreset } from '../../utils/configGenerator';

const GPUOptions = ({ setGpuTier }) => {
  const [selectedGpu, setSelectedGpu] = useState("mid");

  useEffect(() => {
    applyGpuPreset("mid", setGpuTier);
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
          onClick={() => handleGpuSelect("low")}
          className={`option-button ${selectedGpu === "low" ? "active" : ""}`}
        >
          <div className="option-content">
            <div className="option-title-main">저사양 GPU</div>
            <div className="option-subtitle">올드 모델 / 내장 그래픽</div>
            <div className="option-examples">
              <div className="brand nvidia">NVIDIA: GT 1030, GTX 1050</div>
              <div className="brand amd">AMD: RX 550, RX 560, Vega 8</div>
              <div className="brand etc">Intel: UHD/Iris 그래픽</div>
            </div>
          </div>
        </button>
        <button
          onClick={() => handleGpuSelect("mid")}
          className={`option-button ${selectedGpu === "mid" ? "active" : ""}`}
        >
          <div className="option-content">
            <div className="option-title-main">중간사양 GPU</div>
            <div className="option-subtitle">메인스트림 모델</div>
            <div className="option-examples">
              <div className="brand nvidia">NVIDIA: GTX 1060-1660, RTX 2060, RTX 3050</div>
              <div className="brand amd">AMD: RX 570-590, RX 5500, RX 6500</div>
            </div>
          </div>
        </button>
        <button
          onClick={() => handleGpuSelect("high")}
          className={`option-button ${selectedGpu === "high" ? "active" : ""}`}
        >
          <div className="option-content">
            <div className="option-title-main">고사양 GPU</div>
            <div className="option-subtitle">하이엔드 모델</div>
            <div className="option-examples">
              <div className="brand nvidia">NVIDIA: RTX 2070 이상, RTX 3060 Ti 이상</div>
              <div className="brand amd">AMD: RX 5700 이상, RX 6600 이상</div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default GPUOptions; 