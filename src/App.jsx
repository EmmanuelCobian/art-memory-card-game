import { useState, useEffect } from "react";
import "./App.css";
import { Row, Col } from "react-bootstrap";
import Form from "react-bootstrap/Form";

function App() {
  const [artStyle, setArtStyle] = useState("Impressionism");
  const [cardNum, setCardNum] = useState(8);
  const [totalPages, setTotalPages] = useState(0);
  const [artPieces, setArtPieces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [totalImages, setTotalImages] = useState(0);
  const artStyleTypes = [
    "Impressionism",
    "Modernism",
    "Avant-garde",
    "Surrealism",
    "Pop",
  ];

  const fetchArtworkDetails = async (artwork) => {
    try {
      const response = await fetch(artwork.api_link);
      if (!response.ok) {
        throw new Error(`Failed to fetch artwork details: ${response.status}`);
      }

      const res = await response.json();
      if (!res.data.image_id) {
        return null;
      }

      return `${res.config.iiif_url}/${res.data.image_id}/full/200,/0/default.jpg`;
    } catch (err) {
      console.error(`Error fetching artwork ${artwork.id}:`, err.message);
      return null;
    }
  };

  const fetchRandomPieces = async () => {
    const maxPage = Math.min(totalPages, 100);
    const pageIdx = Math.floor(Math.random() * maxPage) + 1;
    const url = `https://api.artic.edu/api/v1/artworks/search?query[match][style_titles]=${artStyle}&limit=${cardNum}&page=${pageIdx}`;

    try {
      const response = await fetch(url, {
        headers: {
          "AIC-User_Agent": `art-card-game (${import.meta.env.CONTACT_EMAIL})`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch artworks: ${response.status}`);
      }

      const res = await response.json();
      const imagePromises = res.data.map((artwork) =>
        fetchArtworkDetails(artwork)
      );
      const imageResults = await Promise.all(imagePromises);
      const validImages = imageResults.filter((image) => image !== null);
      const cardImages = [...validImages, ...validImages].sort(
        () => Math.random() - 0.5
      );

      setImagesLoaded(0);
      setTotalImages(cardImages.length);
      setArtPieces(cardImages);
    } catch (err) {
      console.error("Error in fetchRandomPieces:", err);
      setError("Failed to fetch artwork images");
    }
  };

  const fetchArt = async () => {
    setLoading(true);
    setError(null);
    setImagesLoaded(0);
    setTotalImages(0);

    const url = `https://api.artic.edu/api/v1/artworks/search?query[match][style_titles]=${artStyle}&limit=${cardNum}`;

    try {
      const response = await fetch(url, {
        headers: {
          "AIC-User_Agent": `art-card-game (${import.meta.env.CONTACT_EMAIL})`,
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch artworks: ${response.status}`);
      }

      const res = await response.json();
      setTotalPages(res.pagination.total_pages);
      fetchRandomPieces();
    } catch (err) {
      console.error("Error in fetchArt:", err.message);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleImageLoad = () => {
    setImagesLoaded((prev) => prev + 1);
  };

  const handleImageError = () => {
    setImagesLoaded((prev) => prev + 1);
  };

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
  }, [artStyle, cardNum]);

  return (
    <>
      <h1>Art Memory Card Game</h1>
      <Form.Select
        aria-label="art-select"
        value={artStyle}
        onChange={(e) => setArtStyle(e.target.value)}
      >
        {artStyleTypes.map((style, idx) => (
          <option key={idx} value={style}>
            {style}
          </option>
        ))}
      </Form.Select>
      <div className="container">
        {error && <p>Error: {error}</p>}
        <button onClick={fetchArt} disabled={loading}>
          {loading ? "Loading..." : "Refresh Art"}
        </button>
        {artPieces.length > 0 && (
          <div>
            {loading && (
              <p>
                Loading images... ({imagesLoaded}/{totalImages})
              </p>
            )}
            <div className="game-container">
              <Row>
                {artPieces.map((piece, idx) => (
                  <Col key={idx} xs={3} className="mb-3">
                    <div className="art-card">
                      <div className="art-card-inner">
                        <img
                          src={piece}
                          crossOrigin="anonymous"
                          alt={`Artwork ${idx + 1}`}
                          className="art-image"
                          onLoad={handleImageLoad}
                          onError={handleImageError}
                        />
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
