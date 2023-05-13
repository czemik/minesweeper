export interface Cell {
    isMine: boolean;
    neighborMineCount: number;
    isRevealed: boolean;
    isFlagged: boolean;
}