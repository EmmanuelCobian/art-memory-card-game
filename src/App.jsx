import "./App.css";
import { Row, Col } from "react-bootstrap";
import GameHeader from "./components/GameHeader";
import { useMemoryGame } from "./hooks/useMemoryGame";
import { useArtData } from "./hooks/useArtData";

function App() {
  const artData = useArtData();
  const gameLogic = useMemoryGame(artData.artPieces, artData.isFullyLoaded);

  return (
    <>
      <GameHeader
        onStyleChange={artData.setArtStyle}
        artStyle={artData.artStyle}
      />

      <div className="container">
        {artData.error && <p>Error: {artData.error}</p>}
        <button
          onClick={() => artData.fetchArt()}
          disabled={!artData.isFullyLoaded}
          className="my-3"
        >
          {artData.isFullyLoaded ? "New Game" : "Loading..."}
        </button>

        <div className="">
          {!artData.isFullyLoaded && (
            <p>Loading progress {artData.loadingProgress}%</p>
          )}

          {gameLogic.gameState.isGameStarted && (
            <div className="game-info">
              <p>Moves: {gameLogic.gameState.moves}</p>
              {gameLogic.gameState.isGameWon && (
                <p className="text-success">
                  🎉 Congratulations! You won in {gameLogic.gameState.moves}{" "}
                  moves!
                </p>
              )}
            </div>
          )}

          <div className="game-container mt-2">
            <Row>
              {gameLogic.gameState.cards.map((card, idx) => (
                <Col key={card.id} xs={3} className="mb-3">
                  <div
                    className={`art-card ${
                      card.isFlipped || card.isMatched ? "flipped" : ""
                    }`}
                    onClick={() => gameLogic.handleCardClick(idx)}
                  >
                    <div className="art-card-inner">
                      <div className="art-card-front"></div>
                      <div className="art-card-back">
                        <img
                          src={card.imageURL}
                          crossOrigin="anonymous"
                          alt={`Artwork ${idx + 1}`}
                          className="art-image"
                          onLoad={artData.handleImageLoad}
                          onError={artData.handleImageError}
                        />
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
