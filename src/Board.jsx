import React from "react";
import BoardSquare from "./BoardSquare";
import {isBlack , getPosition} from "./helper";


const Board = ({ board }) => {
  return (
    <div className="board">
      {board.flat().map((piece, item) => (
        <div key={item} className="square">
          <BoardSquare piece={piece} black={isBlack(item)} position={getPosition(item)}/>
        </div>
      ))}
    </div>
  );
};

export default Board;
