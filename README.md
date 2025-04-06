# Unity Boot Config Generator

마비노기 모바일 최적화를 위한 Unity Boot Config 생성기입니다.

## 개요

이 도구는 사용자의 PC 사양에 맞는 최적의 Unity Boot Config 파일을 생성해 줍니다. 이를 통해 마비노기 모바일의 성능을 향상시킬 수 있습니다.

## 기능

- CPU 모델별 최적화 설정
- GPU 성능별 최적화 설정
- RAM 용량에 따른 메모리 최적화
- Unity 버전별 설정 지원
- Windows 및 Android 플랫폼 지원

## 프로젝트 구조

이 프로젝트는 Create React App 기반으로 리팩토링되었습니다:
- `src/`: 소스 코드 디렉토리
  - `components/`: 모든 React 컴포넌트
  - `utils/`: 유틸리티 함수 (config generator 등)
- `public/`: 정적 파일 디렉토리

## 주의사항

이 도구는 마비노기 모바일의 비공식 최적화 도구로, 넥슨 및 게임 개발사와 무관합니다. 
게임 파일을 수정하는 행위는 게임 이용약관에 위배될 수 있으며 계정 제재의 원인이 될 수 있습니다.

사용으로 인해 발생할 수 있는 게임 크래시, 계정 제재, 데이터 손실 등 어떠한 문제에 대해서도 제작자는 책임을 지지 않습니다.

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm start

# 빌드
npm run build
```

## 배포

이 프로젝트는 Vercel에 배포하도록 설정되어 있습니다:

1. Vercel에 GitHub 저장소를 연결합니다.
2. 프로젝트 설정은 `vercel.json`에 정의되어 있습니다.
3. 메인 브랜치에 푸시하면 자동으로 배포가 시작됩니다.

## 라이선스

MIT