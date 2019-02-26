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
    this.board = GameBoard.initBoard(this.options);
    // refactor this, clunky
    this.boardSize = this.options.boardSize;
    this.pieceOrder = pieceOrder[this.options.ordering];
    this.status = {};

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
        console.dir(this.board);
    }

    this.showOptions = function() {
        console.dir(this.options);
    }
 }

// Static method
 GameBoard.initBoard = function(options) {
     console.log(options);
    //return Array(options.boardSize + 1).fill(0).map(x => Array(options.boardSize+1).fill(0));
    let cell = [];

    for(let i = 0; i < options.boardSize + 1; i++) {
        let row = [];
        for(let j = 0; j < options.boardSize + 1; j++) {
            let cellValue = (i < 2 || j < 2 || i > options.boardSize || j > options.boardSize) ? -1 : 0;
            row.push(cellValue);
            }
        cell.push(row);
        }
    return cell;
 }


// Static variable and method
Piece.id = 1;
Piece.setId = function(){return Piece.id++}

// No need to track orientation for each piece, determined by owner
 function Piece({ type, isPromoted, inPLay, isCaptured, isBlack, file, rank }) {
    this.type = type || null;
    this.isPromoted = promoted || false;
    this.inPlay = inPlay || true;;
    this.isCaptured = false;
    this.isBlack = isBlack || null;
    this.file = file  || null;
    this.rank = rank || null;
    this.id = piece.setId();
 }



// Layouts are indexed with board notation, not array indexing
const standardLayout = {
    "black": {
        "K": [[9, 5]],
        "G": [[9, 6], [1, 4]],
        "S": [[9, 7], [1, 3]],
        "N": [[9, 8], [1, 2]],
        "L": [[9, 9], [1, 1]],
        "B": [[8, 8]],
        "R": [[8, 2]],
        "P": [[7,"9-1"]]
    }
};

// Array is indexed in opposite corner to board
// board.length is 1 greater than playable board 
function notationToIndex(boardFile, boardRank, actualSize) {
    return {x:  actualSize - boardFile, y: actualSize - boardRank}
}

// Separating piece list from layout, as will be easier to make a tool for creating problem sets without manually writing in values
// if all pieces go into capture pool by default, then can click to place them where required.
// If hasOwnProperty("black") is false, repeat piece list for black and white
const standardPieceList = {
    "K": 1,
    "R": 1,
    "B": 1,
    "G": 2,
    "S": 2,
    "N": 2,
    "L": 2,
    "P": 9
}

function setUpPieces(pieceList, layout, board) {
    // iterate over piece list
    // use values as for loop index
    // loop over layout
    // if more pieces in layout than piece list, set rank and file to null, isCaptured to true
    // if less pieces, then throw an error
    // if detect '-' in rank Xor file, then make multiples of this piece along the rank or file
    // Will have to check for collision detection, two pawn [nifu] restriction, one king only to prevent illegal positioning
    
    board.status.pieceList = checkPieceList(pieceList);
}

// Checks if pieceList object is correctly formatted - if none of a certain piece are required, must still be present but with value of 0
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
// Remember that the actual shogi board is numbered 1,1 at top-right, but the array representation starts at top left
// so forward movement for black are MINUS rank values 
// Need to invert the vector signs for white movement
// How to take into account flipping of board for black? Doesn't matter, only display changes
const moveSet = {
    "K": {
            vectors: []

    },
    "P": {
            vectors: [[0, -1]],
            ranging: false
    }
}

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