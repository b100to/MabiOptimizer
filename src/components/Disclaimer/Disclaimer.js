import React from 'react';
import './Disclaimer.css';

const Disclaimer = ({ disclaimerAgreed, setDisclaimerAgreed }) => {
  return (
    <div className="disclaimer">
      <h3 className="disclaimer-title">⚠️ 주의사항</h3>
      <p className="disclaimer-text">
        이 도구는 모비노기 PC버전의 비공식 최적화 도구로, 게임사 및 개발사와 전혀 무관합니다.
        게임 파일을 수정하는 행위는 게임 이용약관에 위배될 수 있으며 계정 제재의 원인이 될 수 있습니다.
      </p>
      <p className="disclaimer-text">
        본 도구 사용으로 인해 발생할 수 있는 게임 크래시, 계정 제재, 데이터 손실 등 어떠한 문제에 대해서도
        제작자는 책임을 지지 않습니다. 사용 전 반드시 게임 데이터를 백업하시기 바랍니다.
      </p>
      <div className="disclaimer-checkbox">
        <input
          type="checkbox"
          id="disclaimer-checkbox"
          checked={disclaimerAgreed}
          onChange={() => setDisclaimerAgreed(!disclaimerAgreed)}
        />
        <label htmlFor="disclaimer-checkbox">
          위 내용을 이해했으며, 모든 책임은 본인에게 있음에 동의합니다.
        </label>
      </div>
    </div>
  );
};

export default Disclaimer; 