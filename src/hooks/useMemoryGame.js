import { useState } from "react";

/** hook for handling the state management of the game
 * 
 * @param {Array} artPieces - list of art pieces fetched from the api
 * @returns gamestate and functions that are used for handling the changes of a state during any given game
 */
export const useMemoryGame = (artPieces) => {
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
