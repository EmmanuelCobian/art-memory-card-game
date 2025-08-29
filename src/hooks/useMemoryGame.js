import { useState, useEffect } from "react";
import {
  createGameCards,
  flipCard,
  checkMatch,
  isGameWon,
} from "../utils/gameLogic";
import { useTimer } from "./useTimer";
import { saveScore } from "../utils/scoreManager";

/** hook for handling the state management of the game
 *
 * @param {Array} artPieces - list of art pieces fetched from the api
 * @param {Boolean} isFullyLoaded - whether all the images are loaded in or not
 * @returns game state and control functions
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

  useEffect(() => {
    if (gameState.isGameWon && gameState.moves > 0 && timer.time > 0) {
      saveScore(gameState.moves, timer);
    }
  }, [gameState.isGameWon, gameState.moves, timer.time]);

  const canFlipCard = (cardIndex) => {
    const card = gameState.cards[cardIndex];
    const gameOver = gameState.isGameWon;
    const alreadyMatched = card?.isMatched;
    const alreadyFlipped = card?.isFlipped;
    const maxFlipsReached =
      gameState.flippedCards.length === 2 &&
      gameState.flippedCards.includes(cardIndex);
    return (
      isFullyLoaded &&
      !gameOver &&
      !alreadyMatched &&
      !alreadyFlipped &&
      !maxFlipsReached
    );
  };

  const createResetState = (gameState, firstCardIdx, secondCardIdx) => {
    return {
      ...gameState,
      cards: gameState.cards.map((card, idx) =>
        idx === firstCardIdx || idx === secondCardIdx
          ? { ...card, isFlipped: false }
          : card
      ),
      flippedCards: [],
    };
  };

  const handleTwoCardsAlreadyFlipped = (cardIndex) => {
    const [firstCardIdx, secondCardIdx] = gameState.flippedCards;
    const firstCard = gameState.cards[firstCardIdx];
    const secondCard = gameState.cards[secondCardIdx];

    if (!firstCard.isMatched && !secondCard.isMatched) {
      const resetState = createResetState(
        gameState,
        firstCardIdx,
        secondCardIdx
      );
      const newGameState = flipCard(cardIndex, resetState);
      setGameState(newGameState);
      return true;
    }
    return false;
  };

  const markCardsAsMatched = (firstCardIdx, secondCardIdx, moves) => {
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
        moves: moves,
      };
      return newState;
    });
  };

  const updateMovesOnly = (moves) => {
    setGameState((prevState) => ({
      ...prevState,
      moves: moves,
    }));
  };

  const handleTwoCardsFlipped = (newGameState) => {
    const [firstCardIdx, secondCardIdx] = newGameState.flippedCards;
    const firstCard = newGameState.cards[firstCardIdx];
    const secondCard = newGameState.cards[secondCardIdx];
    const updatedMoves = newGameState.moves + 1;

    if (checkMatch(firstCard, secondCard)) {
      markCardsAsMatched(firstCardIdx, secondCardIdx, updatedMoves);
    } else {
      updateMovesOnly(updatedMoves);
    }
  };

  const handleCardClick = (cardIndex) => {
    if (!canFlipCard(cardIndex)) return;

    if (gameState.moves == 0) timer.startTimer();

    if (gameState.flippedCards.length == 2) {
      if (handleTwoCardsAlreadyFlipped(cardIndex)) return;
    }

    const newGameState = flipCard(cardIndex, gameState);
    setGameState(newGameState);
    if (newGameState.flippedCards.length == 2) {
      handleTwoCardsFlipped(newGameState);
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
