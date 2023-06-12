function solveSudoku(board) {

    // Board Dimensions
    const N = board.length;

    // Gets possible values for all cells and sorts them based on numbers of possible values
    const emptyCell = availableNumbersForAllCells(board);

    if (emptyCell.length === 0) {
        // If No more empty cells, Sudoku is solved
        return true;
    }

    const { row, col } = emptyCell[0];
    const availableNumbers = getAvailableNumbers(board, row, col);

    // Sort available numbers based on MRV heuristic (ascending order)
    availableNumbers.sort((a,b) => {
        if (a === b) {
            const aCount = howManySafe(board, row, col, a);
            const bCount = howManySafe(board, row, col, b);
            return aCount - bCount;
        }
        return a - b;
    })


    for (const num of availableNumbers) {
        if (isSafe(board, row, col, num)) {
            // Place the number if it's safe
            board[row][col] = num;

            // Recursively solve for the next empty cell
            if (solveSudoku(board)) {
                return true;
            }

            // If the number doesn't lead to a solution, backtrack
            board[row][col] = 0;
        }
    }

    // No valid number found, backtrack
    return false;
}

function howManySafe(board,row, col, num) {
    let counter = 0;

    if (!isUsedInRow(board, row, num)) {
        counter++;
    }
    if (!isUsedInColumn(board, col, num)) {
        counter++;
    }
    if (!isUsedInBox(board, row - (row % 3), col - (col % 3), num)) {
        counter++;
    }

    return counter;
}

function availableNumbersForAllCells(board) {
    const availableNumbers = [];
    const N = board.length;

    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            if (board[i][j] === 0) {
                const cellData = {
                    row: i,
                    col: j,
                    possibleValues: getAvailableNumbers(board, i, j)
                }
                availableNumbers.push(cellData);
            }
        }
    }

    availableNumbers.sort( (a,b) => {
        if (a.possibleValues.length < b.possibleValues.length) {
            return -1;
        }
        if (a.possibleValues.length > b.possibleValues.length) {
            return 1;
        }
        return 0;
    })

    return availableNumbers;
}
function findEmptyCell(board) {
    let count = 0;
    const N = board.length;

    for (let row = 0; row < N; row++) {
        for (let col = 0; col < N; col++) {
            if (board[row][col] === 0) {
                count++;
            }
        }
    }
    for (let row = 0; row < N; row++) {
        for (let col = 0; col < N; col++) {
            if (board[row][col] === 0) {
                return { row, col , count};
            }
        }
    }
    return null;
}

function getAvailableNumbers(board, row, col) {
    const N = board.length;
    const usedNumbers = new Set();

    // Check numbers used in the same row
    for (let c = 0; c < N; c++) {
        if (board[row][c] !== 0) {
            usedNumbers.add(board[row][c]);
        }
    }

    // Check numbers used in the same column
    for (let r = 0; r < N; r++) {
        if (board[r][col] !== 0) {
            usedNumbers.add(board[r][col]);
        }
    }

    // Check numbers used in the same box
    const boxSize = Math.sqrt(N);
    const startRow = Math.floor(row / boxSize) * boxSize;
    const startCol = Math.floor(col / boxSize) * boxSize;
    for (let r = startRow; r < startRow + boxSize; r++) {
        for (let c = startCol; c < startCol + boxSize; c++) {
            if (board[r][c] !== 0) {
                usedNumbers.add(board[r][c]);
            }
        }
    }

    // Calculate available numbers
    const availableNumbers = [];
    for (let num = 1; num <= N; num++) {
        if (!usedNumbers.has(num)) {
            availableNumbers.push(num);
        }
    }

    return availableNumbers;
}

function isSafe(board, row, col, num) {
    return (
        !isUsedInRow(board, row, num) &&
        !isUsedInColumn(board, col, num) &&
        !isUsedInBox(board, row - (row % 3), col - (col % 3), num)
    );
}

function isUsedInRow(board, row, num) {
    const N = board.length;
    for (let col = 0; col < N; col++) {
        if (board[row][col] === num) {
            return true;
        }
    }
    return false;
}

function isUsedInColumn(board, col, num) {
    const N = board.length;
    for (let row = 0; row < N; row++) {
        if (board[row][col] === num) {
            return true;
        }
    }
    return false;
}

function isUsedInBox(board, startRow, startCol, num) {
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (board[row + startRow][col + startCol] === num) {
                return true;
            }
        }
    }
    return false;
}

function countPossibilities(board, row, col, num) {
    let count = 0;
    if (isSafe(board, row, col, num)) {
        board[row][col] = num;
        const N = board.length;
        for (let r = 0; r < N; r++) {
            for (let c = 0; c < N; c++) {
                if (board[r][c] === 0 && isSafe(board, r, c, num)) {
                    count++;
                }
            }
        }
        board[row][col] = 0;
    }
    return count;
}

function printBoard(board) {
    const N = board.length;
    for (let row = 0; row < N; row++) {
        console.log(board[row].join(' '));
    }
}

function start(sudokuBoard) {

    if (solveSudoku(sudokuBoard)) {
        printBoard(sudokuBoard);
        return {
            status: 'success',
            message: 'Sudoku Solved !',
            data: sudokuBoard,
        }
    } else {
        console.log('No solution exists.');
        return {
            status: 'failed',
            message: 'No solution exists.',
        }
    }
}

module.exports = {start}