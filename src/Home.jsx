import React, { useState } from "react";

const Home = () => {
  const [showModal, setModal] = useState(false);
  const gameOptions = [
    { label: "Black pieces", value: "b" },
    { label: "White pieces", value: "w" },
    { label: "Random", value: "r" },
  ];

  const handlePlayOnline = (e) => {
      setModal(true);
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
        <div className="modal-background">
          <div className="modal-content">
            <div className="card">
              <div className="card-content">
                Please select the piece you want to start with
              </div>

              <footer className="card-footer">
                {gameOptions.map(({ label, value }) => (
                  <span className="card-footer-item" key={value}>
                    {label}
                  </span>
                ))
                }
              </footer>
            </div>
          </div>
          <button className="modal-close is-large centered" onClick={(e) => setModal(false)}></button>
        </div>
      </div>
    </>
  );
};

export default Home;
