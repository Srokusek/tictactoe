function Board() {
    const rows = 3;
    const board = [];

    for (let i=0; i<rows; i++) {
        board[i] = [];
        for (let j=0; j<rows; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const drawMark = (row, column, player) => {
        board[row][column].addMark(player);
    };

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
    };

    return {getBoard, drawMark, printBoard};
}

function Cell() {
    let value = 0;

    const addMark = (player) => {
        value = player;
    };

    const getValue = () => value;

    return {addMark, getValue};
}

function Game(player1Name = "player 1", player2Name = "player2") {
    const board = Board();

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
        activePlayer = activePlayer === players[0] ? players[1] :players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn`);
    }

    const playRound = (row, column) => {
        if (board.getBoard()[row][column].getValue() === 0) {
            console.log(`Drawing ${getActivePlayer().token} on ${row}, ${column}`);
            board.drawMark(row,column,getActivePlayer().token);

            let revDiagonal = 0;
            let diagonal = 0;
            let rowScore = 0;
            let colScore = 0;
            for (i in board.getBoard()) {
                //reverse diagonal
                revDiagonal += board.getBoard()[i][2-i].getValue() == getActivePlayer().token;
                //diagonal
                diagonal += board.getBoard()[i][i].getValue() == getActivePlayer().token;
                //row
                rowScore += board.getBoard()[row][i].getValue() == getActivePlayer().token;
                //column
                colScore += board.getBoard()[i][column].getValue() == getActivePlayer().token;
            }
            if (revDiagonal == 3 || diagonal ==3 || rowScore == 3 || colScore == 3) {
                console.log(`${getActivePlayer().name} won!`);
            }

            switchPlayers();
            printNewRound();
        } else {
            console.log("This cell is already filled, pick an empty one");
        }
    }

    printNewRound();
    
    return {
        playRound,
        getActivePlayer
    };
}

const game = Game();