export const styles = {
  modalOverlay: {
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
  },
  modalContent: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    width: "90%",
    maxWidth: "700px",
    maxHeight: "90vh",
    overflowY: "auto"
  },
  title: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "15px"
  },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "10px"
  },
  code: {
    backgroundColor: "#f0f0f0",
    padding: "2px 4px",
    borderRadius: "3px"
  },
  closeButton: {
    padding: "8px 15px",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    display: "block",
    margin: "0 auto"
  },
  ramSlider: {
    marginBottom: "20px"
  },
  ramLabel: {
    display: "block",
    marginBottom: "5px"
  },
  slider: {
    width: "100%"
  },
  sliderMarkers: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "12px"
  },
  ramButtons: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '20px'
  },
  ramButton: {
    padding: '8px 16px',
    backgroundColor: '#f3f4f6',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '14px',
    fontWeight: '500'
  },
  ramButtonActive: {
    backgroundColor: '#3b82f6',
    color: 'white',
    borderColor: '#3b82f6'
  }
}; 