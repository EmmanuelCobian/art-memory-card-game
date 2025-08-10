import Modal from "react-bootstrap/Modal";
import { Container, Row, Col, Button, Badge, Table } from "react-bootstrap";
import Stack from "react-bootstrap/Stack";

function VictoryModal({ show, newGame, moves, timer }) {
  return (
    <Modal
      size="lg"
      show={show}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title className="mx-auto w-100">
          <Stack className="text-center">
            <h1>🏆</h1>
            <h1>You Win!</h1>
          </Stack>
          <Stack direction="horizontal" className="pt-3">
            <Badge bg="primary">Moves: {moves}</Badge>
            <Badge bg="info" className="ms-2">
              Time: {timer?.formattedTime || "00:00"}
            </Badge>
            
          </Stack>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
            <Col className="text-center">
              <Button variant="primary" size="lg" onClick={newGame}>
                Play Again
              </Button>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );
}

export default VictoryModal;
