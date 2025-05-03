'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  /**
   * Creates a new game instance.
   *
   * @param {number[][]} initialState
   * The initial state of the board.
   * @default
   * [[0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0]]
   *
   * If passed, the board will be initialized with the provided
   * initial state.
   */
  constructor(initialState) {
    this.size = 4;

    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.status = 'idle'; // 'idle', 'playing', 'win', 'lose'
  }

  moveLeft() {
    // Check if the game is in progress
    if (this.status !== 'playing') {
      return;
    }

    // Move tiles left
    for (let row = 0; row < this.size; row++) {
      const newRow = [];

      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] !== 0) {
          newRow.push(this.board[row][col]);
        }
      }

      // Merge tiles
      const mergedRow = [];

      for (let i = 0; i < newRow.length; i++) {
        if (newRow[i] === newRow[i + 1]) {
          mergedRow.push(newRow[i] * 2);
          this.score += newRow[i] * 2;
          i++;
        } else {
          mergedRow.push(newRow[i]);
        }
      }

      // Fill the rest of the row with zeros
      while (mergedRow.length < this.size) {
        mergedRow.push(0);
      }

      // Update the board
      this.board[row] = mergedRow;
    }

    // Add a random tile after the move
    this.addRandomTile();
  }
  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let row = 0; row < this.size; row++) {
      const originalRow = [...this.board[row]]; // копія для порівняння
      const reversedRow = [...originalRow].reverse();

      // Фільтруємо ненульові
      const filtered = reversedRow.filter((val) => val !== 0);

      // Об’єднання
      const merged = [];

      for (let i = 0; i < filtered.length; i++) {
        if (filtered[i] === filtered[i + 1]) {
          merged.push(filtered[i] * 2);
          this.score += filtered[i] * 2;
          i++;
        } else {
          merged.push(filtered[i]);
        }
      }

      // Дозаповнення нулями
      while (merged.length < this.size) {
        merged.push(0);
      }

      // Перевертаємо назад, щоб був "правий" напрямок
      const newRow = merged.reverse();

      // Оновлюємо, якщо зміни були
      if (JSON.stringify(originalRow) !== JSON.stringify(newRow)) {
        this.board[row] = newRow;
        moved = true;
      }
    }

    if (moved) {
      this.addRandomTile();
    }
  }

  moveUp() {
    // Check if the game is in progress
    if (this.status !== 'playing') {
      return;
    }

    // Move tiles up
    for (let col = 0; col < this.size; col++) {
      const column = [];

      for (let row = 0; row < this.size; row++) {
        if (this.board[row][col] !== 0) {
          column.push(this.board[row][col]);
        }
      }

      // Merge tiles
      const mergedColumn = [];

      for (let i = 0; i < column.length; i++) {
        if (column[i] === column[i + 1]) {
          mergedColumn.push(column[i] * 2);
          this.score += column[i] * 2;
          i++;
        } else {
          mergedColumn.push(column[i]);
        }
      }

      // Fill the rest of the column with zeros
      while (mergedColumn.length < this.size) {
        mergedColumn.push(0);
      }

      // Update the board
      for (let row = 0; row < this.size; row++) {
        this.board[row][col] = mergedColumn[row];
      }
    }

    // Add a random tile after the move
    this.addRandomTile();
  }
  moveDown() {
    // Check if the game is in progress
    if (this.status !== 'playing') {
      return;
    }

    // Move tiles down
    for (let col = 0; col < this.size; col++) {
      const column = [];

      for (let row = this.size - 1; row >= 0; row--) {
        if (this.board[row][col] !== 0) {
          column.push(this.board[row][col]);
        }
      }

      // Merge tiles
      const mergedColumn = [];

      for (let i = 0; i < column.length; i++) {
        if (column[i] === column[i + 1]) {
          mergedColumn.push(column[i] * 2);
          this.score += column[i] * 2;
          i++;
        } else {
          mergedColumn.push(column[i]);
        }
      }

      // Fill the rest of the column with zeros
      while (mergedColumn.length < this.size) {
        mergedColumn.push(0);
      }

      // Update the board
      for (let row = this.size - 1; row >= 0; row--) {
        this.board[row][col] = mergedColumn[this.size - 1 - row];
      }
    }

    // Add a random tile after the move
    this.addRandomTile();
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.board;
  }

  /**
   * Returns the current game status.
   *
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   *
   * `idle` - the game has not started yet (the initial state);
   * `playing` - the game is in progress;
   * `win` - the game is won;
   * `lose` - the game is lost
   */
  getStatus() {
    if (this.isGameWon()) {
      this.status = 'win';
    } else if (this.isGameLost()) {
      this.status = 'lose';
    } else if (this.isGameInProgress()) {
      this.status = 'playing';
    } else {
      this.status = 'idle';
    }

    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';
    this.start();
  }

  /**
   * Adds a random tile to the board.
   *
   * @returns {number[][]}
   */

  addRandomTile() {
    const emptyTiles = this.getEmptyTiles();

    if (emptyTiles.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyTiles.length);
    const [row, col] = emptyTiles[randomIndex];

    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
    this.score += this.board[row][col];
    this.status = 'playing';
  }

  /**
   * Returns the empty tiles on the board.
   *
   * @returns {number[][]}
   */
  getEmptyTiles() {
    const emptyTiles = [];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          emptyTiles.push([row, col]);
        }
      }
    }

    return emptyTiles;
  }
  /**
   * Checks if the game is over.
   *
   * @returns {boolean}
   */
  isGameOver() {
    // Check if there are any empty tiles
    if (this.getEmptyTiles().length > 0) {
      return false;
    }

    // Check if there are any possible moves
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (
          (col < this.size - 1 &&
            this.board[row][col] === this.board[row][col + 1]) ||
          (row < this.size - 1 &&
            this.board[row][col] === this.board[row + 1][col])
        ) {
          return false;
        }
      }
    }

    return true;
  }
  /**
   * Checks if the game is won.
   *
   * @returns {boolean}
   */
  isGameWon() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 2048) {
          return true;
        }
      }
    }

    return false;
  }
  /**
   * Checks if the game is lost.
   *
   * @returns {boolean}
   */
  isGameLost() {
    return this.isGameOver() && !this.isGameWon();
  }
  /**
   * Checks if the game is in progress.
   *
   * @returns {boolean}
   */
  isGameInProgress() {
    return this.status === 'playing';
  }
  /**
   * Checks if the game is idle.
   *
   * @returns {boolean}
   */
}

module.exports = Game;
