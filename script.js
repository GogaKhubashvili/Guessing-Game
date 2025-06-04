const section = document.querySelector("section");
const winMessage = document.querySelector(".win-message");
const playAgain = document.querySelector(".play-again");
const startGameBtn = document.querySelector(".start-game");
const timer = document.querySelector(".timer-time");
const bestTime = document.querySelector(".best-time-time");

let intervalId;

const personalRecond = [];
const cardValue = [];
const cards = [];
const disabled = [];
const randomNumsArr = [];

/////////////////////////////////////////////////////////////////////
// SAVE IN LOCALSTORAGE

window.addEventListener("DOMContentLoaded", () => {
  bestTime.textContent = localStorage.getItem("bestTime") || `00:00`;
});

/////////////////////////////////////////////////////////////////////
// FLIP CARD

section.addEventListener("click", (e) => {
  // SELECT CARD
  const card = e.target.closest(".card");
  if (!card) return;
  const value = card.getAttribute("value");
  cardValue.push(value);

  // FLOP CARD
  card.classList.add("active");
  card.innerHTML = `
    <div class="front">
      <img src="pic-${value}.png" alt="pic-number-${value}" />
    </div>
  `;

  card.classList.add("disabled");
  cards.push(card);

  // CHECK SAME CARDS
  if (cardValue[0] === cardValue[1] && cardValue.length === 2) {
    cards.forEach((card) => {
      card.classList.add("disabled");
      disabled.push(card);
    });

    cardValue.length = [];
    cards.length = [];
  }

  // CHECK DIFFERNENT CARDS
  if (cardValue[0] !== cardValue[1] && cardValue.length === 2) {
    cards.forEach((card) => {
      setTimeout(() => {
        card.classList.remove("active");
        card.innerHTML = " Memory Game";
        card.classList.remove("disabled");
      }, 1000);
    });

    cardValue.length = [];
    cards.length = [];
  }

  // DISPLAY WIN MASSAGE
  if (disabled.length === 24) {
    winMessage.classList.add("win-message-active");

    // STOP TIMER
    clearInterval(intervalId);

    // DISPLAY BEST TIME
    const [minutes, seconds] = timer.textContent.split(":").map(Number);
    const totalSeconds = minutes * 60 + seconds;
    personalRecond.push(totalSeconds);

    const minimum = Math.min(...personalRecond);
    const min = Math.floor(minimum / 60);
    const sec = minimum % 60;
    bestTime.textContent = `${String(min).padStart(2, "0")}:${String(
      sec
    ).padStart(2, "0")}`;

    // SAVE RECORD IN LOCASTORAGE
    localStorage.setItem("bestTime", bestTime.textContent);
  }
});

///////////////////////////////////////////////////////////////////
// PLAY AGAIN

playAgain.addEventListener("click", () => {
  // REDER ALL CARDS
  disabled.forEach((card) => {
    card.classList.remove("active");
    card.innerHTML = " Memory Game";
    card.classList.remove("disabled");
  });

  // START AGAIN
  setTimeout(() => {
    section.innerHTML = "";
    startGame();
  }, 150);

  // RESET DATA
  winMessage.classList.remove("win-message-active");
  disabled.length = [];
  randomNumsArr.length = [];
  timer.textContent = `00:00`;

  // START TIMER AGAIN
  startTimer();
});

///////////////////////////////////////////////////////////////////////
// START GAME

startGameBtn.addEventListener("click", () => {
  // START GAME
  startGame();

  // SET TIMER
  startTimer();

  // RESET DATA
  startGameBtn.disabled = true;
  disabled.length = [];
  randomNumsArr.length = [];
});

/////////////////////////////////////////////////////////////////////////
// RENDER CARDS RANDOMALY

function startGame() {
  // SAVE NUMBERS TWICE
  for (let i = 1; i <= 12; i++) {
    randomNumsArr.push(i, i);
  }

  // COMPARE NUMBERS TO EACH OTHER
  for (let i = randomNumsArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [randomNumsArr[i], randomNumsArr[j]] = [randomNumsArr[j], randomNumsArr[i]];
  }

  // DISPLAY CARD
  for (let i = 0; i < randomNumsArr.length; i++) {
    const markup = `<div value="${randomNumsArr[i]}" class="card">Memory Card</div>`;
    section.insertAdjacentHTML("beforeend", markup);
  }
}

///////////////////////////////////////////////////////////////////////
// SET TIMER

function startTimer() {
  let [min, sec] = timer.textContent.split(":");

  intervalId = setInterval(() => {
    sec++;
    timer.textContent = `${String(min).padStart(2, "0")}:${String(sec).padStart(
      2,
      "0"
    )}`;

    if (sec > 59) {
      sec = 0;
      min++;
      timer.textContent = `${String(min).padStart(2, "0")}:${String(
        sec
      ).padStart(2, "0")}`;
    }
  }, 1000);
}
