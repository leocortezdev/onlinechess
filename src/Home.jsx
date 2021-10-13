import React, { useState } from "react";
import { auth, db } from "./firebase";
import { useHistory } from 'react-router-dom';

const Home = () => {
  const { currentUser } = auth;
  const [showModal, setModal] = useState(false);
  const gameOptions = [
    { label: "Black pieces", value: "b" },
    { label: "White pieces", value: "w" },
    { label: "Random", value: "r" },
  ];
  const history = useHistory();

  const handlePlayOnline = (e) => {
    setModal(true);
  };

  const startOnlineGame = async (startPiece) => {
    const member = {
      uid: currentUser.uid,
      piece:
        startPiece === "r"
          ? ["b", "w"][Math.round(Math.random())]
          : startPiece,
      name: localStorage.getItem("userName"),
      creator: true,
    };

    const game = {
      status: "waiting",
      members: [member],
      gameId: `${Math.random().toString(36).substring(2, 9)}_${Date.now()}`,
    };

    await db.collection("games").doc(game.gameId).set(game);
    history.push(`game/${game.gameId}`);
  };

  return (
    <>
      <div className="columns home">
        <div className="column has-background-primary home-column">
          <button className="button is-link">Play Locally</button>
        </div>
        <div className="column has-background-link home-column">
          <button className="button is-primary" onClick={handlePlayOnline}>
            Play Online
          </button>
        </div>
      </div>
      <div className={`modal ${showModal ? "is-active" : ""}`}>
        <div className="modal-background"></div>
          <div className="modal-content">
            <div className="card">
              <div className="card-content">
                <div className="content">
                Please select the piece you want to start with
                </div>
                
              </div>

              <footer className="card-footer">
                {gameOptions.map(({ label, value }) => (
                  <span className="card-footer-item cursor-pointer hover" key={value} onClick={() => startOnlineGame(value)}>
                    {label}
                  </span>
                ))}
              </footer>
            </div>
          </div>
        <button
            className="modal-close is-large centered"
            onClick={(e) => setModal(false)}
          ></button>
      </div>
    </>
  );
};

export default Home;
