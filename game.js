class Game2048 {
    constructor() {
        this.size = 4;
        this.board = [];
        this.score = 0;
        this.gameOver = false;
        this.history = [];

        this.init();
        this.setupEventListeners();
    }

    init() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    
    for (let i = 0; i < this.size * this.size; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        gameBoard.appendChild(cell);
    }
    
    this.resetGame();
}

resetGame() {
    this.board = Array(this.size).fill(null).map(() => Array(this.size).fill(0));
    this.score = 0;
    this.gameOver = false;
    this.history = [];
    
    const startTiles = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < startTiles; i++) {
        this.addRandomTile();
    }
    
    this.updateDisplay();
}

addRandomTile() {
    const emptyCells = [];
    for (let row = 0; row < this.size; row++) {
        for (let col = 0; col < this.size; col++) {
            if (this.board[row][col] === 0) {
                emptyCells.push({ row, col });
            }
        }
    }
    
    if (emptyCells.length > 0) {
        const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
}

updateDisplay() {
    const gameBoard = document.getElementById('gameBoard');
    const cells = gameBoard.querySelectorAll('.cell');
    
    document.querySelectorAll('.tile').forEach(tile => tile.remove());
    
    for (let row = 0; row < this.size; row++) {
        for (let col = 0; col < this.size; col++) {
            const value = this.board[row][col];
            if (value !== 0) {
                const tile = document.createElement('div');
                tile.classList.add('tile', `tile-${value}`);
                tile.textContent = value;
                
                const cellIndex = row * this.size + col;
                const cell = cells[cellIndex];
                const rect = cell.getBoundingClientRect();
                const boardRect = gameBoard.getBoundingClientRect();
                
                tile.style.width = cell.offsetWidth + 'px';
                tile.style.height = cell.offsetHeight + 'px';
                tile.style.left = (rect.left - boardRect.left) + 'px';
                tile.style.top = (rect.top - boardRect.top) + 'px';
                
                gameBoard.appendChild(tile);
            }
        }
    }
    
    document.getElementById('score').textContent = this.score;
}

mergeLine(line) {
    let newLine = line.filter(val => val !== 0);
    
    for (let i = 0; i < newLine.length - 1; i++) {
        if (newLine[i] === newLine[i + 1]) {
            newLine[i] *= 2;
            this.score += newLine[i];
            newLine.splice(i + 1, 1);
        }
    }
    
    while (newLine.length < this.size) {
        newLine.push(0);
    }
    
    return newLine;
}

moveLeft() {
    let moved = false;
    for (let row = 0; row < this.size; row++) {
        const newRow = this.mergeLine(this.board[row]);
        if (JSON.stringify(newRow) !== JSON.stringify(this.board[row])) {
            moved = true;
            this.board[row] = newRow;
        }
    }
    return moved;
}

moveRight() {
    let moved = false;
    for (let row = 0; row < this.size; row++) {
        const reversed = [...this.board[row]].reverse();
        const newRow = this.mergeLine(reversed).reverse();
        if (JSON.stringify(newRow) !== JSON.stringify(this.board[row])) {
            moved = true;
            this.board[row] = newRow;
        }
    }
    return moved;
}

moveUp() {
    let moved = false;
    for (let col = 0; col < this.size; col++) {
        const column = this.board.map(row => row[col]);
        const newColumn = this.mergeLine(column);
        if (JSON.stringify(newColumn) !== JSON.stringify(column)) {
            moved = true;
            for (let row = 0; row < this.size; row++) {
                this.board[row][col] = newColumn[row];
            }
        }
    }
    return moved;
}

moveDown() {
    let moved = false;
    for (let col = 0; col < this.size; col++) {
        const column = this.board.map(row => row[col]);
        const reversed = [...column].reverse();
        const newColumn = this.mergeLine(reversed).reverse();
        if (JSON.stringify(newColumn) !== JSON.stringify(column)) {
            moved = true;
            for (let row = 0; row < this.size; row++) {
                this.board[row][col] = newColumn[row];
            }
        }
    }
    return moved;
}

move(direction) {
    const prevBoard = JSON.parse(JSON.stringify(this.board));
    const prevScore = this.score;
    let moved = false;
    
    if (direction === 'left') {
        moved = this.moveLeft();
    } else if (direction === 'right') {
        moved = this.moveRight();
    } else if (direction === 'up') {
        moved = this.moveUp();
    } else if (direction === 'down') {
        moved = this.moveDown();
    }
    
    if (moved) {
        this.history.push({
            board: prevBoard,
            score: prevScore
        });
        
        if (this.history.length > 10) {
            this.history.shift();
        }
        
        const tilesToAdd = Math.random() < 0.5 ? 1 : 2;
        for (let i = 0; i < tilesToAdd; i++) {
            this.addRandomTile();
        }
        
        this.updateDisplay();
        
        if (this.isGameOver()) {
            this.gameOver = true;
            this.showGameOver();
        }
    }
}

setupEventListeners() {
    document.addEventListener('keydown', (e) => {
        if (this.gameOver) return;
        
        const keyMap = {
            'ArrowUp': 'up',
            'ArrowDown': 'down',
            'ArrowLeft': 'left',
            'ArrowRight': 'right'
        };
        
        if (keyMap[e.key]) {
            e.preventDefault();
            this.move(keyMap[e.key]);
        }
    });
}
}

const game = new Game2048();
