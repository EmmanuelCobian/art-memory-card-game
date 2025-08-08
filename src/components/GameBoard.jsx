import GameCard from "./GameCard";
import GameHeader from "./GameHeader";
import VictoryModal from "./VictoryModal";
import { Row, Col } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";

function GameBoard({ gameLogic, artData }) {
  const handleNewGame = () => {
    gameLogic.restart();
    artData.fetchArt();
  };

  return (
    <>
      <GameHeader
        onStyleChange={artData.setArtStyle}
        artStyle={artData.artStyle}
        handleGameRestart={gameLogic.restart}
        isFullyLoaded={artData.isFullyLoaded}
        moves={gameLogic.gameState.moves}
        timer={gameLogic.timer}
      />

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

      <VictoryModal
        show={gameLogic.gameState.isGameWon}
        moves={gameLogic.gameState.moves}
        timer={gameLogic.timer}
        newGame={handleNewGame}
      />
    </>
  );
}

export default GameBoard;
