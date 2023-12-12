const Board = (function () {
    const rows = 3;
    let board = [[Cell(),Cell(),Cell()],[Cell(),Cell(),Cell()],[Cell(),Cell(),Cell()]];

    const getBoard = () => board;

    const drawMark = (row, column, player) => {
        board[row][column].addMark(player);
    };

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
    };

    return { getBoard, drawMark, printBoard };
})();

function Cell() {
    let value = 0;

    const addMark = (player) => {
        value = player;
    };

    const getValue = () => value;

    return {addMark, getValue};
}

const Game = (function (player1Name = "player 1", player2Name = "player2") {
    const board = Board;

    const players = [
        {
            name: player1Name,
            token: "x"
        },
        {
            name: player2Name,
            token: "o"
        }
    ];

    let activePlayer = players[0];

    const switchPlayers = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn`);
    };

    const playRound = (row, column) => {
        if (board.getBoard()[row][column].getValue() === 0) {
            console.log(`Drawing ${getActivePlayer().token} on ${row}, ${column}`);
            board.drawMark(row, column, getActivePlayer().token);

            let revDiagonal = 0;
            let diagonal = 0;
            let rowScore = 0;
            let colScore = 0;
            for (let i in board.getBoard()) {
                //reverse diagonal
                revDiagonal += board.getBoard()[i][2 - i].getValue() == getActivePlayer().token;
                //diagonal
                diagonal += board.getBoard()[i][i].getValue() == getActivePlayer().token;
                //row
                rowScore += board.getBoard()[row][i].getValue() == getActivePlayer().token;
                //column
                colScore += board.getBoard()[i][column].getValue() == getActivePlayer().token;
            }
            if (revDiagonal == 3 || diagonal == 3 || rowScore == 3 || colScore == 3) {
                console.log(`${getActivePlayer().name} won!`);
            }

            switchPlayers();
            printNewRound();
        } else {
            console.log("This cell is already filled, pick an empty one");
        }
    };

    const Restart = () => {
        board = [[Cell(),Cell(),Cell()],[Cell(),Cell(),Cell()],[Cell(),Cell(),Cell()]];
        activePlayer = players[0];

        console.log("game restarted");
    }

    printNewRound();

    return {
        playRound,
        getActivePlayer,
        activePlayer,
        players,
        board
    };
})();

const game = Game;

function handleCellClick(game, event) {
    const row = parseInt(event.target.dataset.row);
    const column = parseInt(event.target.dataset.column);

    // Check if the cell is empty before playing a round
    if (game.board.getBoard()[row][column].getValue() === 0) {
        game.playRound(row, column);
        Display(game); // Update the UI after playing a round
    } else {
        alert("This cell is already filled, pick an empty one");
    }
}


function Display() {
    const boardElement = document.getElementById('board');
    const board = game.board.getBoard();

    // Clear the existing board
    boardElement.innerHTML = '';

    // Iterate through the rows and cells to create the board
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            cellElement.dataset.row = i;
            cellElement.dataset.column = j;

            // Add click event listener to each cell
            cellElement.addEventListener('click', handleCellClick.bind(null, game));

            // Set the text content based on the cell value
            cellElement.textContent = board[i][j].getValue();

            // Append the cell to the board
            boardElement.appendChild(cellElement);
        }
    }
}

// Event listener for the "Restart Game" button
document.getElementById('restartGameBtn').addEventListener('click', restartGame);

Display();
