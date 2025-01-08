// Function to create the grid of cards
const gameBoard = document.getElementById("game-board");

document.addEventListener("DOMContentLoaded", () => {
  initializeGame();
});

function initializeGame() {
  setupGameBoard();
  setupResetButton();
}

function setupGameBoard() {
  const cards = createCards(16);
  addFrontFaceToCards(cards);
  addBackFacesToCards(cards);
  addFlipListeners(cards);
}

function setupResetButton() {
  const resetButton = document.getElementById("reset-button");
  resetButton.addEventListener("click", () => location.reload());
}

// Function to create the cards (grid items)
function createCards(numberOfCards) {
  const cards = []; // Array to hold all the cards
  for (let i = 0; i < numberOfCards; i++) {
    const card = document.createElement("div");
    card.classList.add("card"); // Add 'card' class to the div
    gameBoard.appendChild(card); // Add the card to the game board

    const cardInner = document.createElement("div");
    cardInner.classList.add("card-inner");
    card.appendChild(cardInner);

    cards.push(card);
  }
  return cards; // Return the array of cards
}

// Function to add the front face image to all cards
const frontImage = "images/front-face/redCross.jpg";

function addFrontFaceToCards(cards) {
  cards.forEach((card) => {
    const frontFace = document.createElement("div");
    frontFace.classList.add("card-face", "front"); // Add classes for the front face
    frontFace.style.backgroundImage = `url(${frontImage})`; // Set the front face image

    // Append the front face to the card-inner wrapper
    const cardInner = card.querySelector(".card-inner");
    cardInner.appendChild(frontFace);
  });
}

// Array of back images for the cards
const backImages = [
  "images/back-face/blueFlower.jpeg",
  "images/back-face/moon.png",
  "images/back-face/wallE.jpg",
  "images/back-face/darthVader.png",
  "images/back-face/redRose.jpg",
  "images/back-face/wallEandEve.jpg",
  "images/back-face/jesus.jpeg",
  "images/back-face/usaFlag.jpg",
]; // 8 images (duplicated later)

// Function to shuffle and duplicate the back images using the Fisher-Yates algorithm
function shuffleImages(images) {
  const shuffled = [...images, ...images]; // Duplicate the images array
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Random index
    [shuffled[j], shuffled[i]] = [shuffled[i], shuffled[j]]; // Swap positions
  }
  return shuffled; // Return the shuffled images
}

function addBackFacesToCards(cards) {
  const shuffledImages = shuffleImages(backImages); // Shuffle the back images
  cards.forEach((card, i) => {
    const backFace = document.createElement("div");
    backFace.classList.add("card-face", "back"); // Add classes for the back face
    backFace.style.backgroundImage = `url(${shuffledImages[i]})`; // Set the shuffled back image

    // Set a unique data-value for each card (used for matching)
    card.dataset.value = shuffledImages[i]; // Attach data-value to the card

    const cardInner = card.querySelector(".card-inner");
    cardInner.appendChild(backFace); // Add back face to the card-inner
  });
}

// Function to handle card flipping and reset after two flips
function addFlipListeners(cards) {
  console.log("Cards array:", cards);
  const flippedCards = []; // Array to track flipped cards

  // Helper function to flip a card
  function flipCard(cardInner) {
    cardInner.classList.add("flipped");
    flippedCards.push(cardInner); // Add the flipped card to the array
  }

  // Helper function to reset flipped cards
  function resetFlippedCards() {
    flippedCards.forEach((flippedCard) => {
      flippedCard.classList.remove("flipped"); // Reset each card
    });
    flippedCards.length = 0; // Clear the flipped cards array
  }

  // Function to handle card click event
  function handleCardClick(card) {
    const cardInner = card.querySelector(".card-inner");

    // If the card is already flipped or we already have 2 flipped cards, do nothing
    if (cardInner.classList.contains("flipped") || flippedCards.length >= 2)
      return;

    flipCard(cardInner); // Flip the card

    // If two cards are flipped, check for a match after a delay
    if (flippedCards.length === 2) {
      setTimeout(() => {
        cardsMatched(flippedCards); // Check if the cards match
        resetFlippedCards(); // Reset after checking
      }, 1000); // 1-second delay before checking
    }
  }

  // Add click event listeners to all cards
  cards.forEach((card) => {
    card.addEventListener("click", () => handleCardClick(card));
  });
}

// Function to handle card match
function cardsMatched(flippedCards) {
  // Check if two cards are flipped
  if (flippedCards.length === 2) {
    // Get the two flipped cards
    const [card1, card2] = flippedCards;
    // Debug: Log the values being compared
    console.log("Card 1 Value:", card1.parentElement.dataset.value);
    console.log("Card 2 Value:", card2.parentElement.dataset.value);

    // Compare their data (e.g., image, ID, or value)
    if (
      card1.parentElement.dataset.value === card2.parentElement.dataset.value
    ) {
      updateScore(); // Update the score if the cards match
      // If cards match, fade them out
      card1.classList.add("fade-out");
      card2.classList.add("fade-out");

      // After the fade-out transition ends, hide them (they disappear visually)
      setTimeout(() => {
        card1.classList.add("hidden");
        card2.classList.add("hidden");
      }, 1000); // 1 second to allow fade-out effect to complete
    } else {
      // If cards don't match, switch player and reset
      switchPlayer();
    }
  }
}

let player1Score = 0;
let player2Score = 0;
let currentPlayer = "player1";

const player1ScoreElement = document.getElementById("player1Score");
const player2ScoreElement = document.getElementById("player2Score");
const turnIndicator = document.getElementById("turnIndicator");

// Function to switch players
function switchPlayer() {
  if (currentPlayer == "player1") {
    currentPlayer = "player2";
    turnIndicator.textContent = "Player 2's Turn";
  } else {
    currentPlayer = "player1";
    turnIndicator.textContent = "Player 1's Turn";
  }
}

// Function to update the score
function updateScore() {
  if (currentPlayer === "player1") {
    player1Score++;
    player1ScoreElement.textContent = player1Score;
  } else {
    player2Score++;
    player2ScoreElement.textContent = player2Score;
  }
}
