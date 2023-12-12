const Board = (function () {
    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;

    const drawMark = (row, column, player) => {
        board[row + 3 * column] = player.token;
    };

    const printBoard = () => {
        const gridBoard = [board.slice(0, 3), board.slice(3, 6), board.slice(6, 9)];
        console.log(gridBoard);
    };

    const restart = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    };

    return { getBoard, drawMark, printBoard, restart };
})();

const Player = (function (player1Name = "player 1", player2Name = "player 2") {
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

    const getPlayers = () => players;

    return { getPlayers };
})();

const Game = (function () {
    const board = Board;
    const players = Player.getPlayers();

    let activePlayer = players[0];

    const switchPlayers = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
    };

    const checkWin = () => {
        const b = board.getBoard();
        return (
            (b[0] == b[1] && b[1] == b[2] && b[0] !== "") ||
            (b[3] == b[4] && b[4] == b[5] && b[3] !== "") ||
            (b[6] == b[7] && b[7] == b[8] && b[6] !== "") ||
            (b[0] == b[3] && b[3] == b[6] && b[0] !== "") ||
            (b[1] == b[4] && b[4] == b[7] && b[1] !== "") ||
            (b[2] == b[5] && b[5] == b[8] && b[2] !== "") ||
            (b[0] == b[4] && b[4] == b[8] && b[0] !== "") ||
            (b[2] == b[4] && b[4] == b[6] && b[2] !== "")
        );
    };

    const playRound = (row, column) => {
        if (board.getBoard()[row + 3 * column] == "") {
            console.log(`Drawing ${getActivePlayer().token} on ${row}, ${column}`);
            board.drawMark(row, column, getActivePlayer());

            if (checkWin()) {
                alert(`${getActivePlayer().name} won!`);
                board.restart();
                printNewRound();
            } else {
                switchPlayers();
                printNewRound();
            }
        } else {
            alert("This cell is already filled, choose an empty one");
        }
    };

    printNewRound();

    return {
        playRound,
        getActivePlayer,
        checkWin,
        board
    };
})();

function handleClick(event) {
    const row = parseInt(event.target.dataset.row);
    const column = parseInt(event.target.dataset.column);

    Game.playRound(row, column);
    Display();
}

function Display() {
    const boardElement = document.getElementById("board");
    const board = Game.board.getBoard();
    const textElement = document.getElementById("textbox");

    boardElement.innerHTML = "";
    if (!Game.checkWin()) {
        textElement.textContent = `${Game.getActivePlayer().name}'s turn!`;
    } else {
        const lastMovePlayer = Game.getActivePlayer() === Game.players[0] ? Game.players[1] : Game.players[0];
        alert(`${lastMovePlayer.name} won!`);
        Game.board.restart();
        Game.printNewRound();
    }

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const btnElement = document.createElement("div");
            btnElement.dataset.row = i;
            btnElement.dataset.column = j;
            btnElement.classList.add("cell");

            btnElement.addEventListener("click", handleClick);

            btnElement.textContent = board[i + 3 * j];

            boardElement.appendChild(btnElement);
        }
    }
}

Display();
