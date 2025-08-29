import ThemeSelector from "./ThemeSelector";
import Stack from "react-bootstrap/Stack";
import { useState } from "react";
import { Palette, Stopwatch, ArrowRepeat, HourglassSplit, Cursor } from "react-bootstrap-icons";

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
      <div className="game-header">
        <Stack direction="horizontal" gap={3} className="align-items-center">
          <button
            className="button button-primary"
            onClick={() => setModalShow(true)}
          >
            <Palette /> Themes
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
            className="button button-secondary"
          >
            {isFullyLoaded ? <><ArrowRepeat /> Restart</> : <><HourglassSplit /> Loading...</>}
          </button>

          <div className="ms-auto">
            <p><Cursor /> Moves: {moves}</p>
          </div>

          <div>
            <p><Stopwatch /> Timer: {timer?.formattedTime || "00:00"}</p>
          </div>
        </Stack>
      </div>
    </>
  );
}

export default GameHeader;
