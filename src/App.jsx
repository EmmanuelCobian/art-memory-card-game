import { useState, useEffect } from "react";
import "./App.css";
import { Button, Row, Col } from "react-bootstrap";

function App() {
  const [artStyle, setArtStyle] = useState("Modernism");
  const [cardNum, setCardNum] = useState(6);
  const [totalPages, setTotalPages] = useState(0);
  const [artPieces, setArtPieces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

      return `${res.config.iiif_url}/${res.data.image_id}/full/pct:100/0/default.jpg`;
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
      const cardImages = [...validImages, ...validImages].sort(() => Math.random() - 0.5);
      setArtPieces(cardImages);
    } catch (err) {
      console.error("Error in fetchRandomPieces:", err);
      setError("Failed to fetch artwork images");
    }
  };

  const fetchArt = async () => {
    setLoading(true);
    setError(null);

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArt();
  }, []);

  useEffect(() => {
    fetchArt();
  }, [artStyle, cardNum]);

  return (
    <>
      <h1>Art Memory Card Game</h1>
      <div className="container">
        {error && <p>Error: {error}</p>}
        <Button onClick={fetchArt} disabled={loading}>
          {loading ? "Loading..." : "Refresh Art"}
        </Button>
        {totalPages > 0 && (
          <p>
            Found {totalPages} pages of {artStyle} artwork
          </p>
        )}
        {artPieces.length > 0 && (
          <div>
            <p>Loaded {artPieces.length} images</p>
            <div className="game-container">
              <Row>
                {artPieces.map((piece, idx) => (
                  <Col key={idx} xs={4} sm={3} className="mb-3">
                    <div className="art-card">
                      <div className="art-card-inner">
                        <img
                          src={piece}
                          crossOrigin="anonymous"
                          alt={`Artwork ${idx + 1}`}
                          className="art-image"
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
