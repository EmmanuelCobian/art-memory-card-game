/*Utility class handling game logic like shuffling cards, flip logic, and move calculation*/

/**
 * creates the set of playing cards, duplicating the original set and shuffling them
 * 
 * @param {Array} artPieces list of strings containing art image urls
 * @returns list of objects of shuffled cards and attributes for each card
 */
export const createGameCards = (artPieces) => {
  if (!artPieces || artPieces.length === 0) {
    return null;
  }

  const pairs = artPieces.map((imageURL, index) => [
    {
      id: `${index}-a`,
      pairId: index,
      imageURL: imageURL,
      isFlipped: false,
      isMatched: false,
    },
    {
      id: `${index}-b`,
      pairId: index,
      imageURL: imageURL,
      isFlipped: false,
      isMatched: false,
    },
  ]);

  const allCards = pairs.flat();
  for (let i = allCards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allCards[i], allCards[j]] = [allCards[j], allCards[i]];
  }
  return allCards;
};

/**
 * 
 * @param {Int} cardIdx index of the card to flip
 * @param {Object} gameState the current game state
 * @returns the updated state after the card flip
 */
export const flipCard = (cardIdx, gameState) => {
  const newState = { ...gameState };
  newState.cards[cardIdx].isFlipped = true;
  newState.flippedCards.push(cardIdx);
  return newState;
};

/**
 * Checks if two cards are a match
 * 
 * @param {Object} card1 object with data for card 1
 * @param {Object} card2 object with data for card 2
 * @returns true if the 2 cards are a pair match, false otherwise
 */
export const checkMatch = (card1, card2) => {
  return card1.pairId == card2.pairId;
};

/**
 * checks if the game is over
 * 
 * @param {Array} cards list of cards
 * @returns true if every pair of cards is matched, false otherwise
 */
export const isGameWon = (cards) => {
  return cards.every((card) => card.isMatched);
};
