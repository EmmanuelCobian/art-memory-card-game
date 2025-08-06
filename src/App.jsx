import "./App.css";
import { Row, Col } from "react-bootstrap";
import GameHeader from "./components/GameHeader";
import { useMemoryGame } from "./hooks/useMemoryGame";
import { useArtData } from "./hooks/useArtData";

function App() {
  const artData = useArtData()
  const gameLogic = useMemoryGame(artData.artPieces)

  return (
    <>
      <GameHeader onStyleChange={artData.setArtStyle} artStyle={artData.artStyle}/>

      <div className="container">
        {artData.error && <p>Error: {artData.error}</p>}
        <button onClick={artData.fetchArt} disabled={!artData.isFullyLoaded} className="my-3">
          {artData.isFullyLoaded ? "New Game" : "Loading..."}
        </button>

        <div className="">
          {!artData.isFullyLoaded && (
            <p>
              Loading progress {artData.loadingProgress}%
            </p>
          )}
          <div className="game-container mt-2">
            <Row>
              {artData.artPieces.map((piece, idx) => (
                <Col key={idx} xs={3} className="mb-3">
                  <div
                    className={`art-card ${piece["flipped"] ? "flipped" : ""}`}
                    onClick={() => artData.handleCardClick(idx)}
                  >
                    <div className="art-card-inner">
                      <div className="art-card-front"></div>
                      <div className="art-card-back">
                        <img
                          src={piece["imageURL"]}
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
