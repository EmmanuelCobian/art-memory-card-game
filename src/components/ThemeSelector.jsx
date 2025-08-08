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
              <Col key={idx} xs={6}>
                <Button 
                  onClick={(e) => handleThemeClick(e)} 
                  value={style}
                  variant={artStyle === style ? "dark" : "outline-dark"}
                  className={`mb-2 w-100 ${artStyle === style ? "active" : ""}`}
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
