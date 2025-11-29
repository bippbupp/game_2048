class Game2048 {
    constructor() {
        this.size = 4;
        this.board = [];
        this.score = 0;
        this.gameOver = false;
        this.history = [];

        this.init();
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
}

const game = new Game2048();
