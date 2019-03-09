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

var playerCount = 0;
let playerList = {
    black: new Player(),
    white: new Player(),
};


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
    this.activePieces = [];
    this.capturedPieces = [];

 }


 function GameBoard(userSettings) {
    // Wrap this in a singleton constructor, so default options aren't bundled onto every instance?
    let defaultOptions = {
        boardSize: 9,
        ordering: "ohashi",
        borderSize: 2
    }

    // TODO - go through and make appropriate variables private after get working prototype

    this.options = userSettings || useDefaultOptions();
    this.board = GameBoard.initBoard(this.options);
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

    // !TODO - use css styling to differentiate black and white pieces
    this.showBoard = function() {
        this.logBoard();
    }
    
    this.logBoard = function() {
        let display = ""
        
        let board = this.board;
        let boardSize = this.boardSize;
        let borderSize = this.options.borderSize;

        display += "9\t8\t7\t6\t5\t4\t3\t2\t1\n";
        display += "-\t-\t-\t-\t-\t-\t-\t-\t-\n";
        for(let i=borderSize; i < boardSize + borderSize; i++) {
            for(let j=borderSize; j < boardSize + borderSize; j++) {
                let id = board[i][j]
                if(id === 0) {
                    display += " ";
                } else {
                    display += this.pieces.find(x => x.id === id).pieceType;
                }
                display += "\t";
            }
            display += ("|" + (i-1) + "\n");
        }

        console.log(display);
    }

    this.logColourBoard = function() {
        let board = this.board;
        let boardSize = this.boardSize;
        let borderSize = this.options.borderSize; let display = []
        
        const c = "%c";
        const n = '\n';
        const t = '\t';
        
        const base = "background: goldenrod; color: black; width: 10px; height: 10px;";
        const border = "border: solid black 1px;";
        const bBorder = "bottom-border: solid black 1px;";
        const rBorder = "right-border: solid black 1px;";
        
        const black = "color: black;";
        const white = "color: white;";

        let TABBED = true;

        let topSide = base + bBorder;
        let rightSide = base + rBorder;
        let cell = base + border;

        let styles = [];
        let lines = [];
        let pixels = [];
        
        let style = ""; 


        function px(pixel, currentStyle = style) {
           

            if(typeof pixel === 'string') {
                storePixel(pixel, currentStyle);
            } else if (Array.isArray(pixel)) {
                pixel.forEach(p => {
                    storePixel(p, currentStyle);
                });
            } else {
                console.error("Invalid Pixel");
                return "NOPE";
            }
        }

        function storePixel(pixel, currentStyle) {
            let end = "";
            if(TABBED) end = t;
            pixels.push(c + pixel + end);
            styles.push(currentStyle)
        }

        function ln() {
            lines = lines.concat(pixels);
            lines.push(n);
            pixels = [];
        }


        function conSoul() {
            let display = []
            let text =""
            lines.forEach(line => text+=line);
            display.push(text);
            display = display.concat(styles);
            console.log.apply(console, display);
        }


        px([9, 8, 7, 6, 5, 4, 3, 2, 1], topSide);
        ln();

        for(let i=borderSize; i < boardSize + borderSize; i++) {
            for(let j=borderSize; j < boardSize + borderSize; j++) {
                let id = board[i][j]
                if(id === 0) {
                    px(" ", cell);
                } else {
                    tile = this.pieces.find(x => x.id === id);
                    px(tile.pieceType, cell + (tile.isBlack ? black : white));  
                }
            }
            px("|" + (i-1), rightSide);
            ln();
        }

        conSoul();
    }

    this.logIDBoard = function() {
        let display = ""
        
        let board = this.board;
        for(let i=0; i < board.length; i++) {
            for(let j=0; j < board.length; j++) {
                if(board[i][j] > -1 && board[i][j] < 10) display += " ";
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



// !FIXME - UP TO HERE - need to check default parameters work, as well as malformed Pieces (ie; captured and file/rank given) 
// No need to track orientation for each piece, determined by owner
// Using ES6 deconstruction and assignment to emulate named parameters with defaults
 function Piece({ pieceType = null, isPromoted = false, isCaptured = false, isBlack = true, file = null, rank = null} = {} ) {
    this.pieceType = pieceType;
    this.isPromoted = isPromoted || false;
    this.isBlack = isBlack || true;
    this.file = file  || null;
    this.rank = rank || null;
    this.isCaptured = (isCaptured || file == null || rank == null) || false;
    this.id = Piece.setId();
 }

 // Static variable and method - wrong place to attach this? think the board should keep track of the ID's of its pieces.
Piece.id = 1;
Piece.setId = function(){return Piece.id++}





function setUpPieces(pieceList, layout, board) {
    // iterate over piece list
    // use values as for loop index
    // loop over layout
    // if more pieces in layout than piece list, set rank and file to null, isCaptured to true
    // if less pieces, then throw an error
    // if detect '-' in rank or file, then make multiples of this piece along the rank or file
    // Will have to check for collision detection, two pawn [nifu] restriction, one king only to prevent illegal positioning
    
    //board.status.pieceList = checkPieceList(pieceList);
    
    checkLayout(layout);

    for(player in layout.playerPatterns) {   
        for(pieceType of board.ordering) {
                for(piece of layout.playerPatterns[player][pieceType]) {
                    let newPiece = createPiece(pieceType, piece, player, board);
                    placePiece(newPiece, board);
                }
            }
        }
    }


// Checks if pieceList object is correctly formatted - if none of a certain piece are required, must still be present but with value of 0
// TODO - check for black/white properties
// boardSize * 2 is just arbitary limit to amount of pieces allowed, adjust this later
function checkPieceList(pieceList, pieceOrder){
    let errors = {};
    let players = [];

    if(!pieceList.hasOwnProperty("black")) {
        let tempErrMsg = 'Incorrectly formatted - Missing property: "Black"';
        errors.push(tempErrMsg);
        console.error(errors);
        return "ERROR CODE- TODO ";
    } else {
        players.push("black");
    }

    if(pieceList.hasOwnProperty("white")) {
        players.push("white");
    }

    // FIXME: Pretty sure should be using .zip(), filter() or similar
    // also, probably better 
    for(player of players) {
        let missingPiece = [];
        let invalidNumber = [];
        for(p of pieceOrder) {
            if(!pieceList[player].hasOwnProperty(p)) {
                missingPiece.push(p);
            } else if (pieceList[player][p] < 0 || pieceList[player][p] > (gameBoard.boardSize * 2)) {
                invalidNumber.push(p + ":" + pieceList[p])
            }
        }
        if(missingPiece.length > 0) errors[player].missingPiece = missingPiece;
        if(invalidNumber.length > 0) errors[player].invalidNumber = invalidNumber;
    
    }
    
    // ES5 syntax for checkng if object is empty
    if(Object.keys(errors).length == 0) {
        console.log("pieceList is valid");
        console.log(errors);
        return("ERRORCODE: TODO - is OK")
    } else {
        return("ERRORCODE: TODO - notValid");
    console.table(errors);
    }


}
        
// !TODO - error checking
// boards must be odd so midpoint can be calculated for mirroring
// square boards only for time being
function checkLayout(layout) {
    if(!layout.playerPatterns.hasOwnProperty("white")) {
        console.warn("Missing layout for White player, mirroring Black positions")
        layout.playerPatterns.white = mirrorLayout(layout.playerPatterns.black, layout.boardSize);
    }

    console.log("TODO - layout checking");
}

// !TODO - where am I going to attach this method?
// Important to decide as it affects how it is called from other methods, and what parameters are required.
// Also have to consider if I'm unintentionally creating a large number of closures...
function createPiece(pieceType, piece, player, board) {
    let isBlack = (player == 'black') ? true : false;

        let newPiece = new Piece({pieceType:pieceType, isBlack:isBlack, file:piece[0], rank:piece[1]});
        board.pieces.push(newPiece);
        if(newPiece.isCaptured) {
            playerList[player].capturedPieces.push(newPiece.id);
        } else {
            playerList[player].activePieces.push(newPiece.id);
        }

        return newPiece;
}

function placePiece(piece, board) {
    let {x, y} = notationToIndex(piece.file, piece.rank, board.boardSize)
    board.board[y][x] = piece.id;
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

// calculates piece displacement from midpoint then adds the offset back to the midpoint
// simplified logic, now don't need case statements
// can just add positive or negative offsets to get the correct new position, 0-offset has no effect  as desired. 
function mirrorLayout(layout, boardSize) {
    mirror = {};
    console.log(layout);
    let midpoint = (boardSize + 1) / 2;
    for(var pieces in layout) {
        mirror[pieces] = layout[pieces].map(piece => piece.map(coord => {
           let offset = midpoint - coord;
           return midpoint + offset
        }));
    }
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


// Layouts are indexed with shogi board notation, not array representation indexing
// TODO - need to be able to parse "9-1" so it will place multiple pieces in a row
// FIXME - need to rename boardLength or otherwise ensure no collision with gameBoard.boardLength
const standardLayout = {
    playerPatterns: {
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
        }
    },
    boardSize: 9
};

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
// Array is indexed in opposite corner to board
// board.length is 2 greater than playable board, given out-of-bounds border
// effectively, applying an offset to account for into account 0-indexing of array, 1-indexing of board, border, and mirroring of x,y
function notationToIndex(file, rank, playableSize, borderSize=2) {
    let offset = playableSize + borderSize;
    return {x:  offset - file, y: rank + (borderSize - 1)}
}

// Actual array index, not the effective array index
// ie; for a 9-cell board with a 2-cell border, [2][2] is the top left corner of play area
function indexToNotation(x, y, playableSize, borderSize=2) {
    let offset = playableSize + borderSize;
    return {file: offset - x, rank: y - (borderSize - 1)};
}

 let gameBoard = new GameBoard();
 setUpPieces(standardPieceList, standardLayout, gameBoard)
 gameBoard.showBoard();
 gameBoard.logColourBoard();