# 아이콘 구현 가이드

이 폴더에는 다음과 같은 파일이 준비되어 있습니다:

1. `favicon.svg` - 벡터 기반 파비콘 (SVG 형식)
2. `og-image.svg` - 소셜 미디어 공유용 OG 이미지 (SVG 형식)
3. `favicon.ico.txt` - ICO 파일 변환용 템플릿 (생성 필요)
4. `logo192.txt` - 192x192 PNG 이미지 변환용 템플릿 (생성 필요)
5. `logo512.txt` - 512x512 PNG 이미지 변환용 템플릿 (생성 필요)

## 다음 단계

1. SVG 파일들은 이미 벡터 형식으로 준비되어 최신 브라우저에서 사용 가능합니다.
   - `favicon.svg` - 파비콘으로 사용
   - `og-image.svg` - 소셜 미디어 공유용 이미지

2. 다음 파일들은 이미지 에디터로 작업이 필요합니다:
   - `favicon.ico` (16x16, 32x32, 48x48, 64x64 사이즈 포함)
   - `logo192.png` (192x192 사이즈)
   - `logo512.png` (512x512 사이즈)
   - `og-image.jpg` 또는 `og-image.png` (1200x630 권장 크기, 소셜 미디어 최적화용)

3. 온라인 변환 도구를 사용하실 수 있습니다:
   - SVG를 PNG로 변환: https://svgtopng.com/
   - PNG를 ICO로 변환: https://convertico.com/
   - SVG를 JPG로 변환: https://svgtopng.com/ (PNG로 변환 후 JPG로 저장)

4. 파일 생성 후 다음 파일들을 대체하세요:
   - public/favicon.ico
   - public/logo192.png
   - public/logo512.png
   - public/og-image.jpg 또는 public/og-image.png

## 참고사항

- SVG 파일만으로도 대부분의 모던 브라우저에서 파비콘이 정상적으로 표시됩니다.
- iOS/Android 기기에서는 apple-touch-icon (logo192.png)이 홈 화면 아이콘으로 사용됩니다.
- Progressive Web App 지원을 위해 logo512.png 파일이 필요합니다.
- 일부 소셜 미디어 플랫폼은 SVG를 지원하지 않을 수 있으므로, og-image는 JPG나 PNG로 변환하는 것이 좋습니다. 