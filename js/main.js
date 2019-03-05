// main.js
/**
 * 2 player Shogi implemented in Javascript
 * 
 */

 // GLOBALS / CONSTANTS
// TODO - wrap these in an object and/or attach somewhere
const ERRCODE = {
    OK: 0,
    INCOMPLETEPIECELIST: 1,
    INCOMPLETELAYOUT: 2
}

let playerList = [];
let playerCount = 0;

const pieceOrder = { 
    "ohashi":    ['K', 'G', 'S', 'N', 'L', 'B', 'R', 'P'],
    "ito":        ['K', 'G', 'S', 'N', 'P', 'L', 'B', 'R']
}
    
// ENDGLOBALS

// TODO - need to be able to choose Black and White
//      - also, replace the global variables
 function Player(name) {
   
    this.isBlack = (playerCount ? false : true);
    playerCount++;
    this.name = name || "Player " + playerCount;
    this.timer = null;
    this.ownedPieces = [];
    this.capturedPieces = [];

 }


 function GameBoard(userSettings) {
    // Wrap this in a singleton constructor, so default options aren't bundled onto every instance?
    let defaultOptions = {
        boardSize: 9,
        ordering: "ohashi"
    }

    // TODO - go through and make appropriate variables private after get working prototype

    this.options = userSettings || useDefaultOptions();
    let board = GameBoard.initBoard(this.options);
    // refactor this, clunky
    this.boardSize = this.options.boardSize;
    this.ordering = pieceOrder[this.options.ordering];
    this.status = {};

    this.pieces = [];

    function useDefaultOptions() {
        let defaults = {};
        for(var attrib in defaultOptions) {
            if(defaultOptions.hasOwnProperty(attrib)) {
                defaults[attrib] = defaultOptions[attrib];
            }
        }
        return defaults;
    }

    this.showBoard = function() {
        let display = ""
        for(let i=0; i < board.length; i++) {
            for(let j=0; j < board.length; j++) {
                if(board[i][j] > -1) display += " ";
                display += board[i][j] + "\t";
            }
            display += "\n";
        }

        console.log(display);
    }

    this.showOptions = function() {
        console.dir(options);
    }
 }

// Static method
 GameBoard.initBoard = function(options) {
     console.log(options);
    //return Array(options.boardSize + 1).fill(0).map(x => Array(options.boardSize+1).fill(0));
    let newBoard = [];
    const borderSize = 2;
    for(let i = 0; i < options.boardSize + (borderSize * 2); i++) {
        let row = [];
        for(let j = 0; j < options.boardSize + (borderSize * 2); j++) {
            let cellValue = (i < borderSize || j < borderSize || i >= options.boardSize + borderSize || j >= options.boardSize + borderSize) ? -1 : 0;
            row.push(cellValue);
            }
        newBoard.push(row);
        }
    return newBoard;
 }




// No need to track orientation for each piece, determined by owner
 function Piece( type, isPromoted, isCaptured, isBlack, file, rank ) {
    this.type = type || null;
    this.isPromoted = isPromoted || false;
    this.isCaptured = isCaptured || false;
    this.isBlack = isBlack || true;
    this.file = file  || null;
    this.rank = rank || null;
    this.id = Piece.setId();
 }

 // Static variable and method - wrong place to attach this? think the board should keep track of the ID's of its pieces.
Piece.id = 0;
Piece.setId = function(){return Piece.id++}


// Layouts are indexed with shogi board notation, not array representation indexing
// TODO - need to be able to parse "9-1" so it will place multiple pieces in a row
// FIXME - need to rename boardLength or otherwise ensure no collision with gameBoard.boardLength
const standardLayout = {
    "black": {
        "K": [[5, 9]],
        "G": [[6, 9], [4, 9]],
        "S": [[7, 9], [3, 9]],
        "N": [[8, 9], [2, 9]],
        "L": [[9, 9], [1, 9]],
        "B": [[8, 8]],
        "R": [[2, 8]],
        "P": [[9, 7], [8, 7], [7, 7], [6, 7], [5, 7], [4, 7], [3, 7], [2, 7], [1, 7]]
        //"P": [["9-1", 7]]
    },
    boardLength: 9
};

// Array is indexed in opposite corner to board
// board.length is 2 greater than playable board, given out-of-bounds border
function notationToIndex(boardFile, boardRank, playableSize, borderSize) {
    let actualSize = playableSize + borderSize;
    return {x:  actualSize - boardFile, y: actualSize - boardRank}
}

// Actual array index, not the effective array index
// ie; for a board with a 2-cell border (0,0) re
function indexToNotation(x, y, playableSize, borderSize) {
    x = x - borderSize;
    y = y - borderSize;
    return {file: playableSize - x, rank: playableSize - y};
}

// Separating piece list from layout, as will be easier to make a tool for creating problem sets without manually writing in values
// if all pieces go into capture pool by default, then can click to place them where required.
// If hasOwnProperty("black") is false, repeat piece list for black and white
const standardPieceList = {
    "black": {
        "K": 1,
        "R": 1,
        "B": 1,
        "G": 2,
        "S": 2,
        "N": 2,
        "L": 2,
        "P": 9
    }
}

function setUpPieces(pieceList, layout, board) {
    // iterate over piece list
    // use values as for loop index
    // loop over layout
    // if more pieces in layout than piece list, set rank and file to null, isCaptured to true
    // if less pieces, then throw an error
    // if detect '-' in rank Xor file, then make multiples of this piece along the rank or file
    // Will have to check for collision detection, two pawn [nifu] restriction, one king only to prevent illegal positioning
    
    //board.status.pieceList = checkPieceList(pieceList);
    let startPos = [];
    startPos.push(layout.black);
    if(layout.hasOwnProperty("white")) {
        startPos.push(layout.white);
    } else {
        startPos.push(mirrorLayout(layout.black, layout.boardLength));
    }

    for(type of board.ordering) {
        for(piece of layout.black[type]) {
            var newPiece = new Piece(type=type, isBlack=true, file=piece[0], rank=piece[1]);
            board.pieces.push(newPiece);
            board.board[newPiece.file][newPiece.rank] = newPiece.id;
        }
    }

    

}

// Checks if pieceList object is correctly formatted - if none of a certain piece are required, must still be present but with value of 0
// TODO - check for black/white properties
// boardSize * 2 is just arbitary limit to amount of pieces allowed, adjust this later
function checkPieceList(pieceList, pieceOrder){
    let missingPiece;
    let invalidNumber;
    for(p of pieceOrder) {
        if(!pieceList.hasOwnProperty(p)) {
            missingPiece.push(p);
        } else if (pieceList[p] < 0 || pieceList[p] > (gameBoard.boardSize * 2)) {
            invalidNumber.push(p + ":" + pieceList[p])
        }
    }
    
    let errors;
    if(missingPiece) errors.missingPiece = missingPiece;
    if(invalidNumber) errors.invalidNumber = invalidNumber;
    return errors;
}
        

function checkLayout(layout) {
    console.log("TODO");
}


function createPieces() {

}

// Remember that the actual shogi board is numbered 1,1 at top-right, but the array representation starts at top left
// so forward movement for black are MINUS rank values 
// Need to invert the vector signs for white movement
// How to take into account flipping of board for black? Doesn't matter, only display changes
const vectorList = {
    "N": [0, -1],
    "NE": [1, -1],
    "E": [1, 0],
    "SE": [1, 1],
    "S": [0, 1],
    "SW": [-1, 1],
    "W": [-1, 0],
    "NW": [-1, -1]
}

const moveSet = {
    "K": {
            vectors: [vectorList.N ]

            // or vectors["N", "E", "W", etc] - and then generate the actual values?
            // vectorList.N .E.. whatever seems fairly painful to type and less convienient that just typing out the vectors
            // Probably best to encapsulate move related functions so could just declare them as vars?
            // Decide if using ES5/6 features... passing and destructuring the object is one option?
            // not sure whether to implement system where add vectors together: knight movement would be something like "[N+NW][N+NE]"
    },
    "P": {
            vectors: [[0, -1]],
            ranging: false
    }
}



 const pieceNames = new Bimap({
    "Pawn": 'P',
    "Lance": 'L',
    "Knight": 'N',
    "Silver General": 'S',
    "Gold General": 'G',
    "Bishop": 'B',
    "Rook" : 'R',
    "King" : 'K'
 });


function mirrorLayout(layout, boardLength) {
    mirror = {};
    console.log(layout);
    let midpoint = (boardLength + 1) / 2;
    for(var pieces in layout) {
        mirror[pieces] = layout[pieces].map(piece => piece.map(coord => {
            if(coord < midpoint) {
                return coord + (midpoint + coord);
            } else if (coord > midpoint) {
                return midpoint - (coord - midpoint);
            } else {
                return coord;
            }
        }));
    }
    console.dir(mirror);
    return mirror;
}

function Bimap(map) {
    this.map = map;
    this.reverseLookup = {}
    for(var key in map) {
        let value = map[key]; 
        this.reverseLookup[value] = key; 
    }
}

Bimap.prototype.get = function(key) { return this.map[key] };
Bimap.prototype.revGet = function(key) { return this.reverseLookup[key]};

 let gameBoard = new GameBoard();