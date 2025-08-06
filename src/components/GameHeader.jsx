import Form from "react-bootstrap/Form";

function GameHeader({ onStyleChange, artStyle }) {
  const ART_STYLE_TYPES = ["Impressionism", "Modernism", "Avant-garde", "Pop"];

  return (
    <>
      <h1>Art Memory Game</h1>

      <div className="container">
        <Form.Select
          className="w-50 mx-auto"
          aria-label="art-select"
          value={artStyle}
          onChange={(e) => onStyleChange(e.target.value)}
        >
          {ART_STYLE_TYPES.map((style, idx) => (
            <option key={idx} value={style}>
              {style}
            </option>
          ))}
        </Form.Select>
      </div>
    </>
  );
}

export default GameHeader;
