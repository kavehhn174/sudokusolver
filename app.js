// Example Sudoku board
const sudokuBoard = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
];

const sudokuBoard1 = [
    [5, 1, 6, 8, 4, 9, 7, 3, 2],
    [3, 0, 7, 6, 0, 5, 0, 0, 0],
    [8, 0, 9, 7, 0, 0, 0, 6, 5],
    [1, 3, 5, 0, 6, 0, 9, 0, 7],
    [4, 7, 2, 5, 9, 1, 0, 0, 6],
    [9, 6, 8, 3, 7, 0, 0, 5, 0],
    [2, 5, 3, 1, 8, 6, 0, 7, 4],
    [6, 8, 4, 2, 0, 7, 5, 0, 0],
    [7, 9, 1, 0, 5, 0, 6, 0, 8],
];

const SudokuJson = {
    "data": [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ]
}

const solver = require('./solver');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(cookieParser());
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));
const port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log('Server Started On Port ' + port);
});


app.get('/', function (req,res) {
    const boardSize = 9
    res.render('index', { boardSize })
})

app.post('/', function (req , res) {
    const sudokuBoard = req.body.sudokuBoard;
    const mode = req.body.mode;
    const solverData = solver.start(sudokuBoard, mode);
    if (solverData.status === "failed") {
        res.status(500).json(solverData);
    }
    if (solverData.status === "success") {
        res.status(200).json(solverData);
    }
})

// solver.start(sudokuBoard1);

