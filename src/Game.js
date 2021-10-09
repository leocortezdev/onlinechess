import * as Chess from 'chess.js';

import { BehaviorSubject } from 'rxjs';



const chess = new Chess();

const updateGame = (pendingPromotion) => {
    const isGameOver = chess.game_over();
    const currentTurn = chess.turn() === 'w' ? 'WHITE' : 'BLACK';

    const newGame = {
        board: chess.board(),
        currentTurn,
        pendingPromotion,
        isGameOver,
        result: isGameOver ? gameResult() : null,
    }

    gameSubject.next(newGame);
}

const gameResult = () => {
    if(chess.in_checkmate()) {
        const winner = chess.turn() === 'w' ? 'BLACK' : 'WHITE';
        return `CHECKMATE - WINNER - ${winner}`;
    } else if (chess.in_draw()) {
        let reason = '50 - MOVE - RULE';
        if(chess.in_stalemate()) {
            reason = 'STALEMATE';
        } else if (chess.in_threefold_repetition()) {
            reason = 'REPTITIVE MOVES';
        } else if (chess.insufficient_material()) {
            reason = 'NO MORE MATERIAL';
        }
        return `DRAW ${reason}`
    } else {
        return 'GAME-OVER: UNKNOWN REASON';
    }
}

export const resetGame = () => {
    chess.reset();
    updateGame();
}
 
export const initGame = () => {
    updateGame();
}

export const gameSubject = new BehaviorSubject();

export const handleMove = (from, to) => {
    const promotions = chess.moves({verbose: true}).filter(m => m.promotion);
    console.table(promotions);
    if(promotions.some(p => `${p.from}:${p.to}` === `${from}:${to}`)) {
        const pendingPromotion = {from, to, color: promotions[0].color};
        updateGame(pendingPromotion);
    }
    const { pendingPromotion } = gameSubject.getValue();

    if(!pendingPromotion) {
        move(from, to);
    }
}

export const move = (from, to, promotion) => {
    let tempMove = {from, to};

    if(promotion) {
        tempMove.promotion = promotion;
    }

    const allowedMove = chess.move(tempMove);

    if(allowedMove) {
       updateGame();
    }
}

export const promotionPieces = ['r', 'n', 'b', 'q'];


