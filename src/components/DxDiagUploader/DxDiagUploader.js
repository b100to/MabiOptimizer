import React, { useState, useRef } from 'react';
import { parseDxDiagText } from '../../utils/dxDiagParser';
import './DxDiagUploader.css';

/**
 * DxDiag 파일 업로드 및 자동 분석 컴포넌트
 */
const DxDiagUploader = ({ onSystemInfoDetected }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const fileInputRef = useRef(null);

    // 드래그 이벤트 핸들러
    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    // 파일 처리 함수
    const processFile = async (file) => {
        // 텍스트 파일 확인
        if (file.type !== 'text/plain' && !file.name.endsWith('.txt')) {
            setError('텍스트 파일(.txt)만 업로드 가능합니다.');
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError('');

            // 파일 내용 읽기
            const fileContent = await readFileAsText(file);

            // DxDiag 내용 확인
            if (!fileContent.includes('DxDiag')) {
                setError('유효한 DxDiag 결과 파일이 아닙니다.');
                setIsLoading(false);
                return;
            }

            // 시스템 정보 파싱
            const systemInfo = parseDxDiagText(fileContent);

            // 결과 전달
            onSystemInfoDetected(systemInfo);

            // 성공 표시
            setUploadSuccess(true);
            setIsLoading(false);

            // 3초 후 성공 표시 제거
            setTimeout(() => {
                setUploadSuccess(false);
            }, 3000);

        } catch (err) {
            setError('파일 처리 중 오류가 발생했습니다.');
            setIsLoading(false);
            console.error('File processing error:', err);
        }
    };

    // 파일 업로드 핸들러
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length) {
            processFile(files[0]);
        }
    };

    // 파일 입력 핸들러
    const handleFileInput = (e) => {
        const files = e.target.files;
        if (files.length) {
            processFile(files[0]);
        }
    };

    // 파일을 텍스트로 읽는 함수
    const readFileAsText = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => resolve(event.target.result);
            reader.onerror = (error) => reject(error);
            reader.readAsText(file);
        });
    };

    // 파일 선택 버튼 클릭 핸들러
    const handleSelectFileClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="dxdiag-uploader-container">
            <h3 className="dxdiag-uploader-title">DxDiag 파일로 자동 분석하기</h3>

            <div className="dxdiag-feature-description">
                <p>
                    <strong>자동 하드웨어 감지 기능</strong>이 내 PC에 맞는 최적화 설정을 자동으로 찾아줍니다.
                </p>
                <ul>
                    <li><strong>CPU 성능 감지:</strong> 코어 및 스레드 수를 자동 감지하여 최적의 작업자 수 설정</li>
                    <li><strong>GPU 성능 감지:</strong> 그래픽 카드 종류에 따른 렌더링 최적화 설정</li>
                    <li><strong>RAM 용량 분석:</strong> 메모리에 맞는 메모리 할당 최적화</li>
                    <li><strong>복수 그래픽 카드 지원:</strong> 내장 및 외장 그래픽 카드 모두 감지 및 분석</li>
                </ul>
            </div>

            <div
                className={`dxdiag-dropzone ${isDragging ? 'dragging' : ''} ${isLoading ? 'loading' : ''} ${uploadSuccess ? 'success' : ''}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={handleSelectFileClick}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileInput}
                    accept=".txt"
                    style={{ display: 'none' }}
                />

                {isLoading ? (
                    <div className="dxdiag-loading">
                        <div className="spinner"></div>
                        <p>PC 사양 분석 중...</p>
                    </div>
                ) : uploadSuccess ? (
                    <div className="dxdiag-success">
                        <svg viewBox="0 0 24 24" width="48" height="48">
                            <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                        </svg>
                        <p>분석 완료!</p>
                    </div>
                ) : (
                    <>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 13v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6M12 3v12M8 7l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p>DxDiag 텍스트 파일을 끌어다 놓거나<br />클릭하여 선택하세요</p>
                        <small>(DxDiag 결과를 텍스트 파일로 저장하여 업로드하세요)</small>
                    </>
                )}
            </div>

            {error && <div className="dxdiag-error">{error}</div>}

            <div className="dxdiag-help">
                <h4>DxDiag 파일 생성 방법</h4>
                <ol>
                    <li>Windows 검색에서 <strong>dxdiag</strong>를 입력하고 실행하세요.</li>
                    <li>DxDiag 도구가 열리면 하단의 <strong>"모든 정보 저장"</strong> 버튼을 클릭하세요.</li>
                    <li>저장할 위치를 선택하고 파일 이름을 지정한 후 저장하세요.</li>
                    <li>저장된 텍스트 파일을 여기에 업로드하세요.</li>
                </ol>
                <div className="dxdiag-tips">
                    <h5>왜 DxDiag를 사용하나요?</h5>
                    <p>DirectX 진단 도구(DxDiag)는 정확한 그래픽 하드웨어 정보를 포함하여 PC의 시스템 정보를 가장 정확하게 제공합니다. 이를 통해 모비노기에 최적화된 설정을 더 정확하게 제안할 수 있습니다.</p>
                </div>
            </div>
        </div>
    );
};

export default DxDiagUploader; 