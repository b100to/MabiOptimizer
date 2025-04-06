import React from 'react';
import './RamSlider.css';

const RAM_OPTIONS = [4, 8, 16, 32, 64];

const RamSlider = ({ ram, setRam }) => {
  return (
    <div className="ram-slider">
      <label className="ram-label">
        RAM 용량: <strong>{ram}GB</strong>
      </label>
      <div className="ram-buttons">
        {RAM_OPTIONS.map((size) => (
          <button
            key={size}
            onClick={() => setRam(size)}
            className={`ram-button ${ram === size ? 'ram-button-active' : ''}`}
          >
            {size}GB
          </button>
        ))}
      </div>
    </div>
  );
};

export default RamSlider; 