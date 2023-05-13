import { Injectable } from '@angular/core';
import { Cell } from '../models/Cell';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  board: Cell[][] = [];
  gameLost = false;
  gameWon = false;
  constructor() { }
  
  
  newGame(rows: number, cols: number, mines: number): void {
    this.generateBoard(rows, cols, mines);
    this.gameLost = false;
    this.gameWon = false;
  }

  generateBoard(rows: number, cols: number, mines: number): void {
    let counter = 0;
    this.board = [];

    for(let i = 0; i < rows; i++){
      this.board[i] = []
      for(let j = 0; j < cols; j++){
        this.board[i][j] = {
          isMine: false,
          neighborMineCount: 0,
          isRevealed: false,
          isFlagged: false
        };
      }
    }

    // Randomly place mines
    for (let i = 0; i < mines; i++) {
      let row, col;
      //do {
        row = Math.floor(Math.random() * rows);
        col = Math.floor(Math.random() * cols);
      //} while (board[row][col].isMine);
      this.board[row][col].isMine = true;
    }

    // Calculate neighbor mine count for each cell
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (!this.board[row][col].isMine) {
          this.board[row][col].neighborMineCount = this.countNeighborMines(row, col);
        }
      }
    }
  }

  countNeighborMines(row: number, col: number): number {
    let count = 0;
    for (let r = -1; r <= 1; r++) {
      for (let c = -1; c <= 1; c++) {
        if (this.isValidCell(row + r, col + c) && this.board[row + r][col + c].isMine) {
          count++;
        }
      }
    }
    return count;
  }

  isValidCell(row: number, col: number): boolean {
    return row >= 0 && row < this.board.length && col >= 0 && col < this.board[0].length;
  }

  revealCell(row: number, col: number): void {
    if (this.board[row][col].isRevealed || this.board[row][col].isFlagged) {
      return;
    }
    this.board[row][col].isRevealed = true;
    if (this.board[row][col].isMine) {
      this.gameLost = true;
      return;
    }

    if (this.board[row][col].neighborMineCount === 0) {
      // Recursively reveal neighbors
      
      for (let r = -1; r <= 1; r++) {
        for (let c = -1; c <= 1; c++) {
          if (this.isValidCell(row + r, col + c)) {
           // this.board[row + r][col + c].isRevealed = true;
            this.revealCell(row + r, col + c);
            
          }
        }
      }
    }

    if (this.isGameWon()) {
      this.gameWon = true;
    }
  }

  isGameWon(): boolean {
    for (let row of this.board) {
      for (let cell of row) {
        if (!cell.isMine && !cell.isRevealed) {
          return false;
        }
      }
    }
    return true;
  }

  flagCell(row: number, col: number): void {
    if (!this.board[row][col].isRevealed) {
      this.board[row][col].isFlagged = !this.board[row][col].isFlagged;
    }
  }

}
