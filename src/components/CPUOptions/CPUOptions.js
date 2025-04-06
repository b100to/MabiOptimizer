import React, { useState, useEffect } from 'react';
import './CPUOptions.css';
import { applyCpuPreset } from '../../utils/configGenerator';

const CPUOptions = ({ setCpuCores, setCpuThreads }) => {
  const [selectedCpu, setSelectedCpu] = useState("intel-i5");

  useEffect(() => {
    applyCpuPreset("intel-i5", setCpuCores, setCpuThreads);
  }, [setCpuCores, setCpuThreads]);

  const handleCpuSelect = (cpuType) => {
    applyCpuPreset(cpuType, setCpuCores, setCpuThreads);
    setSelectedCpu(cpuType);
  };

  return (
    <div className="cpu-options">
      <h3 className="option-title">CPU 모델 빠른 선택:</h3>
      <div className="option-grid">
        <button
          onClick={() => handleCpuSelect("intel-i5")}
          className={`option-button ${selectedCpu === "intel-i5" ? "active" : ""}`}
        >
          Intel i5 (6코어/12스레드)
        </button>
        <button
          onClick={() => handleCpuSelect("intel-i7")}
          className={`option-button ${selectedCpu === "intel-i7" ? "active" : ""}`}
        >
          Intel i7 (8코어/16스레드)
        </button>
        <button
          onClick={() => handleCpuSelect("intel-i9")}
          className={`option-button ${selectedCpu === "intel-i9" ? "active" : ""}`}
        >
          Intel i9 (12코어/24스레드)
        </button>
        <button
          onClick={() => handleCpuSelect("amd-r5")}
          className={`option-button ${selectedCpu === "amd-r5" ? "active" : ""}`}
        >
          AMD Ryzen 5 (6코어/12스레드)
        </button>
        <button
          onClick={() => handleCpuSelect("amd-r7")}
          className={`option-button ${selectedCpu === "amd-r7" ? "active" : ""}`}
        >
          AMD Ryzen 7 (8코어/16스레드)
        </button>
        <button
          onClick={() => handleCpuSelect("amd-r9")}
          className={`option-button ${selectedCpu === "amd-r9" ? "active" : ""}`}
        >
          AMD Ryzen 9 (12코어/24스레드)
        </button>
      </div>
    </div>
  );
};

export default CPUOptions; 