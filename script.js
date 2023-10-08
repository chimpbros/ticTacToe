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
            cellNumberArray[cellNumberIndex].index = [i, j];
            
            cellNumberIndex++;
        }
    }
    
    const getCellNumber = (indexRows, indexColumn) => {
        const number = cellNumberArray.filter(item => {
            return item.index.toString() === [indexRows,indexColumn].toString()
        })[0].number;
        return number;
    }

    const playersMove = (number, player) => {
        const cell = cellNumberArray.filter((item) => item.number === number)[0].cell;
        const cellValue = cell.getValue();
        if (cellValue !== 0) return;
        cell.addMarker(player);
        return true;
    }

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
    }

    const resetBoard = () => {
        board.forEach(row => {
            row.forEach(cell => {cell.addMarker(0)});
        });
    }
    
    return {
        getBoard,
        playersMove,
        printBoard,
        resetBoard,
        getCellNumber
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
    let winner;
    let round = 1;
    const board = GameBoard;
    const totalRound = document.querySelector('#round').value;

    const getRound = () => round;

    const players = [
        {
            name: playernOneName,
            marker: 1,
            filledCell: [],
            score: 0
        },
        {
            name: playerTwoName,
            marker: 2,
            filledCell: [],
            score: 0
        }
    ];

    let activePlayers = players[0];
    const switchActivePlayers = () => {
        activePlayers = activePlayers === players[0] ? players[1] : players[0];
    };
    const getActivePlayers = () => activePlayers;
    const getWinner = () => winner;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${activePlayers.name}'s turn`);
    }

    const resetPlayer = () => {
        players.forEach((player) => {
            player.filledCell = [];
            if(winner){
                player.score = 0
            }
        });
    }

    const isBoardFull = () => {
        return board.getBoard().every((row) => row.every((cell) => cell.getValue() !== 0));
    };

    const playRound = (number) => {
        
        // check for winner goes here
        const checkWin = () => {
            const winCondition = [
                [1,2,3],
                [4,5,6],
                [7,8,9],
                [1,4,7],
                [2,5,8],
                [3,6,9],
                [1,5,9],
                [3,5,7]
            ];

            return winCondition.some((combination) => 
            combination.every((index) => getActivePlayers().filledCell.includes(index))
            );
        }
        /* debugger */
        if(!checkWin()){
            const validMove = board.playersMove(number, getActivePlayers().marker);
            if(validMove){
                console.log(`adding ${getActivePlayers().name}'s marker into cell ${number}`);
                getActivePlayers().filledCell.push(number);
                if(checkWin()){
                    winner = getActivePlayers().name;
                    console.log(`Congratulations ${getActivePlayers().name} Win!`);
                    activePlayers.score += 1;
                    /* resetPlayer(); */
                    return
                }
                switchActivePlayers();
                printNewRound();
            }
        }

        if(isBoardFull()){
            console.log(`It's a draw`);
            /* board.resetBoard(); */
            /* resetPlayer(); */
            return
        }
        
        /* winner = null; */
    }

    const nextRound = () => {
        round += 1;
        resetPlayer();
        board.resetBoard();
        winner = null;
    }

    
    printNewRound();

    return {
        playRound,
        getActivePlayers,
        getBoard: board.getBoard,
        getCellNumber: board.getCellNumber,
        getWinner,
        isBoardFull,
        nextRound,
        getRound
    }
})();

function ScreenController () {
    const game = GameController;
    const infoDiv = document.querySelector('#info');
    const boardDiv = document.querySelector('#board-container');
    const startButton = document.querySelector('#start');
    const startScreen = document.querySelector('#start-screen');
    const roundNumber = document.querySelector('.round-number');
    const scoreCtn = document.querySelector('.score-container');
    const mainScreen = document.querySelector('#main-screen');
    const quitButton = document.querySelector('#quit');
    const nextRoundBtn = document.querySelector('#next-round');

    

    const updateScreen = () => {
        boardDiv.textContent = '';
        roundNumber.textContent = game.getRound();

        const board = game.getBoard();
        const activePlayersName = game.getActivePlayers().name;
        nextRoundBtn.style.display = 'none';
        

        if(game.getWinner()){
            infoDiv.textContent = `Congratulations ${game.getWinner()} takes the round!`;
            nextRoundBtn.style.display = 'block';
        }
        else if(game.isBoardFull()){
            infoDiv.textContent = "it's tie!";
        }
        else {
            infoDiv.textContent = `${activePlayersName}'s turn...`;
        }
        /* infoDiv.textContent = `${activePlayersName}'s turn...`; */

        board.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                const cellButton = document.createElement('button');
                cellButton.classList.add('cell');

                cellButton.dataset.number = game.getCellNumber(rowIndex, columnIndex);
                cellButton.textContent = cell.getValue();
                boardDiv.appendChild(cellButton);
            })
        });
        
    }

    const clickHandlerBoard = (e) => {
        const selectedCell = e.target.dataset.number;
        if(!selectedCell) return;

        game.playRound(parseInt(selectedCell));
        updateScreen();
    }

    const toggleDisplay = (target, trigger) => {
        let defaultDisplay = window.getComputedStyle(target).getPropertyValue('display');
        trigger.addEventListener('click', () => {
            target.style.display = 
            (target.style.display == 'none') ?
            defaultDisplay :
            'none';
        });
    }

    toggleDisplay(startScreen, startButton);
    toggleDisplay(mainScreen, startButton);
    toggleDisplay(startScreen, quitButton);
    toggleDisplay(mainScreen, quitButton);
    document.addEventListener('DOMContentLoaded', () => {
        mainScreen.style.display = 'none'
    });
    nextRoundBtn.addEventListener('click', () => {
        game.nextRound();
        updateScreen()
    });
    startButton.addEventListener('click', updateScreen);
    boardDiv.addEventListener('click', clickHandlerBoard);

};

ScreenController();



