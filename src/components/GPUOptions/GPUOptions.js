import React, { useState, useEffect } from 'react';
import './GPUOptions.css';
import { applyGpuPreset } from '../../utils/configGenerator';

const GPUOptions = ({ setGpuTier }) => {
  const [selectedGpu, setSelectedGpu] = useState("nvidia-mid");

  useEffect(() => {
    applyGpuPreset("nvidia-mid", setGpuTier);
  }, [setGpuTier]);

  const handleGpuSelect = (gpuType) => {
    applyGpuPreset(gpuType, setGpuTier);
    setSelectedGpu(gpuType);
  };

  return (
    <div className="gpu-options">
      <h3 className="option-title">GPU 모델 빠른 선택:</h3>
      <div className="gpu-categories">
        <div className="gpu-category">
          <h4 className="category-title">NVIDIA</h4>
          <div className="gpu-buttons">
            <button
              onClick={() => handleGpuSelect("nvidia-low")}
              className={`gpu-button ${selectedGpu === "nvidia-low" ? "active" : ""}`}
            >
              엔트리급 (GT 1030, GTX 1050)
            </button>
            <button
              onClick={() => handleGpuSelect("nvidia-mid")}
              className={`gpu-button ${selectedGpu === "nvidia-mid" ? "active" : ""}`}
            >
              미들급 (GTX 1060-1660, RTX 2060)
            </button>
            <button
              onClick={() => handleGpuSelect("nvidia-high")}
              className={`gpu-button ${selectedGpu === "nvidia-high" ? "active" : ""}`}
            >
              하이엔드 (RTX 2070 이상)
            </button>
          </div>
        </div>

        <div className="gpu-category">
          <h4 className="category-title">AMD</h4>
          <div className="gpu-buttons">
            <button
              onClick={() => handleGpuSelect("amd-low")}
              className={`gpu-button ${selectedGpu === "amd-low" ? "active" : ""}`}
            >
              엔트리급 (RX 550, RX 560)
            </button>
            <button
              onClick={() => handleGpuSelect("amd-mid")}
              className={`gpu-button ${selectedGpu === "amd-mid" ? "active" : ""}`}
            >
              미들급 (RX 570-590, RX 5500)
            </button>
            <button
              onClick={() => handleGpuSelect("amd-high")}
              className={`gpu-button ${selectedGpu === "amd-high" ? "active" : ""}`}
            >
              하이엔드 (RX 5700 이상)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GPUOptions; 