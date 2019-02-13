const boxList = document.querySelectorAll(".box");
const emphasisNum = document.getElementById("timeElapsed");
const playBtnContainer = document.querySelector(".startGame");
const playBtn = document.querySelector(".startGame svg path");
const playBtnLg = document.getElementById("playBtnLg");
const resetBtnContainer = document.querySelector(".restartGame");
const resetBtn = document.querySelector(".restartGame svg");
const movesEl = document.getElementById("moves");
const modal = document.getElementById("modal");
const overlay = document.getElementById("overlay");
const playAgainBtn = document.getElementById("playAgainBtn");
const leaderboardBtn = document.getElementById("leaderboardBtn");
const theBoard = document.getElementsByClassName("the-board")[0];
let boardSide = "game";
let timeElapsed = 0;
let moves = 0;
let currentRound = false;
let stringToMatch = null;
let prevBox = null;
let matches = 0;
let matchesToWin = boxList.length / 2;
let timer;
const imgArray = [
  "img/CSS3-img-final.png",
  "img/javascript-img-final.png",
  "img/react-img-final.png",
  "img/nodejs-img-final.png",
  "img/redux-img-final.png",
  "img/vue-img-final.png",
  "img/gatsby-img-final.png",
  "img/java-img-final.png",
  "img/CSS3-img-final.png",
  "img/javascript-img-final.png",
  "img/react-img-final.png",
  "img/nodejs-img-final.png",
  "img/redux-img-final.png",
  "img/vue-img-final.png",
  "img/gatsby-img-final.png",
  "img/java-img-final.png"
];

// Event Listeners

window.addEventListener("DOMContentLoaded", () => {
  shuffleDeck();
});

playBtn.addEventListener("click", startGame);

playBtnLg.addEventListener("click", startGame);

playAgainBtn.addEventListener("click", e => {
  resetGame(timer);
  closeModal();
  setTimeout(() => {
    startGame();
  }, 500);
});

overlay.addEventListener("click", closeModal);

leaderboardBtn.addEventListener("click", () => {
  if (boardSide === "game") {
    showLeaderboard();
  } else {
    theBoard.style.transform = "rotateY(0deg)";
    leaderboardBtn.textContent = "Leaderboard";
    boardSide = "game";
  }
});

// Functions

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function shuffleDeck() {
  shuffleArray(imgArray);
  boxList.forEach((box, index) => {
    box.nextElementSibling.setAttribute("src", imgArray[index]);
  });
}

function startGame() {
  timer = setInterval(startTimer, 1000);
  playBtnContainer.style.display = "none";
  resetBtnContainer.style.display = "block";

  resetBtn.addEventListener("click", () => {
    resetGame(timer);
  });
  addGameLogic();
  boxAnimateIn();
  if (boardSide === "leaderboard") {
    boardSide = "game";
    setTimeout(() => {
      theBoard.style.transform = "rotateY(0deg)";
      leaderboardBtn.textContent = "leaderboard";
    }, 300);
  }
}

function resetGame(timer) {
  clearInterval(timer);
  removeGameLogic();
}

function startTimer() {
  timeElapsed++;
  emphasisNum.textContent = `${timeElapsed}`;
  if (timeElapsed < 60) {
    emphasisNum.style.color = "green";
  } else {
    emphasisNum.style.color = "red";
  }
}

function addGameLogic() {
  boxList.forEach((box, i) => {
    box.addEventListener("click", onBoxClick);
  });
}

function removeGameLogic() {
  boxList.forEach((box, i) => {
    box.removeEventListener("click", onBoxClick);
    box.nextElementSibling.classList.remove("revealed");
  });
  timeElapsed = 0;
  moves = 0;
  movesEl.innerHTML = moves;
  matches = 0;
  currentRound = false;
  stringToMatch = null;
  prevBox = null;
  emphasisNum.style.color = "white";
  emphasisNum.textContent = timeElapsed;
  playBtnContainer.style.display = "block";
  resetBtnContainer.style.display = "none";
  setTimeout(shuffleDeck, 500);
  boxAnimateOut();
}

function onBoxClick(e) {
  let currentBox;
  moves++;
  movesEl.innerHTML = moves;
  if (e.target.nextElementSibling.classList.contains("revealed")) {
    return;
  } else {
    if (currentRound) {
      currentBox = e.target;
      currentBox.nextElementSibling.classList.add("revealed");
      if (currentBox.nextElementSibling.getAttribute("src") === stringToMatch) {
        matches++;
        if (matches < matchesToWin) {
          prevBox.classList.add("correct");
          currentBox.classList.add("correct");
          boxList.forEach((box, i) => {
            box.removeEventListener("click", onBoxClick);
          });
          setTimeout(() => {
            prevBox.classList.remove("correct");
            currentBox.classList.remove("correct");
            boxList.forEach((box, i) => {
              box.addEventListener("click", onBoxClick);
            });
          }, 500);
        } else {
          onGameOver(timeElapsed, moves);
          console.log("Game Over");
        }
        currentRound = false;
      } else {
        currentBox.classList.add("incorrect");
        prevBox.classList.add("incorrect");
        boxList.forEach((box, i) => {
          box.removeEventListener("click", onBoxClick);
        });
        setTimeout(() => {
          currentBox.classList.remove("incorrect");
          prevBox.classList.remove("incorrect");
          currentBox.nextElementSibling.classList.remove("revealed");
          prevBox.nextElementSibling.classList.remove("revealed");
          boxList.forEach((box, i) => {
            box.addEventListener("click", onBoxClick);
          });
        }, 500);
        currentRound = false;
      }
    } else {
      currentBox = e.target;
      stringToMatch = currentBox.nextElementSibling.getAttribute("src");
      prevBox = currentBox;
      currentBox.nextElementSibling.classList.add("revealed");
      currentRound = true;
    }
  }
}

function onGameOver(finalTime, finalMoves) {
  clearInterval(timer);
  boxList.forEach(box => {
    box.removeEventListener("click", onBoxClick);
  });
  addFinalScoreData(finalTime, finalMoves);
  openModal();
}

function addFinalScoreData(finalTime, finalMoves) {
  const tBody = document.getElementById("gameOverTableBody");
  const newRow = document.createElement("tr");
  const tdTime = document.createElement("td");
  const tdMoves = document.createElement("td");
  newRow.setAttribute("id", "finalScore");
  tdTime.innerHTML = finalTime;
  tdMoves.innerHTML = finalMoves;
  newRow.appendChild(tdTime);
  newRow.appendChild(tdMoves);
  tBody.appendChild(newRow);

  const time = localStorage.getItem("time");
  const moves = localStorage.getItem("moves");

  if (!time || time > finalTime) {
    tdTime.style.color = "green";
    document.getElementsByClassName("highScore-tag")[0].style.display = "block";
    localStorage.setItem("time", finalTime);
  }
  if (!moves || moves > finalMoves) {
    tdMoves.style.color = "green";
    document.getElementsByClassName("highScore-tag")[0].style.display = "block";
    localStorage.setItem("moves", finalMoves);
  }
}

function showLeaderboard() {
  theBoard.style.transform = "rotateY(180deg)";
  leaderboardBtn.textContent = "Game";
  boardSide = "leaderboard";

  const topTime = localStorage.getItem("time");
  const topMoves = localStorage.getItem("moves");
  const leaderRow = document.getElementsByClassName("table-data")[0];
  const timeEl = document.createElement("td");
  const movesEl = document.createElement("td");
  timeEl.classList.add("leaderboardTime");
  movesEl.classList.add("leaderboardMoves");
  if (leaderRow.childNodes.length !== 2) {
    timeEl.textContent = topTime;
    movesEl.textContent = topMoves;
    leaderRow.appendChild(timeEl);
    leaderRow.appendChild(movesEl);
  } else {
    document.getElementsByClassName("leaderboardTime")[0].textContent = topTime;
    document.getElementsByClassName(
      "leaderboardMoves"
    )[0].textContent = topMoves;
  }
}

function openModal() {
  overlay.style.display = "block";
  modal.style.display = "flex";
}

function closeModal() {
  const tBody = document.getElementById("gameOverTableBody");
  overlay.style.display = "none";
  modal.style.display = "none";
  tBody.removeChild(document.getElementById("finalScore"));
  document.getElementsByClassName("highScore-tag")[0].style.display = "none";
}

function boxAnimateIn() {
  document.querySelector(".intro-container").style.transform =
    "translateX(-500px)";
  document.querySelector(".intro-container").style.opacity = "0";
  boxList.forEach(box => {
    box.style.display = "block";
    box.classList.add("hidden");
  });

  if (window.innerWidth < 556) {
    document.getElementsByClassName("game-board")[0].style.height = "1300px";
  }

  setTimeout(() => {
    boxList.forEach(box => {
      box.classList.remove("hidden");
    });
  }, 500);
}

function boxAnimateOut() {
  boxList.forEach(box => {
    box.classList.add("hidden");
  });

  if (window.innerWidth < 556) {
    document.getElementsByClassName("game-board")[0].style.height = "500px";
  }
  setTimeout(() => {
    boxList.forEach(box => {
      box.style.display = "none";
    });
    document.querySelector(".intro-container").style.transform =
      "translateX(0)";
    document.querySelector(".intro-container").style.opacity = "1";
  }, 500);
}

// (function() {
//   localStorage.clear();
// })();
