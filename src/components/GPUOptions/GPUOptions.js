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
      <div className="option-grid">
        <button
          onClick={() => handleGpuSelect("nvidia-low")}
          className={`option-button ${selectedGpu === "nvidia-low" ? "active" : ""}`}
        >
          NVIDIA 엔트리급<br />(GT 1030, GTX 1050)
        </button>
        <button
          onClick={() => handleGpuSelect("nvidia-mid")}
          className={`option-button ${selectedGpu === "nvidia-mid" ? "active" : ""}`}
        >
          NVIDIA 미들급<br />(GTX 1060-1660, RTX 2060)
        </button>
        <button
          onClick={() => handleGpuSelect("nvidia-high")}
          className={`option-button ${selectedGpu === "nvidia-high" ? "active" : ""}`}
        >
          NVIDIA 하이엔드<br />(RTX 2070 이상)
        </button>
        <button
          onClick={() => handleGpuSelect("amd-low")}
          className={`option-button ${selectedGpu === "amd-low" ? "active" : ""}`}
        >
          AMD 엔트리급<br />(RX 550, RX 560)
        </button>
        <button
          onClick={() => handleGpuSelect("amd-mid")}
          className={`option-button ${selectedGpu === "amd-mid" ? "active" : ""}`}
        >
          AMD 미들급<br />(RX 570-590, RX 5500)
        </button>
        <button
          onClick={() => handleGpuSelect("amd-high")}
          className={`option-button ${selectedGpu === "amd-high" ? "active" : ""}`}
        >
          AMD 하이엔드<br />(RX 5700 이상)
        </button>
      </div>
    </div>
  );
};

export default GPUOptions; 