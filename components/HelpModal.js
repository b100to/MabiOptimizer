// 도움말 모달 컴포넌트
const HelpModal = ({ onClose }) => (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          width: "90%",
          maxWidth: "700px",
          maxHeight: "90vh",
          overflowY: "auto"
        }}
      >
        <h2
          style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "15px" }}
        >
          PC 사양 확인 방법
        </h2>
  
        <div style={{ marginBottom: "20px" }}>
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "600",
              marginBottom: "10px"
            }}
          >
            Windows 10/11에서 사양 확인하기
          </h3>
          <ol style={{ paddingLeft: "20px" }}>
            <li style={{ marginBottom: "8px" }}>
              <strong>CPU 및 RAM 확인:</strong>
              <ol style={{ paddingLeft: "20px", marginTop: "5px" }}>
                <li>
                  키보드에서{" "}
                  <code
                    style={{
                      backgroundColor: "#f0f0f0",
                      padding: "2px 4px",
                      borderRadius: "3px"
                    }}
                  >
                    Windows 키 + R
                  </code>{" "}
                  누르기
                </li>
                <li>
                  <code
                    style={{
                      backgroundColor: "#f0f0f0",
                      padding: "2px 4px",
                      borderRadius: "3px"
                    }}
                  >
                    dxdiag
                  </code>{" "}
                  입력하고 Enter 누르기
                </li>
                <li>
                  첫 번째 탭(시스템)에서 프로세서(CPU) 정보와 메모리(RAM) 용량
                  확인 가능
                </li>
              </ol>
            </li>
            <li style={{ marginBottom: "8px" }}>
              <strong>그래픽 카드(GPU) 확인:</strong>
              <ol style={{ paddingLeft: "20px", marginTop: "5px" }}>
                <li>동일한 dxdiag 창에서 "디스플레이" 탭 클릭</li>
                <li>"이름" 항목에서 그래픽 카드 모델 확인 가능</li>
              </ol>
            </li>
          </ol>
        </div>
  
        <button
          onClick={onClose}
          style={{
            padding: "8px 15px",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            display: "block",
            margin: "0 auto"
          }}
        >
          닫기
        </button>
      </div>
    </div>
  );
  
  // 다른 파일에서 사용할 수 있도록 글로벌 변수로 노출
  window.HelpModal = HelpModal;