
export const getXYPosition = (num , turn) => {
    const x = turn === 'w' ? num % 8 : Math.abs((num % 8) - 7)
    const y =
      turn === 'w'
        ? Math.abs(Math.floor(num / 8) - 7)
        : Math.floor(num / 8)
    return { x, y }
}

export const isBlack = (num) => {
    const {x , y} = getXYPosition(num);
    return (x + y) % 2 === 1
}

export const getPosition = (index, turn) => {
    const {x , y} = getXYPosition(index, turn);
    const letter = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][x];
    return `${letter}${y + 1}`;
}