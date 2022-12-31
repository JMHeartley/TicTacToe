$(function () {
    resetGame();
    showSplashScreen();
    setUpEventListeners();
});

var message = document.getElementById("message");
var startMessage = "X Always Goes First!";
var defaultBackgroundColor = "#40E0D0";
var xBackgroundColor = "#15EE16";
var xFontColor = "#2E8B57";
var oBackgroundColor = "#F6546A";
var oFontColor = "#C92C2C";
var winSets = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [1, 4, 7],
    [2, 5, 8],
    [0, 3, 6],
    [0, 4, 8],
    [6, 4, 2]
];

var gameType;
var isXTurn;
var isGameOver;
var spaces;
var movesLeft;

function showSplashScreen() {
    $("#splash").fadeIn(1200);
    setTimeout(function () {
        $("#splash").fadeOut(300);
        $("#menu").fadeIn(1000);
    }, 2500);
}

function resetGame() {
    if (isGameOver) {
        var gameSpaces = document.getElementsByClassName("space");
        for (var i = 0; i < gameSpaces.length; i++) {
            gameSpaces[i].textContent = "";
            gameSpaces[i].style.backgroundColor = defaultBackgroundColor;
        }

        $("#reset").hide();

        $("#board").hide(300);
        $("#menu").fadeIn(1000);
    }
    message.innerHTML = startMessage;
    gameType = "";
    isXTurn = true;
    isGameOver = false;
    spaces = ["", "", "", "", "", "", "", "", ""];
    movesLeft = spaces.length;
}

function setUpEventListeners() {
    $("#menu p:not(:first-child)").click(function () {
        gameSelect(this);
    });
    $(".space.c1.r1").click(function () {
        move(0, this);
    });
    $(".space.c2.r1").click(function () {
        move(1, this);
    });
    $(".space.c3.r1").click(function () {
        move(2, this);
    });
    $(".space.c1.r2").click(function () {
        move(3, this);
    });
    $(".space.c2.r2").click(function () {
        move(4, this);
    });
    $(".space.c3.r2").click(function () {
        move(5, this);
    });
    $(".space.c1.r3").click(function () {
        move(6, this);
    });
    $(".space.c2.r3").click(function () {
        move(7, this);
    });
    $(".space.c3.r3").click(function () {
        move(8, this);
    });
    $(".space").click(function () {
        if (gameType == "PvC" && !isGameOver && !isXTurn && movesLeft > 1)
            computerMove();
    });
    $("#reset").click(function () {
        resetGame();
    });
}

function gameSelect(x) {
    switch (x.textContent) {
        case "Player vs Player":
            gameType = "PvP";
            break;
        case "Player vs CPU":
            gameType = "PvC";
            break;
        case "CPU vs CPU":
            gameType = "CvC";
            break;
    }

    $("#board").fadeIn(1000);
    $("#menu").hide(300);
    message.innerHTML = startMessage;
}

function checkForGameOver() {
    winSets.forEach((winSet) => {
        if (spaces[winSet[0]]
            && spaces[winSet[0]] == spaces[winSet[1]]
            && spaces[winSet[1]] == spaces[winSet[2]]) {
            message.innerHTML = (isXTurn ? "X" : "O") + " Wins!";
            isGameOver = true;
            $("#reset").show();
        }
        if (!isGameOver && movesLeft == 0) {
            message.innerHTML = "It's a Tie!";
            isGameOver = true;
            $("#reset").show();
        }
    });
}
    }
}

function move(spaceIndex, htmlElement) {
    if (!htmlElement.textContent && !isGameOver) {
        spaces[spaceIndex] = isXTurn ? "X" : "O";

        if (isXTurn) {
            $(htmlElement).css("color", xFontColor);
            $(htmlElement).css("background", xBackgroundColor);
        } else {
            $(htmlElement).css("color", oFontColor);
            $(htmlElement).css("background", oBackgroundColor);
        }

        htmlElement.textContent = isXTurn ? "X" : "O";
        movesLeft--;

        checkForGameOver();

        if (!isGameOver) {
            isXTurn = !isXTurn;
            message.innerHTML = (isXTurn ? "X" : "O") + "'s Turn!";
        }
    }
}

function computerMove() {
    var indexForBestMove;
    var gameSpaces = document.getElementsByClassName("space");

    indexForBestMove = findIndexForBestMove((isXTurn == "X" ? "X" : "O"));
    console.log("win move", indexForBestMove, movesLeft);

    if (indexForBestMove === undefined) {
        indexForBestMove = findIndexForBestMove((isXTurn !== "X" ? "X" : "O"));
        console.log("block move", indexForBestMove, movesLeft);
    }

    if (indexForBestMove === undefined) {
        let randomSpace;
        do {
            randomSpace = Math.floor(Math.random() * (spaces.length - 1));
        } while (spaces[randomSpace] !== "")
        indexForBestMove = randomSpace;
        console.log("random move", indexForBestMove, movesLeft);
    }

    $("#thinking").show();
    setTimeout(function () {
        $("#thinking").hide();
        move(indexForBestMove, gameSpaces[indexForBestMove]);
    }, Math.floor(Math.random() * 1000) + 200);
}



function findIndexForBestMove(playerMark) {
    //set index of best move to variable and return that
    //forEach's function boundary inhibits proper return statements
    var bestMove;
    winSets.forEach((winSet) => {
        if (spaces[winSet[0]] == playerMark
            && spaces[winSet[0]] == spaces[winSet[1]]
            && spaces[winSet[2]] == "") {
            bestMove = winSet[2];
        }
        else if (spaces[winSet[1]] == playerMark
            && spaces[winSet[1]] == spaces[winSet[2]]
            && spaces[winSet[0]] == "") {
            bestMove = winSet[0];
        }
        else if (spaces[winSet[2]] == playerMark
            && spaces[winSet[2]] == spaces[winSet[0]]
            && spaces[winSet[1]] == "") {
            bestMove = winSet[1];
        }
    });
    return bestMove;
}