import Modal from "react-bootstrap/Modal";
import { Button, Container, Row, Col } from "react-bootstrap";

function ThemeSelector({ show, onHide, artStyles, artStyle, onClick }) {
  const handleThemeClick = (e) => {
    onClick(e.target.value);
    onHide();
  };

  return (
    <Modal
      size="lg"
      show={show}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton onClick={onHide}>
        <Modal.Title id="contained-modal-title-vcenter">
          Select A Theme
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
            {artStyles.map((style, idx) => (
              <Col key={idx} xs={6} className="mb-3">
                <Button
                  onClick={(e) => handleThemeClick(e)}
                  value={style}
                  className={`w-100 h-100 py-3 button ${
                    artStyle === style ? "button-primary" : "button-secondary"
                  }`}
                >
                  {style}
                </Button>
              </Col>
            ))}
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );
}

export default ThemeSelector;
