
export const getXYPosition = (num) => {
    const x = num % 8;
    const y = Math.abs(Math.floor(num / 8) - 7);
    return {x, y};
}

export const isBlack = (num) => {
    const {x , y} = getXYPosition(num);
    return (x + y) % 2 === 1
}

export const getPosition = (index) => {
    const {x , y} = getXYPosition(index);
    const letter = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][x];
    return `${letter}${y + 1}`;
}