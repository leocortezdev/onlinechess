import React from 'react'

const Square = ({children, black}) => {
    const backGroundClass = black ? 'square-black' : 'square-white';

    return (
        <div className={`${backGroundClass} board-square`}>
            {children}
        </div>
    )
}

export default Square
