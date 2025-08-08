import GameCard from "./GameCard";
import { Row, Col } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";

function GameBoard({ gameLogic, artData }) {
  return (
    <div className="game-container mt-2">
      {gameLogic.gameState.cards.length == 0 && (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">
            loading progress {artData.loadingProgress}%
          </span>
        </Spinner>
      )}

      <Row>
        {gameLogic.gameState.cards.map((card, idx) => (
          <Col key={card.id} xs={3} className="mb-3">
            <GameCard
              card={card}
              idx={idx}
              handleCardClick={gameLogic.handleCardClick}
              handleImageError={artData.handleImageError}
              handleImageLoad={artData.handleImageLoad}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default GameBoard;
