import React, { useEffect, useState } from "react";
import "./App.css";
import { gameSubject, initGame, resetGame } from "./Game";
import Board from "./Board";
import { useParams, useHistory } from "react-router-dom";
import { db } from "./firebase";

const GameApp = () => {
  const [board, setBoard] = useState([]);
  const [turn, setTurn] = useState();
  const [game, setGame] = useState({});
  const [isGameOver, setIsGameOver] = useState(null);
  const [result, setResult] = useState();
  const [initResult, setInitResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("waiting");
  const { id } = useParams();
  const history = useHistory();
  //console.log(useParams());
  const shareLink = window.location.href;
  useEffect(() => {
    let subscribe;
    //console.log(id);
    const init = async () => {
      const res = await initGame(id !== "local" ? db.doc(`games/${id}`) : null);
      setInitResult(res);
      setLoading(false);
      if (!res) {
        subscribe = gameSubject.subscribe((game) => {
          setBoard(game.board);
          setTurn(game.currentTurn);
          setIsGameOver(game.isGameOver);
          setResult(game.result);
          setStatus(game.status);
          setGame(game);
        });
      }
    };
    init();
    //console.log(subscribe)
    return () => subscribe && subscribe.unsubscribe();
  }, [id]);

  if (loading) {
    return "Loading...";
  }

  if (initResult === "Game Not Found") {
    return "Game Not Found";
  }

  if (initResult === "Game in progress, attempt to create your own game.") {
    return "Game in progress, attempt to create your own game.";
  }
  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareLink);
  };
  return (
    <div className="app-container">
      {isGameOver && (
        <h2 className="vertical-text">
          GAME OVER
          <button onClick={async () => {
            await resetGame();
            history.push('/');
            }}>
            <span className="vertical-text cursor-pointer">NEW GAME</span>
          </button>
        </h2>
      )}
      <div className="board-container">
        {turn === "" ? null : (
          <h2
            className="top-text"
            style={{
              color: `${turn}`,
              backgroundColor: `${turn === "w" ? "black" : "whitesmoke"}`,
            }}
          >
            {" "}
            Current Turn: {turn}
          </h2>
        )}
        {game.opponent && game.opponent.name && (<span className="tag is-link">{game.opponent.name}</span>)}
        <Board board={board} />
        {game.member && game.member.name && (<span className="tag is-link">{game.member.name}</span>)}
      </div>
      {result && <p className="vertical-text">{result}</p>}
      {status === "waiting" && (
        <div className="notification is-link share-game">
          <strong>Share this game to start</strong>
          <br />
          <br />
          <div className="field has-addons">
            <div className="control is-expanded">
              <input
                type="text"
                name="url-link"
                id=""
                className="input"
                readOnly
                value={shareLink}
              />
            </div>
            <div className="control">
              <button className="button is-info" onClick={handleCopy}>
                Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameApp;
