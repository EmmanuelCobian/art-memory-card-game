import Modal from "react-bootstrap/Modal";
import { Button, Badge, Table } from "react-bootstrap";
import Stack from "react-bootstrap/Stack";
import { useEffect, useState } from "react";
import { calculateScore, getScores, isTopScore } from "../utils/scoreManager";

function VictoryModal({ show, newGame, moves, timer }) {
  const [scores, setScores] = useState([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (show && moves > 0 && timer.time > 0) {
      setScore(calculateScore(moves, timer.time));
      setScores(getScores());
    }
  }, [show, moves, timer]);

  return (
    <Modal
      size="lg"
      show={show}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title className="mx-auto w-100">
          <Stack className="text-center py-3">
            <div className="victory-emoji">🏆</div>
            <h1>You Win!</h1>
          </Stack>
          <Stack direction="horizontal" className="pt-4">
            <Badge bg="success" className="me-2">
              Score: {score}
            </Badge>
            <Badge bg="primary" className="ms-auto">
              Moves: {moves}
            </Badge>
            <Badge bg="info" className="ms-2">Time: {timer?.formattedTime || "00:00"}</Badge>
          </Stack>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table striped bordered hover className="text-center">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Score</th>
              <th>Moves</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((scoreObj, idx) => {
              const rankDisplay =
                { 1: "🏅", 2: "🥈", 3: "🥉" }[idx + 1] || idx + 1;
              return (
                <tr key={idx}>
                  <td>{rankDisplay}</td>
                  <td>{scoreObj.score}</td>
                  <td>{scoreObj.moves}</td>
                  <td>{scoreObj.formattedTime}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>

        <div className="text-center pt-4">
          <Button
            variant="primary"
            size="lg"
            onClick={newGame}
            className="button-primary"
          >
            Play Again
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default VictoryModal;
