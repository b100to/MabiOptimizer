# 마비노기 PC버전 최적화 도구

<p align="center">
  <img src="./public/logo192.png" alt="마비노기 PC버전 최적화 도구 로고" width="100" height="100" />
</p>

<p align="center">
  <b>PC 사양에 최적화된 Unity Boot Config 생성기</b><br/>
  모비노기 PC버전의 성능을 향상시키는 맞춤형 설정 도구
</p>

<p align="center">
  <a href="https://mabioptimizer.com">
    <img src="https://img.shields.io/badge/Website-mabioptimizer.com-blue?style=flat-square" alt="Website" />
  </a>
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/Unity-2021.3-lightgrey?style=flat-square" alt="Unity Version" />
</p>

---

## 📋 개요

모비노기 PC버전 최적화 도구는 Unity 게임 엔진의 부트 설정을 자동으로 최적화하여 게임 성능을 향상시키는 웹 애플리케이션입니다. 사용자의 CPU, GPU, RAM 사양에 맞춰 최적의 설정 파일을 생성하여 프레임 저하와 끊김 현상을 개선합니다.

> 게임 개발사와 무관한 비공식 최적화 도구이며, 사용자 책임 하에 이용해주세요.

## ✨ 주요 기능

- **CPU 최적화**: 인텔/AMD 프로세서 모델별 맞춤형 설정
  - 스레드 활용 최적화
  - 작업 스케줄링 개선
  
- **GPU 성능 최적화**: 그래픽 카드 성능별 설정
  - 셰이더 컴파일 최적화
  - 렌더링 파이프라인 조정
  - HDR 설정 관리
  
- **메모리 최적화**: RAM 용량에 따른 메모리 관리
  - 메모리 블록 사이즈 조정
  - 가비지 컬렉션 최적화
  
- **직관적인 UI**: 사용자 친화적 인터페이스로 간편한 설정
  - 쉬운 CPU/GPU 선택 인터페이스
  - 단계별 적용 가이드
  - 설정 파일 자동 생성 및 다운로드

## 💻 스크린샷

<p align="center">
  <i>스크린샷은 실제 버전이 배포된 후 추가될 예정입니다.</i>
</p>

<!--
<p align="center">
  <img src="./screenshots/main.png" alt="메인 화면" width="600" />
</p>
<p align="center">메인 화면</p>

<p align="center">
  <img src="./screenshots/config.png" alt="설정 화면" width="600" />
</p>
<p align="center">설정 생성 화면</p>
-->

## 🚀 사용 방법

1. [마비노기 PC버전 최적화 도구](https://mabioptimizer.com)에 접속합니다.
2. 자신의 PC 사양에 맞게 CPU와 GPU 모델을 선택합니다.
3. RAM 용량을 설정합니다.
4. "설정 파일 생성하기" 버튼을 클릭하여 `boot.config` 파일을 다운로드합니다.
5. 다운로드한 파일을 다음 경로에 넣습니다:
   ```
   C:\Nexon\MobinogiPC\MobinogiPC_Data
   ```
6. 기존 파일이 있다면 `boot.config.backup`으로 백업합니다.
7. 게임을 재시작하면 최적화된 설정이 적용됩니다.

## 🛠️ 개발자를 위한 정보

### 프로젝트 구조

```
마비노기PC최적화/
├── public/            # 정적 자산
├── src/               # 소스 코드
│   ├── components/    # React 컴포넌트
│   ├── utils/         # 유틸리티 함수
│   └── index.js       # 진입점
└── ...
```

### 설치 및 로컬 개발

```bash
# 저장소 복제
git clone https://github.com/yourusername/mabinogi-pc-optimizer.git
cd mabinogi-pc-optimizer

# 의존성 설치
npm install

# 개발 서버 실행
npm start

# 프로덕션 빌드
npm run build
```

### 배포

이 프로젝트는 Vercel에 자동 배포하도록 설정되어 있습니다:

1. GitHub 저장소를 Vercel에 연결합니다.
2. `vercel.json` 설정에 따라 자동 배포됩니다.
3. 메인 브랜치에 변경사항을 푸시하면 자동으로 배포가 트리거됩니다.

## ⚠️ 주의사항

- 이 도구는 마비노기 PC버전의 비공식 최적화 도구로, 넥슨 및 게임 개발사와 무관합니다.
- 게임 파일을 수정하는 행위는 게임 이용약관에 위배될 수 있으며 계정 제재의 원인이 될 수 있습니다.
- 사용으로 인해 발생할 수 있는 게임 크래시, 계정 제재, 데이터 손실 등 어떠한 문제에 대해서도 제작자는 책임을 지지 않습니다.
- 게임 내 룬 합성, 아이템 사라짐 등의 버그는 게임 자체 이슈이니 주의하세요.

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 저장소의 LICENSE 파일을 참조하세요.

## 🤝 기여하기

버그 리포트, 기능 제안 또는 풀 리퀘스트를 통해 이 프로젝트에 기여해주세요. 모든 기여는 환영합니다!