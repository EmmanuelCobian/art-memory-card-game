import ThemeSelector from "./ThemeSelector";
import Stack from "react-bootstrap/Stack";
import { useState } from "react";

function GameHeader({
  onStyleChange,
  handleGameRestart,
  artStyle,
  isFullyLoaded,
  moves,
  timer,
}) {
  const [modalShow, setModalShow] = useState(false);
  const ART_STYLE_TYPES = ["Impressionism", "Modernism", "Avant-garde", "Pop"];

  return (
    <>
      <Stack direction="horizontal" gap={3}>
        <button className="button" onClick={() => setModalShow(true)}>
          Themes
        </button>

        <ThemeSelector
          show={modalShow}
          onHide={() => setModalShow(false)}
          artStyles={ART_STYLE_TYPES}
          artStyle={artStyle}
          onClick={onStyleChange}
        />

        <button
          onClick={handleGameRestart}
          disabled={!isFullyLoaded}
          className="my-3 button"
        >
          {isFullyLoaded ? "Restart" : "Loading..."}
        </button>

        <div className="ms-auto mt-3">
          <p>Moves: {moves}</p>
        </div>

        <div className="mt-3">
          <p>Timer: {timer.formattedTime}</p>
        </div>
      </Stack>
    </>
  );
}

export default GameHeader;
