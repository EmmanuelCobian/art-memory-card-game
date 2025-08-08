import { useState, useEffect } from "react";
import {
  createGameCards,
  flipCard,
  checkMatch,
  isGameWon,
} from "../utils/gameLogic";
import { useTimer } from "./useTimer";

/** hook for handling the state management of the game
 *
 * @param {Array} artPieces - list of art pieces fetched from the api
 * @param {Boolean} isFullyLoaded - indicator whether all the images are loaded in or not
 * @returns gamestate and functions that are used for handling the changes of a state during any given game
 */
export const useMemoryGame = (artPieces, isFullyLoaded) => {
  const [gameState, setGameState] = useState({
    cards: [],
    flippedCards: [],
    moves: 0,
    isGameWon: false,
  });
  const timer = useTimer(gameState.isGameWon, gameState.moves);

  useEffect(() => {
    if (artPieces) {
      const gameCards = createGameCards(artPieces);
      if (gameCards) {
        setGameState({
          cards: gameCards,
          flippedCards: [],
          moves: 0,
          isGameWon: false,
        });
      }
    }
  }, [artPieces]);

  const handleCardClick = (cardIndex) => {
    if (!isFullyLoaded) {
      return;
    }

    if (gameState.isGameWon || gameState.cards[cardIndex]?.isMatched) {
      return;
    }

    if (gameState.moves == 0) {
      timer.startTimer();
    }

    if (gameState.flippedCards.length == 2) {
      const [firstCardIdx, secondCardIdx] = gameState.flippedCards;
      const firstCard = gameState.cards[firstCardIdx];
      const secondCard = gameState.cards[secondCardIdx];

      if (!firstCard.isMatched && !secondCard.isMatched) {
        setGameState((prevState) => {
          const updatedCards = [...prevState.cards];
          updatedCards[firstCardIdx] = {
            ...updatedCards[firstCardIdx],
            isFlipped: false,
          };
          updatedCards[secondCardIdx] = {
            ...updatedCards[secondCardIdx],
            isFlipped: false,
          };

          return {
            ...prevState,
            cards: updatedCards,
            flippedCards: [],
          };
        });

        setTimeout(() => {
          const newGameState = flipCard(cardIndex, {
            ...gameState,
            cards: gameState.cards.map((card, idx) =>
              idx === firstCardIdx || idx === secondCardIdx
                ? { ...card, isFlipped: false }
                : card
            ),
            flippedCards: [],
          });
          setGameState((prevState) => ({
            ...prevState,
            ...newGameState,
          }));
        }, 50);
        return;
      }
    }

    if (gameState.cards[cardIndex]?.isFlipped) {
      return;
    }

    const newGameState = flipCard(cardIndex, gameState);
    setGameState(newGameState);

    if (newGameState.flippedCards.length == 2) {
      const [firstCardIdx, secondCardIdx] = newGameState.flippedCards;
      const firstCard = newGameState.cards[firstCardIdx];
      const secondCard = newGameState.cards[secondCardIdx];
      const updatedMoves = newGameState.moves + 1;

      if (checkMatch(firstCard, secondCard)) {
        setGameState((prevState) => {
          const updatedCards = [...prevState.cards];
          updatedCards[firstCardIdx] = {
            ...updatedCards[firstCardIdx],
            isMatched: true,
          };
          updatedCards[secondCardIdx] = {
            ...updatedCards[secondCardIdx],
            isMatched: true,
          };

          const newState = {
            ...prevState,
            cards: updatedCards,
            flippedCards: [],
            isGameWon: isGameWon(updatedCards),
            moves: updatedMoves,
          };

          return newState;
        });
      } else {
        setGameState((prevState) => ({
          ...prevState,
          moves: updatedMoves,
        }));
      }
    }
  };

  const restart = () => {
    if (artPieces) {
      const gameCards = createGameCards(artPieces);
      setGameState({
        cards: gameCards,
        flippedCards: [],
        moves: 0,
        isGameWon: false,
      });
      timer.resetTimer();
    }
  };

  return {
    gameState,
    handleCardClick,
    restart,
    timer,
  };
};
