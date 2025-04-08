import React, { useState, useEffect } from 'react';
import './CPUOptions.css';
import { applyCpuPreset } from '../../utils/configGenerator';

const CPUOptions = ({ setCpuCores, setCpuThreads }) => {
  const [selectedCpu, setSelectedCpu] = useState("mid-range");
  const [openGroup, setOpenGroup] = useState(null);

  useEffect(() => {
    applyCpuPreset("mid-range", setCpuCores, setCpuThreads);
  }, [setCpuCores, setCpuThreads]);

  const handleCpuSelect = (cpuType) => {
    applyCpuPreset(cpuType, setCpuCores, setCpuThreads);
    setSelectedCpu(cpuType);
    setOpenGroup(null);
  };

  const cpuGroups = {
    entry: {
      title: "일반 사양 CPU",
      models: [
        {
          type: "entry-level",
          name: "Intel i3 / AMD Ryzen 3",
          spec: "4코어/8스레드"
        }
      ]
    },
    mid: {
      title: "중간 사양 CPU",
      models: [
        {
          type: "mid-range-4c4t",
          name: "Intel i5 / AMD Ryzen 5",
          spec: "4코어/4스레드"
        },
        {
          type: "mid-range-6c6t",
          name: "Intel i5 / AMD Ryzen 5",
          spec: "6코어/6스레드"
        },
        {
          type: "mid-range",
          name: "Intel i5 / AMD Ryzen 5",
          spec: "6코어/12스레드"
        }
      ]
    },
    high: {
      title: "고성능 CPU",
      models: [
        {
          type: "high-end-8c8t",
          name: "Intel i7 / AMD Ryzen 7",
          spec: "8코어/8스레드"
        },
        {
          type: "high-end",
          name: "Intel i7 / AMD Ryzen 7",
          spec: "8코어/16스레드"
        }
      ]
    },
    premium: {
      title: "프리미엄 CPU",
      models: [
        {
          type: "premium-12c12t",
          name: "Intel i9 / AMD Ryzen 9",
          spec: "12코어/12스레드"
        },
        {
          type: "premium",
          name: "Intel i9 / AMD Ryzen 9",
          spec: "12코어/24스레드"
        }
      ]
    },
    hybrid: {
      title: "하이브리드 CPU",
      models: [
        {
          type: "hybrid-14c20t",
          name: "Intel 12세대 이상",
          spec: "14코어/20스레드"
        }
      ]
    }
  };

  return (
    <div className="cpu-options">
      <h3 className="option-title">CPU 모델 빠른 선택:</h3>
      <div className="cpu-groups">
        {Object.entries(cpuGroups).map(([groupKey, group]) => (
          <div key={groupKey} className="cpu-group">
            <button
              className={`group-button ${openGroup === groupKey ? 'active' : ''}`}
              onClick={() => setOpenGroup(openGroup === groupKey ? null : groupKey)}
            >
              {group.title}
              <span className="arrow">{openGroup === groupKey ? '▼' : '▶'}</span>
            </button>
            {openGroup === groupKey && (
              <div className="cpu-models">
                {group.models.map((model) => (
                  <button
                    key={model.type}
                    onClick={() => handleCpuSelect(model.type)}
                    className={`model-button ${selectedCpu === model.type ? 'selected' : ''}`}
                  >
                    <span className="model-name">{model.name}</span>
                    <span className="model-spec">({model.spec})</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CPUOptions; 