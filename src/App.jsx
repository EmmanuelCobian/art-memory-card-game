import "./App.css";
import GameBoard from "./components/GameBoard";
import { useMemoryGame } from "./hooks/useMemoryGame";
import { useArtData } from "./hooks/useArtData";
import { EnvelopeFill, Github, Linkedin } from "react-bootstrap-icons";

function App() {
  const artData = useArtData();
  const gameLogic = useMemoryGame(artData.artPieces, artData.isFullyLoaded);

  return (
    <>
      <div className="container pt-4" id="title">
        <h1>Art Memory Game</h1>
      </div>

      <div id="game-board" className="container py-4">
        <GameBoard artData={artData} gameLogic={gameLogic} />
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
        <a className="socials" href={`mailto:${import.meta.env.CONTACT_EMAIL}`}>
          <EnvelopeFill className="fs-2" color="#A2AF9B" />
        </a>
      </footer>
    </>
  );
}

export default App;
