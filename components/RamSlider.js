import React from 'react';
import { styles } from '../styles/HelpModalStyles';

const RAM_OPTIONS = [4, 8, 16, 32, 64];

const RamSlider = ({ ram, setRam }) => (
  <div>
    <label style={styles.ramLabel}>
      RAM 용량: <strong>{ram}GB</strong>
    </label>
    <div style={styles.ramButtons}>
      {RAM_OPTIONS.map((size) => (
        <button
          key={size}
          onClick={() => setRam(size)}
          style={{
            ...styles.ramButton,
            ...(ram === size ? styles.ramButtonActive : {})
          }}
        >
          {size}GB
        </button>
      ))}
    </div>
  </div>
);

export default RamSlider; 