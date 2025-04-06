import React from 'react';
import './GPUOptions.css';
import { applyGpuPreset } from '../../utils/configGenerator';

const GPUOptions = ({ setGpuTier }) => {
  return (
    <div className="gpu-options">
      <h3 className="option-title">GPU 모델 빠른 선택:</h3>
      <div className="gpu-categories">
        <div className="gpu-category">
          <h4 className="category-title">NVIDIA</h4>
          <div className="gpu-buttons">
            <button
              onClick={() => applyGpuPreset("nvidia-low", setGpuTier)}
              className="gpu-button"
            >
              엔트리급 (GT 1030, GTX 1050)
            </button>
            <button
              onClick={() => applyGpuPreset("nvidia-mid", setGpuTier)}
              className="gpu-button"
            >
              미들급 (GTX 1060-1660, RTX 2060)
            </button>
            <button
              onClick={() => applyGpuPreset("nvidia-high", setGpuTier)}
              className="gpu-button"
            >
              하이엔드 (RTX 2070 이상)
            </button>
          </div>
        </div>
        
        <div className="gpu-category">
          <h4 className="category-title">AMD</h4>
          <div className="gpu-buttons">
            <button
              onClick={() => applyGpuPreset("amd-low", setGpuTier)}
              className="gpu-button"
            >
              엔트리급 (RX 550, RX 560)
            </button>
            <button
              onClick={() => applyGpuPreset("amd-mid", setGpuTier)}
              className="gpu-button"
            >
              미들급 (RX 570-590, RX 5500)
            </button>
            <button
              onClick={() => applyGpuPreset("amd-high", setGpuTier)}
              className="gpu-button"
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