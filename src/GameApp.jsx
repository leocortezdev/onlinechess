import React, { useEffect, useState } from "react";
import "./App.css";
import { gameSubject, initGame, resetGame } from "./Game";
import Board from "./Board";
const GameApp = () => {
  const [board, setBoard] = useState([]);
  const [turn, setTurn] = useState();
  const [isGameOver, setIsGameOver] = useState(null);
  const [result, setResult] = useState();

  useEffect(() => {
    initGame();
    const subscribe = gameSubject.subscribe((game) => {
      setBoard(game.board);
      setTurn(game.currentTurn);
      setIsGameOver(game.isGameOver);
      setResult(game.result);
    });
    return () => subscribe.unsubscribe();
  }, []);

  return (
    <div className="app-container">
      {isGameOver && (
        <h2 className="vertical-text">
          GAME OVER
          <button onClick={resetGame}>
            <span className="vertical-text cursor-pointer">NEW GAME</span>
          </button>
        </h2>
      )}
      <div className="board-container">
        {turn === "" ? null : (
          <h2 className="top-text" style={{color: `${turn}`, backgroundColor: `${turn === 'WHITE' ? 'black' : 'whitesmoke'}`}}> Current Turn: {turn}</h2>
        )}
        <Board board={board} />
      </div>
      {result && <p className="vertical-text">{result}</p>} 
    </div>
  );
};

export default GameApp;
