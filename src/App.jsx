import { useState, useEffect } from "react";
import "./App.css";
import { Row, Col } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { fetchArtworkCount, fetchRandomArtworks } from "./utils/artApi";

function App() {
  const [artStyle, setArtStyle] = useState("Impressionism");
  const [artPieces, setArtPieces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [totalImages, setTotalImages] = useState(0);
  const ART_STYLE_TYPES = ["Impressionism", "Modernism", "Avant-garde", "Pop"];
  const NUM_CARDS = 8;

  const fetchArt = async () => {
    setLoading(true);
    setError(null);
    setImagesLoaded(0);
    setTotalImages(0);

    try {
      const numPages = await fetchArtworkCount(artStyle, NUM_CARDS);
      const artworks = await fetchRandomArtworks(artStyle, NUM_CARDS, numPages);
      setArtPieces(artworks);
      setTotalImages(artworks.length);
    } catch (err) {
      console.error("Failed to fetch art:", err);
      setError("Failed to load artwork. Please try again.");
      setLoading(false);
    }
  };

  const handleImageLoad = () => {
    setImagesLoaded((prev) => prev + 1);
  };

  const handleImageError = () => {
    setImagesLoaded((prev) => prev + 1);
  };

  const handleCardClick = (index) => {
    setArtPieces((prev) => 
      prev.map((piece, idx) => 
        idx === index ? { ...piece, flipped: !piece.flipped } : piece
      )
    )
  }

  useEffect(() => {
    if (totalImages > 0 && imagesLoaded === totalImages) {
      setLoading(false);
    }
  }, [imagesLoaded, totalImages]);

  useEffect(() => {
    fetchArt();
  }, []);

  useEffect(() => {
    fetchArt();
  }, [artStyle]);

  return (
    <>
      <h1>Art Memory Matching</h1>

      <div className="container">
        <Form.Select
          aria-label="art-select"
          value={artStyle}
          onChange={(e) => setArtStyle(e.target.value)}
        >
          {ART_STYLE_TYPES.map((style, idx) => (
            <option key={idx} value={style}>
              {style}
            </option>
          ))}
        </Form.Select>
      </div>

      <div className="container">
        {error && <p>Error: {error}</p>}
        <button onClick={fetchArt} disabled={loading} className="my-3">
          {loading ? "Loading..." : "Refresh Art"}
        </button>

        <div className="">
          <div className="game-container">
            <Row>
              {artPieces.map((piece, idx) => (
                <Col key={idx} xs={3} className="mb-3">
                  <div className={`art-card ${piece['flipped'] ? 'flipped' : ''}`} onClick={() => handleCardClick(idx)}>
                    <div className="art-card-inner">
                      <div className="art-card-front"></div>
                      <div className="art-card-back">
                        <img
                          src={piece["imageURL"]}
                          crossOrigin="anonymous"
                          alt={`Artwork ${idx + 1}`}
                          className="art-image"
                          onLoad={handleImageLoad}
                          onError={handleImageError}
                        />
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
          {loading && (
            <p>
              Loading images... ({imagesLoaded}/{totalImages})
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
