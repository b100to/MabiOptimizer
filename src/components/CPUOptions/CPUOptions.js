import React, { useState, useEffect } from 'react';
import './CPUOptions.css';
import { applyCpuPreset } from '../../utils/configGenerator';

const CPUOptions = ({ setCpuCores, setCpuThreads }) => {
  const [selectedCpu, setSelectedCpu] = useState("mid-range");

  useEffect(() => {
    applyCpuPreset("mid-range", setCpuCores, setCpuThreads);
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
          onClick={() => handleCpuSelect("entry-level")}
          className={`option-button ${selectedCpu === "entry-level" ? "active" : ""}`}
        >
          일반 사양 CPU<br />
          <span className="cpu-model">
            <span className="intel">Intel i3</span> / <span className="amd">AMD Ryzen 3</span>
          </span><br />
          <span className="cpu-spec">(4코어/8스레드)</span>
        </button>
        <button
          onClick={() => handleCpuSelect("mid-range-4c4t")}
          className={`option-button ${selectedCpu === "mid-range-4c4t" ? "active" : ""}`}
        >
          중간 사양 CPU<br />
          <span className="cpu-model">
            <span className="intel">Intel i5</span> / <span className="amd">AMD Ryzen 5</span>
          </span><br />
          <span className="cpu-spec">(4코어/4스레드)</span>
        </button>
        <button
          onClick={() => handleCpuSelect("mid-range-6c6t")}
          className={`option-button ${selectedCpu === "mid-range-6c6t" ? "active" : ""}`}
        >
          중간 사양 CPU<br />
          <span className="cpu-model">
            <span className="intel">Intel i5</span> / <span className="amd">AMD Ryzen 5</span>
          </span><br />
          <span className="cpu-spec">(6코어/6스레드)</span>
        </button>
        <button
          onClick={() => handleCpuSelect("mid-range")}
          className={`option-button ${selectedCpu === "mid-range" ? "active" : ""}`}
        >
          중간 사양 CPU<br />
          <span className="cpu-model">
            <span className="intel">Intel i5</span> / <span className="amd">AMD Ryzen 5</span>
          </span><br />
          <span className="cpu-spec">(6코어/12스레드)</span>
        </button>
        <button
          onClick={() => handleCpuSelect("high-end-8c8t")}
          className={`option-button ${selectedCpu === "high-end-8c8t" ? "active" : ""}`}
        >
          고성능 CPU<br />
          <span className="cpu-model">
            <span className="intel">Intel i7</span> / <span className="amd">AMD Ryzen 7</span>
          </span><br />
          <span className="cpu-spec">(8코어/8스레드)</span>
        </button>
        <button
          onClick={() => handleCpuSelect("high-end")}
          className={`option-button ${selectedCpu === "high-end" ? "active" : ""}`}
        >
          고성능 CPU<br />
          <span className="cpu-model">
            <span className="intel">Intel i7</span> / <span className="amd">AMD Ryzen 7</span>
          </span><br />
          <span className="cpu-spec">(8코어/16스레드)</span>
        </button>
        <button
          onClick={() => handleCpuSelect("premium-12c12t")}
          className={`option-button ${selectedCpu === "premium-12c12t" ? "active" : ""}`}
        >
          프리미엄 CPU<br />
          <span className="cpu-model">
            <span className="intel">Intel i9</span> / <span className="amd">AMD Ryzen 9</span>
          </span><br />
          <span className="cpu-spec">(12코어/12스레드)</span>
        </button>
        <button
          onClick={() => handleCpuSelect("premium")}
          className={`option-button ${selectedCpu === "premium" ? "active" : ""}`}
        >
          프리미엄 CPU<br />
          <span className="cpu-model">
            <span className="intel">Intel i9</span> / <span className="amd">AMD Ryzen 9</span>
          </span><br />
          <span className="cpu-spec">(12코어/24스레드)</span>
        </button>
      </div>
    </div>
  );
};

export default CPUOptions; 