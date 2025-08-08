import "./App.css";
import GameHeader from "./components/GameHeader";
import GameBoard from "./components/GameBoard";
import { useMemoryGame } from "./hooks/useMemoryGame";
import { useArtData } from "./hooks/useArtData";
import { EnvelopeFill, Github, Linkedin } from "react-bootstrap-icons";

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
        <button
          onClick={() => artData.fetchArt()}
          disabled={!artData.isFullyLoaded}
          className="my-3"
        >
          {artData.isFullyLoaded ? "New Game" : "Loading..."}
        </button>

        <div className="">
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

          <GameBoard artData={artData} gameLogic={gameLogic} />
        </div>
      </div>

      <footer id="footer" className="footer">
        <p>Made by Emmanuel Cobian</p>
        <a
          className="socials"
          href="https://github.com/EmmanuelCobian"
          target="_blank"
        >
          <Github className="fs-2 me-2" color="#A2AF9B" />
        </a>
        <a
          className="socials"
          href="https://www.linkedin.com/in/emmanuel-cobian/"
          target="_blank"
        >
          <Linkedin className="fs-2 me-2" color="#A2AF9B" />
        </a>
        <a className="socials" href="mailto:emmanuel12310@berkeley.edu">
          <EnvelopeFill className="fs-2" color="#A2AF9B" />
        </a>
      </footer>
    </>
  );
}

export default App;
