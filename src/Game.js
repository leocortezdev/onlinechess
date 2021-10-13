import * as Chess from "chess.js";
import { auth } from "./firebase";
import { BehaviorSubject } from "rxjs";
import { fromRef } from "rxfire/firestore";
import { map } from "rxjs/operators";

let gameRef;
let member;
export let gameSubject;

const chess = new Chess();

const updateGame = async (pendingPromotion, reset) => {
  const isGameOver = chess.game_over();
  const currentTurn = chess.turn() === "w" ? "WHITE" : "BLACK";

  if (gameRef) {
    const updatedData = {
      gameData: chess.fen(),
      pendingPromotion: pendingPromotion || null,
      currentTurn: currentTurn || null,
    };
    if(reset) {
        updatedData.status = 'over';
    }
    
    await gameRef.update(updatedData);
  } else {
    const newGame = {
      board: chess.board(),
      currentTurn,
      pendingPromotion,
      isGameOver,
      result: isGameOver ? gameResult() : null,
    };

    localStorage.setItem("savedGame", chess.fen());
    gameSubject.next(newGame);
  }
};

const gameResult = () => {
  if (chess.in_checkmate()) {
    const winner = chess.turn() === "w" ? "BLACK" : "WHITE";
    return `CHECKMATE - WINNER - ${winner}`;
  } else if (chess.in_draw()) {
    let reason = "50 - MOVE - RULE";
    if (chess.in_stalemate()) {
      reason = "STALEMATE";
    } else if (chess.in_threefold_repetition()) {
      reason = "REPTITIVE MOVES";
    } else if (chess.insufficient_material()) {
      reason = "NO MORE MATERIAL";
    }
    return `DRAW ${reason}`;
  } else {
    return "GAME-OVER: UNKNOWN REASON";
  }
};

export const resetGame = async () => {
    if(gameRef) {
        await updateGame(null, true);
        chess.reset()
    } else {
        chess.reset();
        updateGame();
    }
};


export const initGame = async (gameRefFb) => {
  const { currentUser } = auth;
  if (gameRefFb) {
    gameRef = gameRefFb;
    //console.log(gameRef);
    const initialGame = await gameRefFb.get().then((doc) => doc.data());
    if (!initialGame) {
      return "Game Not Found";
    }
    const creator = initialGame.members.find((m) => m.creator === true);

    if (initialGame.status === "waiting" && creator.uid !== currentUser.uid) {
      const currUser = {
        uid: currentUser.uid,
        name: localStorage.getItem("userName"),
        piece: creator.piece === "w" ? "b" : "w",
      };

      const updatedMembers = [...initialGame.members, currUser];
      await gameRefFb.update({ members: updatedMembers, status: "ready" });
    } else if (
      !initialGame.members.map((m) => m.uid).includes(currentUser.uid)
    ) {
      return "Game in progress, attempt to create your own game.";
    }

    chess.reset();
    gameSubject = fromRef(gameRefFb).pipe(
      map((gameDoc) => {
        const game = gameDoc.data();
        //console.log(game);
        const { pendingPromotion, gameData, ...restOfGame } = game;
        //console.log(game.members);
        //console.log(currentUser.uid);
        member = game.members.find((m) => m.uid === currentUser.uid);
        const opponent = game.members.find((m) => m.uid !== currentUser.uid);
        //console.log(member);

        if (gameData) {
          chess.load(gameData);
        }

        const isGameOver = chess.game_over();
        return {
          board: chess.board(),
          pendingPromotion,
          isGameOver,
          position: member.piece,
          member,
          opponent,
          result: isGameOver ? gameResult() : null,
          ...restOfGame,
        };
      })
    );
  } else {
    gameSubject = new BehaviorSubject();
    const savedGame = localStorage.getItem("savedGame");
    if (savedGame) {
      chess.load(savedGame);
    }
    updateGame();
  }
};

export const handleMove = (from, to) => {
  const promotions = chess.moves({ verbose: true }).filter((m) => m.promotion);
  console.table(promotions);
  let pendingPromotion;
  if (promotions.some((p) => `${p.from}:${p.to}` === `${from}:${to}`)) {
    pendingPromotion = { from, to, color: promotions[0].color };
    updateGame(pendingPromotion);
  }

  if (!pendingPromotion) {
    move(from, to);
  }
};

export const move = (from, to, promotion) => {
  let tempMove = { from, to };

  if (promotion) {
    tempMove.promotion = promotion;
  }
  if (gameRef) {
    if (member.piece === chess.turn()) {
      const legalMove = chess.move(tempMove);
      if (legalMove) {
        updateGame();
      }
    }
  } else {
    const allowedMove = chess.move(tempMove);

    if (allowedMove) {
      updateGame();
    }
  }
};

export const promotionPieces = ["r", "n", "b", "q"];
