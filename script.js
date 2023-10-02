const GameBoard = (() => {
    const row = 3;
    const column = 3;
    const board = [];

    for(let i = 0; i < row; i++){
        board[i] = [];
        for(let j = 0; j < column; j++){
            board[i].push(Cell());
        }
    }
    
    const getBoard = () => board;

    const cellNumberArray = [];

    let cellNumberIndex = 0;
    for(let i = 0; i < 3; i++){
        
        for(let j = 0; j < 3; j++){
            cellNumberArray[cellNumberIndex] = {};
            cellNumberArray[cellNumberIndex].number = cellNumberIndex + 1;
            cellNumberArray[cellNumberIndex].cell = board[i][j];
            
            cellNumberIndex++;
        }
    }
    console.log(cellNumberArray)

    const playersMove = (number, player) => {
        const cell = cellNumberArray.filter((item) => item.number === number)[0].cell;
        if (cell.getValue() !== 0) return;
        cell.addMarker(player);
    }

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
    }

    
    
    return {
        getBoard,
        playersMove,
        printBoard
    }
})();

function Cell() {
    let value = 0;

    const addMarker = (player) => {
        value = player;
    };

    const getValue = () => value;  

    return {
        addMarker,
        getValue
    }
};


const Player = (name, marker) => {
    const getName = () => name;
    const getMarker = () => marker

    return {
        getName,
        getMarker
    };
};

const GameController = (() => {
    let playernOneName = 'player one';
    let playerTwoName = 'player two';
    const board = GameBoard;

    const players = [
        {
            name: playernOneName,
            marker: 1
        },
        {
            name: playerTwoName,
            marker: 2
        }
    ];

    let activePlayers = players[0];
    const switchActivePlayers = () => {
        activePlayers = activePlayers === players[0] ? players[1] : players[0];
    };
    const getActivePlayers = () => activePlayers;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${activePlayers.name}'s turn`);
    }

    const playRound = (number) => {
        console.log(`adding ${getActivePlayers().name}'s marker into cell ${number}`);

        board.playersMove(number, getActivePlayers().marker);
        switchActivePlayers();
        printNewRound();
    }

    printNewRound();

    return {
        playRound,
        getActivePlayers
    }
})();

const game = GameController;

const startBtn = document.querySelector('#start');
startBtn.addEventListener('click', () => {
    // Game.start()
})