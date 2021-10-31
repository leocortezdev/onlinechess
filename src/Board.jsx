import React, { useEffect, useState } from "react";
import BoardSquare from "./BoardSquare";
import { isBlack, getPosition } from "./helper";

const Board = ({ board, position }) => {
  const [currBoard, setCurrBoard] = useState([]);
  console.log(board);
  console.log(position);
  useEffect(() => {
    setCurrBoard(position === "w" ? board.flat() : board.flat().reverse());
    console.log(board);
  }, [board, position]);

  return (
    <div className="board">
      {currBoard.map((piece, item) => (
        <div key={item} className="square">
          <BoardSquare
            piece={piece}
            black={isBlack(item)}
            position={getPosition(item, position)}
          />
        </div>
      ))}
    </div>
  );
};

export default Board;
