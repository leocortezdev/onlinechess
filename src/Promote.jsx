import React from 'react';
import { promotionPieces, move } from './Game';
import Square from './Square';



const Promote = ({promotion: {from, to, color}}) => {
    console.log(color);
    return (
        <div className="board">
            {
                promotionPieces.map((p, i) => {
                    return <div key={i} className="promote-square"> 
                        <Square black={i % 3 === 0}>
                            <div className="piece-container" onClick={() => move(from, to, p)}>   
                                <img src={`./assets/${color}${p.toUpperCase()}.png`} alt="" className="piece cursor-pointer" />
                            </div>
                         </Square>
                    </div>
                })
            }
        </div>
    )
} 

export default Promote
