import { useState, useEffect, useRef } from "react";
import { fetchArtworkCount, fetchRandomArtworks } from "../utils/artApi";

/**
 * hook for handling the state of art pieces before starting a game.
 * 
 * @returns functions and variables used by other components to view and handle the state of art pieces
 */
export const useArtData = () => {
  const [artStyle, setArtStyle] = useState("Impressionism");
  const [artPieces, setArtPieces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [totalImages, setTotalImages] = useState(0);
  const abortControllerRef = useRef(null);
  const NUM_CARDS = 8;

  const fetchArt = async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    const currentController = abortControllerRef.current;
    
    setLoading(true);
    setError(null);
    setImagesLoaded(0);
    setTotalImages(0);

    try {
      const numPages = await fetchArtworkCount(artStyle, NUM_CARDS);
      if (currentController.signal.aborted) return;

      const artworks = await fetchRandomArtworks(artStyle, NUM_CARDS, numPages);
      if (!currentController.signal.aborted) {
        setArtPieces(artworks);
        setTotalImages(artworks.length * 2);
      }
    } catch (err) {
      if (!currentController.signal.aborted) {
        console.error("Failed to fetch art:", err);
        setError("Failed to load artwork. Please try again.");
        setLoading(false);
      }
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
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    fetchArt();
  }, [artStyle]);

  return {
    artStyle,
    artPieces,
    error,
    setArtStyle,
    fetchArt,
    handleImageLoad,
    handleImageError,
    isFullyLoaded: totalImages > 0 && imagesLoaded == totalImages && !loading,
    loadingProgress: totalImages > 0 ? (imagesLoaded / totalImages) * 100 : 0,
  };
};
