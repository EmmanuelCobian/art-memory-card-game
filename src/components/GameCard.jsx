function GameCard({ card, idx, handleCardClick, handleImageError, handleImageLoad }) {
  return (
    <>
      <div
        className={`art-card ${
          card.isFlipped || card.isMatched ? "flipped" : ""
        }`}
        onClick={() => handleCardClick(idx)}
      >
        <div className="art-card-inner">
          <div className="art-card-front"></div>
          <div className="art-card-back">
            <img
              src={card.imageURL}
              crossOrigin="anonymous"
              alt={`Card ${card.pairId}`}
              className="art-image"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default GameCard;
