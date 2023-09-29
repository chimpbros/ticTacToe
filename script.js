const gameBoard = (() => {
    const board = ['x', 'o', '', 'x', '', 'x', '', '', '']

    const render = () => {
        const boardCtn = document.querySelector('#board-container');
        boardCtn.innerHTML = '';
        board.forEach((square, index) => {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.textContent = square;
            cell.dataset.index = index;
            boardCtn.appendChild(cell);
        })
    }

    return {
        render
    };
})();

const player = (name, char) => {
    const sayHello = () => console.log(`my name is ${name}`);
    return {
        name,
        char,
        sayHello
    };
};

const startBtn = document.querySelector('#start');
startBtn.addEventListener('click', () => {
    gameBoard.render();
    // Game.start()
})