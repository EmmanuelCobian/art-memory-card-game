import Modal from "react-bootstrap/Modal";
import { Container, Row, Col, Button, Badge } from "react-bootstrap";
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
        <Modal.Title
          className="mx-auto w-100"
        >
          <Stack className="text-center">
            <h1>🏆</h1>
            <h1>You Win!</h1>
          </Stack>
          <Stack direction="horizontal" className="pt-3">
            <Badge>Moves: {moves}</Badge>
            <Badge className="ms-auto">
              Time: {timer?.formattedTime || "00:00"}
            </Badge>
          </Stack>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="mx-auto">
        <Container>
          <Button onClick={newGame}>Play Again</Button>
        </Container>
      </Modal.Body>
    </Modal>
  );
}

export default VictoryModal;
