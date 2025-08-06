import { useState } from "react";

const useMemoryGame = (artPieces) => {
  const [gameState, setGameState] = useState({
    cards: [],
    flippedCards: [],
    matchedPairs: [],
    moves: 0,
    gameStatus: "playing",
    canFlip: true,
  });

  const flipCard = (cardIdx) => {};

  const checkForMatch = () => {};

  const resetGame = () => {};

  const gameStats = () => {
    return moves;
  };

  return { gameState, flipCard, resetGame, checkForMatch, gameStats}
};

export default useMemoryGame;
