import { useState, useEffect, useRef } from "react";

/**
 * hook for managing a game timer that starts on first interaction
 * and stops when the game is won or manually stopped
 *
 * @param {boolean} isGameWon - Whether the game has been won
 * @param {int} moves - Number of moves made so far
 * @returns {Object} - Timer state and control functions
 */
export const useTimer = (isGameWon, moves) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const startTimer = () => {
    if (!isRunning && !isGameWon) {
      setIsRunning(true);
    }
  };

  const stopTimer = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const resetTimer = () => {
    stopTimer();
    setTime(0);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    if (isRunning && !isGameWon) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime + 1;
          return newTime >= 5999 ? 5999 : newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isGameWon]);

  useEffect(() => {
    if (isGameWon) {
      stopTimer();
    }
  }, [isGameWon]);

  useEffect(() => {
    if (moves == 0) {
      resetTimer();
    }
  }, [moves]);

  return {
    time,
    formattedTime: formatTime(time),
    isRunning,
    startTimer,
    stopTimer,
    resetTimer,
  };
};
