const rows = 6;
const cols = 7;
let board = [];
let currentPlayer;
let lastMove = null;
let player1, player2, player1Color, player2Color;
let player1Wins = 0, player2Wins = 0;
let isAI = false;

// Selectors
const boardElement = document.getElementById("board");
const turnIndicator = document.getElementById("currentPlayer");
const resetBtn = document.getElementById("resetBtn");
const undoBtn = document.getElementById("undoBtn");
const startBtn = document.getElementById("startGame");
const player1NameInput = document.getElementById("player1Name");
const player2NameInput = document.getElementById("player2Name");
const player1ColorInput = document.getElementById("player1Color");
const player2ColorInput = document.getElementById("player2Color");
const gameModeSelect = document.getElementById("gameMode");

// Sounds
const dropSound = new Audio("./sounds/drop.mp3");
const winSound = new Audio("./sounds/win.mp3");

// Initialize the board
function initializeBoard() {
    board = Array(rows).fill(null).map(() => Array(cols).fill(null));
    boardElement.innerHTML = "";

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener("click", () => dropPiece(col));
            boardElement.appendChild(cell);
        }
    }
}

// Handle Game Mode Selection
gameModeSelect.addEventListener("change", () => {
    if (gameModeSelect.value === "ai") {
        player2NameInput.value = "Jarvis - AI";
        player2NameInput.setAttribute("disabled", "true");
        player2ColorInput.value = "#0000ff"; // Fixed Blue for AI
        player2ColorInput.setAttribute("disabled", "true");
    } else {
        player2NameInput.value = "";
        player2NameInput.removeAttribute("disabled");
        player2ColorInput.removeAttribute("disabled");
        player2ColorInput.value = "#ffff00";
    }
});

// Start Game
startBtn.addEventListener("click", () => {
    player1 = player1NameInput.value.trim();
    player2 = player2NameInput.value.trim();

    if (!player1 || !player2) {
        alert("Please enter both player names.");
        return;
    }

    player1Color = player1ColorInput.value;
    player2Color = player2ColorInput.value;

    // Validate colors in two player mode
    if (gameModeSelect.value === "twoPlayers" && player1Color === player2Color) {
        alert("Both players cannot have the same color. Please choose different colors.");
        return;
    }

    isAI = gameModeSelect.value === "ai";

    currentPlayer = player1Color;
    updateTurnIndicator();

    initializeBoard();
    document.getElementById("gameSection").style.display = "block";
    document.getElementById("setup").style.display = "none";

    // Update scoreboard colors
    document.querySelector("#player1Score").parentElement.style.color = player1Color;
    document.querySelector("#player2Score").parentElement.style.color = player2Color;
});

// Update turn indicator with player name and color
function updateTurnIndicator() {
    const isPlayer1Turn = currentPlayer === player1Color;
    const playerName = isPlayer1Turn ? player1 : player2;
    const playerColor = isPlayer1Turn ? player1Color : player2Color;
    
    turnIndicator.textContent = playerName;
    turnIndicator.style.color = playerColor;
}

// Drop a piece
function dropPiece(col) {
    for (let row = rows - 1; row >= 0; row--) {
        if (!board[row][col]) {
            lastMove = { row, col, player: currentPlayer };
            board[row][col] = currentPlayer;
            dropSound.play();
            updateBoard();
            
            if (checkWin(row, col)) {
                winSound.play();
                setTimeout(() => {
                    alert(`🥳 Hurray ${getCurrentPlayerName()} wins! 🎉`);
                    updateScore();
                }, 100);
                return;
            }
            
            if (board.flat().every(cell => cell !== null)) {
                setTimeout(() => alert("It's a draw!"), 100);
                return;
            }
            
            switchPlayer();
            return;
        }
    }
}

// AI Opponent (Random Move)
function aiMove() {
    let availableCols = [];
    for (let col = 0; col < cols; col++) {
        if (!board[0][col]) availableCols.push(col);
    }
    if (availableCols.length > 0) {
        let randomCol = availableCols[Math.floor(Math.random() * availableCols.length)];
        setTimeout(() => dropPiece(randomCol), 500); // Add slight delay for better UX
    }
}

// Update Board UI
function updateBoard() {
    document.querySelectorAll(".cell").forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        
        // Remove any existing piece
        cell.removeAttribute("data-piece");
        cell.style.backgroundColor = "";
        
        if (board[row][col]) {
            // Set the piece with the player's actual color
            cell.setAttribute("data-piece", "true");
            cell.style.backgroundColor = board[row][col];
        }
    });
}

// Switch Player
function switchPlayer() {
    currentPlayer = currentPlayer === player1Color ? player2Color : player1Color;
    updateTurnIndicator();

    if (isAI && currentPlayer === player2Color) {
        aiMove();
    }
}

// Get Current Player Name
function getCurrentPlayerName() {
    return currentPlayer === player1Color ? player1 : player2;
}

// Check for win
function checkWin(row, col) {
    return (
        checkDirection(row, col, 1, 0) ||  // Vertical
        checkDirection(row, col, 0, 1) ||  // Horizontal
        checkDirection(row, col, 1, 1) ||  // Diagonal /
        checkDirection(row, col, 1, -1)    // Diagonal \
    );
}

// Check a direction
function checkDirection(row, col, rowDir, colDir) {
    let count = 1;
    count += countPieces(row, col, rowDir, colDir);
    count += countPieces(row, col, -rowDir, -colDir);
    return count >= 4;
}

// Count consecutive pieces
function countPieces(row, col, rowDir, colDir) {
    let r = row + rowDir;
    let c = col + colDir;
    let count = 0;

    while (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c] === currentPlayer) {
        count++;
        r += rowDir;
        c += colDir;
    }
    return count;
}

// Undo Last Move
undoBtn.addEventListener("click", () => {
    if (lastMove) {
        board[lastMove.row][lastMove.col] = null;
        updateBoard();
        currentPlayer = lastMove.player;
        updateTurnIndicator();
        lastMove = null;
    }
});

// Update Scoreboard
function updateScore() {
    if (currentPlayer === player1Color) {
        player1Wins++;
        document.getElementById("player1Score").textContent = player1Wins;
    } else {
        player2Wins++;
        document.getElementById("player2Score").textContent = player2Wins;
    }
}

// Reset Game
resetBtn.addEventListener("click", () => {
    initializeBoard();
    document.getElementById("setup").style.display = "block";
    document.getElementById("gameSection").style.display = "none";
    player1Wins = 0;
    player2Wins = 0;
    document.getElementById("player1Score").textContent = "0";
    document.getElementById("player2Score").textContent = "0";
});

// Dark Mode Toggle
document.getElementById("darkModeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});

// Start the game
initializeBoard();