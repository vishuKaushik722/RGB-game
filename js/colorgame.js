/*------------------------------------
  The game object and its functions
  ------------------------------------
  + game.init - initilizes game parameters to default and removes old game elements
  + game.win - changes elements to show player they have guessed correctly
  + game.listeners - deals with listeners for buttons, etc.
     - game.listeners.initMain - initializes main game control functionality
     - game.listeners.initSquares - initializes squares control functionality
  + game.board - deals with game board generation
     - game.board.setSize - sets the size of the board element/squares to accommodate different difficulties
     - game.board.setSquareColors - sets the random colors of the squares
     - game.board.getRandomColor - generates a random RGB value
     - game.board.getCorrectColor - picks one color from random selected colors
     - game.board.generate - generates the board by running the other game.board functions
*/

let game = {
    // variables
    arrSquareColors: [],
    varCorrectColor: null,
    varTimeElapsed: null,
    varPersonalBest: null,
    
    // dom elements
    elSquares: [], // array is populated with game.listeners.initSquares()
    elMsg: document.querySelector("#message"),
    elBoard: document.querySelector("#gameboard"),
    elCorrectColor: document.getElementById("correctcolor"),
    elGameControl: document.getElementById("gamecontrol"),
    elEasyMode: document.getElementById("easymode"),
    elMediumMode: document.getElementById("mediummode"),
    elHardMode: document.getElementById('hardmode'),
    elTitlebar: document.getElementById('titlebar'),
    
    // functions
    init: function initGame(num) {
        game.elGameControl.textContent = "NEW COLORS";
        game.elMsg.textContent = "Good luck!";
        game.elBoard.innerHTML = "";   // remove all squares from the board
        game.arrSquareColors.length = 0; // set board colors to 0
        game.elTitlebar.style.backgroundColor = "steelblue";
        game.board.generate();
        game.timer.init();
    },
    
    win: function winGame() {
        game.listeners.stopListening();
        game.elTitlebar.style.backgroundColor = game.varCorrectColor;
        for (let i = 0; i < game.elSquares.length; i++) {
            game.elSquares[i].style.backgroundColor = game.varCorrectColor;
        }
        game.elGameControl.textContent = "PLAY AGAIN?";
    },
    
    // functions dealing with listeners
    listeners: {
        initMain: function initListeners () {
            game.elGameControl.addEventListener("click", function() {
                game.init(difficulty);
            });
            game.elEasyMode.addEventListener("click", function() {
                game.elEasyMode.classList.add('selected');
                game.elMediumMode.classList.remove('selected');
                game.elHardMode.classList.remove('selected');
                difficulty = 3;
                game.init(difficulty);
            });
            game.elMediumMode.addEventListener("click", function() {
                game.elEasyMode.classList.remove('selected');
                game.elMediumMode.classList.add('selected');
                game.elHardMode.classList.remove('selected');
                difficulty = 6;
                game.init(difficulty);
            });
            game.elHardMode.addEventListener("click", function() {
                game.elEasyMode.classList.remove('selected');
                game.elMediumMode.classList.remove('selected');
                game.elHardMode.classList.add('selected');
                difficulty = 9;
                game.init(difficulty);
            })
        },
        
        initSquares: function initSquares() {
            // assign the random colors to the board squares
            game.elSquares = document.querySelectorAll(".square");
            for (let i = 0; i < game.elSquares.length; i++) {
                game.elSquares[i].style.background = game.arrSquareColors[i];
                // add event handler to this square
                game.elSquares[i].addEventListener("click", game.board.checkForWin);
            }
        },

        stopListening: function removeListeners() {
            // remove all the listeners from the squares
            game.elSquares = document.querySelectorAll(".square");
            for (let i = 0; i < game.elSquares.length; i++) {
                game.elSquares[i].removeEventListener("click", game.board.checkForWin);
            }
        }
    },    

    // functions dealing with board generation
    board: {
        setSize: function setBoardSize () {
            // set game board size based on difficulty
            if (difficulty < 4) {
                game.elBoard.style.maxWidth = "900px";
            } else if (difficulty < 7) {
                game.elBoard.style.maxWidth = "460px";
            } else {
                game.elBoard.style.maxWidth = "310px";
            };
        },
        
        setSquareColors: function setSquareColors () {
            // generate new squares and randomize a color for each square
            for (let i = 0; i < difficulty; i++) {
                game.elBoard.innerHTML = game.elBoard.innerHTML+'<div class="square"></div>';
                game.arrSquareColors.push(game.board.getRandomColor());
            }
        },
        
        getRandomColor: function getRandomColor() {
            let r = Math.floor(Math.random() * 256);
            let g = Math.floor(Math.random() * 256);
            let b = Math.floor(Math.random() * 256);
            return 'rgb('+r+', '+g+', '+b+')';
        },
        
        getCorrectColor: function pickColor() {
            // pick from the available colors the color we are trying to guess
            let randSquare = Math.floor(Math.random() * difficulty);
            game.varCorrectColor = game.arrSquareColors[randSquare];
            game.elCorrectColor.textContent = game.varCorrectColor;
        },
        
        generate: function generateBoard() {
            game.board.setSize();
            game.board.setSquareColors();
            game.board.getCorrectColor();
            game.listeners.initSquares();
        },

        checkForWin: function checkForWin() {
            if (this.style.backgroundColor === game.varCorrectColor) {
                game.varTimeElapsed = game.timer.check() / 1000;
                if (game.varPersonalBest === null || game.varPersonalBest > game.varTimeElapsed) {
                    game.varPersonalBest = game.varTimeElapsed
                };
                game.elMsg.textContent = "Correct in " + game.varTimeElapsed + " seconds! ( Personal best: " + game.varPersonalBest + " )";
                game.win();
            } else {
                this.style.transform = "rotateY(180deg)";
                this.style.backgroundColor = "#232323";
                game.elMsg.textContent = "Try again!";
            }
        }
    },

    // timer functions
    timer: {
        init: function initGameTimer() {
            let timeStart = new Date();
            game.varTimeElapsed = timeStart.getTime();
        },

        check: function getTimerElapsed() {
            let timeFinish = new Date();
            game.varTimeElapsed = timeFinish.getTime() - game.varTimeElapsed;
        }
    },

    // timer functions
    timer: {
        init: function initGameTimer() {
            let timeStart = new Date();
            game.varTimeElapsed = timeStart.getTime();
        },

        check: function getTimerElapsed() {
            let timeFinish = new Date();
            return (timeFinish.getTime() - game.varTimeElapsed);
        }
    }
}

// default difficulty mode is medium
game.elMediumMode.classList.add('selected');
let difficulty = 6;

game.listeners.initMain();
game.init(difficulty);

