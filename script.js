const cards = document.querySelectorAll(".memory-card");
let flips = document.querySelector(".menu-flips");
let modal = document.querySelector(".modal");
let restartBtn = document.querySelector(".menu-restart");
let timer = document.querySelector(".menu-timer");
let modalTimer = document.querySelector(".modal-timer");
let modalFlips = document.querySelector(".modal-flips");

let timerInterval;
let playerFlips = 0;
let flippedCard = false;
let lockBoard = false;
let matchCount = 0;
let firstCard, secondCard;

startTimer();

// Flip card by modified HTML
function flipCard() {
  // Prevent any card flipping before the cards are hidden or match
  if (lockBoard) return;
  // Prevent twice click on the same card
  if (this === firstCard) return;

  this.classList.add("flip");

  if (!flippedCard) {
    flippedCard = true;
    firstCard = this;
    return;
  }
  secondCard = this;
  lockBoard = true;
  // Add one flip/move to the counter after click on the firstCard and the secondCard
  playerFlips++;
  flips.textContent = playerFlips;
  checkForMatch();
}

// Start timer
function startTimer() {
  clearInterval(timerInterval);
  let second = 0,
    minute = 0;
  timerInterval = setInterval(function () {

    timer.classList.toggle("odd");
      timer.innerHTML =
        (minute < 10 ? "0" + minute : minute) +
        ":" +
        (second < 10 ? "0" + second : second);
      second++;
      if (second == 60) {
        minute++;
        second = 0;
    }
    // Return time at the end of the game in the modal
    if (matchCount === 8) {
      clearInterval(timerInterval);
      modalTimer.innerHTML = minute + ":" + second;
      modalFlips.innerHTML = playerFlips;
    }
  }, 1000);
}

// Is it a match ?
function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
  isMatch ? disableCards() : unflipCards();
}

// If it's a match, cards can't be return
function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  matchCount++;
  firstCard.classList.add('flashes');
  secondCard.classList.add('flashes');
  // Conditions to win
  if (matchCount === 8) {
    // Create confettis when modal is opening 
    confetti();
    // Open the modal and message for the winner
    showModal();
  } else {
    resetBoard();
  }
}

// Toggles win modal on
function showModal() {
  modal.classList.add("show-modal");
}

// If it isn't a match, cards are return and shake
function unflipCards() {
  setTimeout(() => {
    firstCard.classList.add("shake");
    secondCard.classList.add("shake");
  }, 400);

  setTimeout(() => {
    firstCard.classList.remove("shake", "flip");
    secondCard.classList.remove("shake", "flip");

    resetBoard();
  }, 1500);
}

// Reset firstCard and secondCard variables after each round
function resetBoard() {
  [flippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

// Randomize position of cards
(function shuffle() {
  cards.forEach((card) => {
    let ramdomPos = Math.floor(Math.random() * 12);
    card.style.order = ramdomPos;
  });
})();

// Reset game and all variables
function resetGame() {
  playerFlips = 0;
  flippedCard = false;
  lockBoard = false;
  matchCount = 0;
  firstCard.classList.remove("flip");
  secondCard.classList.remove("flip");
}

// Click on "Play again" on the modal will reset game
function playAgain() {
  modal.classList.add("play-again");
  resetGame();
}

// The same for "Restart" button
function restart() {
  restartBtn.classList.add("restart");
  resetGame();
}

// Click event on cards
cards.forEach((card) => card.addEventListener("click", flipCard));
