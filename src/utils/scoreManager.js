/**
 * Utility functions for managing local high scores
 */

const SCORES_KEY = "top-scores";
const MAX_SCORES = 5;

export const calculateScore = (moves, time) => {
  const baseScore = 10000;
  let score = Math.max(0, baseScore - moves * 100 - time * 10);
  return score;
};

export const saveScore = (moves, time) => {
  let scores = getScores();
  scores.push({
    score: calculateScore(moves, time),
    moves: moves,
    time: time,
  });
  scores.sort((a, b) => b.score - a.score);
  scores = scores.slice(0, MAX_SCORES);
  localStorage.setItem(SCORES_KEY, JSON.stringify(scores));
};

export const getScores = () => {
  return JSON.parse(localStorage.getItem(SCORES_KEY) || "[]");
};

export const isTopScore = (score) => {
  const scores = getScores();
  if (scores.length < MAX_SCORES) {
    return true;
  }
  return score > Math.min(...scores.map((s) => s.score));
};

export const clearScores = () => {
  localStorage.clear();
};
