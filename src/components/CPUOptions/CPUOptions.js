import React from 'react';
import './CPUOptions.css';
import { applyCpuPreset } from '../../utils/configGenerator';

const CPUOptions = ({ setCpuCores, setCpuThreads }) => {
  return (
    <div className="cpu-options">
      <h3 className="option-title">CPU 모델 빠른 선택:</h3>
      <div className="option-grid">
        <button
          onClick={() => applyCpuPreset("intel-i5", setCpuCores, setCpuThreads)}
          className="option-button"
        >
          Intel i5 (6코어/12스레드)
        </button>
        <button
          onClick={() => applyCpuPreset("intel-i7", setCpuCores, setCpuThreads)}
          className="option-button"
        >
          Intel i7 (8코어/16스레드)
        </button>
        <button
          onClick={() => applyCpuPreset("intel-i9", setCpuCores, setCpuThreads)}
          className="option-button"
        >
          Intel i9 (12코어/24스레드)
        </button>
        <button
          onClick={() => applyCpuPreset("amd-r5", setCpuCores, setCpuThreads)}
          className="option-button"
        >
          AMD Ryzen 5 (6코어/12스레드)
        </button>
        <button
          onClick={() => applyCpuPreset("amd-r7", setCpuCores, setCpuThreads)}
          className="option-button"
        >
          AMD Ryzen 7 (8코어/16스레드)
        </button>
        <button
          onClick={() => applyCpuPreset("amd-r9", setCpuCores, setCpuThreads)}
          className="option-button"
        >
          AMD Ryzen 9 (12코어/24스레드)
        </button>
      </div>
    </div>
  );
};

export default CPUOptions; 