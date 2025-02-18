const character = document.getElementById("character");
const mountain = document.getElementById("mountain");
const scoreElement = document.getElementById("score");
const jumpButton = document.getElementById("jump-button");
const gameOverModal = document.getElementById("game-over-modal");
const finalScoreElement = document.getElementById("final-score");
const restartButton = document.getElementById("restart-button");
const startButton = document.getElementById("start-button");
const closeModalButton = document.getElementById("close-modal");

let score = 0;
let isJumping = false;
let gameInterval;
let mountainSpeed = 1; // Initial speed

// Make the character jump (for both keyboard and touch)
function jump() {
  if (isJumping) return; // Prevent double jump
  isJumping = true;
  let jumpHeight = 0;
  const maxJumpHeight = 30;
  const jumpSpeed = 2;

  const upInterval = setInterval(() => {
    if (jumpHeight >= maxJumpHeight) {
      clearInterval(upInterval);
      const downInterval = setInterval(() => {
        if (jumpHeight <= 0) {
          clearInterval(downInterval);
          isJumping = false;
        } else {
          jumpHeight -= jumpSpeed;
          character.style.bottom = 20 + jumpHeight + "%";
        }
      }, 20);
    } else {
      jumpHeight += jumpSpeed;
      character.style.bottom = 20 + jumpHeight + "%";
    }
  }, 20);
}

// Keyboard input (for desktop)
document.addEventListener("keydown", (event) => {
  if (event.code === "Space" && !isJumping) {
    jump();
  }
});

// Touch input (for mobile)
jumpButton.addEventListener("click", () => {
  if (!isJumping) {
    jump();
  }
});

// Move the mountain from right to left
function moveMountain() {
  let mountainPosition = -10;
  mountainSpeed = 1; // Reset speed

  gameInterval = setInterval(() => {
    mountainPosition += mountainSpeed;
    mountain.style.right = mountainPosition + "%";

    // Increase speed at score milestones
    if (score === 10) {
      mountainSpeed = 1.5;
    } else if (score === 20) {
      mountainSpeed = 2;
    }

    if (mountainPosition > 100) {
      mountainPosition = -10;
      score++;
      scoreElement.textContent = "Score: " + score;
    }

    // Check for collision
    const characterRect = character.getBoundingClientRect();
    const mountainRect = mountain.getBoundingClientRect();
    const horizontalOverlap = 15;
    const verticalOverlap = 15;

    if (
      characterRect.left + horizontalOverlap < mountainRect.right &&
      characterRect.right - horizontalOverlap > mountainRect.left &&
      characterRect.bottom - verticalOverlap > mountainRect.top
    ) {
      clearInterval(gameInterval);
      showGameOverModal();
    }
  }, 20);
}

// Show game over modal
function showGameOverModal() {
  gameMusic.pause(); // Stop the music
  gameMusic.currentTime = 0;
  finalScoreElement.textContent = "Your Score: " + score;
  gameOverModal.style.display = "flex";
}

// Restart the game
restartButton.addEventListener("click", () => {
  gameOverModal.style.display = "none";
  resetGame();
});

// Reset the game
function resetGame() {
  score = 0;
  scoreElement.textContent = "Score: 0";
  mountain.style.right = "-10%";
  character.style.bottom = "20%";
  clearInterval(gameInterval);
  startButton.style.display = "block";
}

// Start the game
startButton.addEventListener("click", () => {
  startButton.style.display = "none";
  moveMountain();
});

closeModalButton.addEventListener("click", () => {
  gameOverModal.style.display = "none";
});



const gameMusic = new Audio("mus1.mp3");
gameMusic.loop = true;

// Ensure audio can play after user interaction
startButton.addEventListener("click", () => {
  gameMusic.play().catch(error => console.log("Audio play failed:", error));
});
