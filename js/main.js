const coins = [
  { name: "£2", value: 200, image: "£2.png" },
  { name: "£1", value: 100, image: "£1.png" },
  { name: "50p", value: 50, image: "50p.png" },
  { name: "20p", value: 20, image: "20p.png" },
  { name: "10p", value: 10, image: "10p.png" },
  { name: "5p", value: 5, image: "5p.png" },
  { name: "2p", value: 2, image: "2p.png" },
  { name: "1p", value: 1, image: "1p.png" },
];

// Encapsulate state
const gameState = {
  coinCount: 5,
  currentCoins: [],
};

// Helper to create and manage dialogs
function createDialog(content, onClose = () => {}) {
  const dialog = document.createElement("dialog");
  dialog.open = true;
  dialog.innerHTML = content;
  document.body.appendChild(dialog);

  const closeButton = dialog.querySelector("button[aria-label='Close']");
  if (closeButton) {
    closeButton.addEventListener("click", () => {
      dialog.close();
      dialog.remove();
      onClose();
    });
  }

  return dialog;
}

// Helper for input validation
function validateNumericInput(input, max = null) {
  let value = input.value.replace(/[^0-9]/g, "");
  const num = parseInt(value, 10);
  if (max && num > max) value = max.toString();
  input.value = value;
}

function getRandomCoins(count = gameState.coinCount) {
  const selected = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * coins.length);
    selected.push(coins[randomIndex]);
  }
  return selected;
}

function displayCoins(selectedCoins) {
  const display = document.getElementById("coins-display");
  if (!display) return;
  const chunkSize = 5;
  const chunks = [];
  for (let i = 0; i < selectedCoins.length; i += chunkSize) {
    chunks.push(selectedCoins.slice(i, i + chunkSize));
  }
  display.innerHTML = chunks
    .map(
      (chunk) =>
        `<div class="grid">${chunk
          .map(
            (coin) =>
              `<div><img src="img/${coin.image}" alt="${coin.name}" /> ${coin.name}</div>`
          )
          .join("")}</div>`
    )
    .join("");
}

function calculateTotal(selectedCoins) {
  return selectedCoins.reduce((sum, coin) => sum + coin.value, 0);
}

function formatAsPounds(pence) {
  const pounds = Math.floor(pence / 100);
  const remainingPence = pence % 100;
  return `£${pounds}.${remainingPence.toString().padStart(2, "0")}`;
}

function resetGame() {
  gameState.currentCoins = getRandomCoins();
  displayCoins(gameState.currentCoins);
  const poundsInput = document.getElementById("pounds-input");
  const penceInput = document.getElementById("pence-input");
  if (poundsInput) poundsInput.value = "";
  if (penceInput) penceInput.value = "";
}

function checkAnswer() {
  const poundsInput = document.getElementById("pounds-input");
  const penceInput = document.getElementById("pence-input");
  if (!poundsInput || !penceInput) return;

  const pounds = parseInt(poundsInput.value, 10) || 0;
  const pence = parseInt(penceInput.value, 10) || 0;
  const userTotal = pounds * 100 + pence;
  const correctTotal = calculateTotal(gameState.currentCoins);
  const isCorrect = userTotal === correctTotal;
  const totalFormatted = formatAsPounds(correctTotal);

  const content = `
    <article>
      <header>
        <button aria-label="Close" rel="prev"></button>
        <p><strong>${isCorrect ? "Correct 😻" : "Incorrect 😿"}</strong></p>
      </header>
      <p>Total is ${totalFormatted}</p>
      <footer>
        <button id="try-another-button">Try another</button>
      </footer>
    </article>
  `;

  const dialog = createDialog(content);
  const tryAnotherButton = dialog.querySelector("#try-another-button");
  if (tryAnotherButton) {
    tryAnotherButton.addEventListener("click", () => {
      resetGame();
      dialog.close();
      dialog.remove();
    });
  }
}

function showSettings() {
  const content = `
    <article>
      <header>
        <button aria-label="Close" rel="prev"></button>
        <p><strong>Settings</strong></p>
      </header>
      <label for="coin-count-select">
        Number of coins
        <select id="coin-count-select" name="coin-count">
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5" selected>5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </label>
      <footer>
        <button id="save-settings-button">Save</button>
      </footer>
    </article>
  `;

  const dialog = createDialog(content);
  const selectElement = dialog.querySelector("#coin-count-select");
  const saveButton = dialog.querySelector("#save-settings-button");
  if (selectElement) selectElement.value = gameState.coinCount.toString();
  if (saveButton) {
    saveButton.addEventListener("click", () => {
      const newCount = parseInt(selectElement.value, 10);
      gameState.coinCount = newCount;
      resetGame();
      dialog.close();
      dialog.remove();
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  resetGame();
  const checkButton = document.getElementById("check-button");
  const resetButton = document.getElementById("reset-button");
  const settingsButton = document.getElementById("settings-button");
  const poundsInput = document.getElementById("pounds-input");
  const penceInput = document.getElementById("pence-input");

  if (checkButton) checkButton.addEventListener("click", checkAnswer);
  if (resetButton) resetButton.addEventListener("click", resetGame);
  if (settingsButton) settingsButton.addEventListener("click", showSettings);

  if (poundsInput) {
    poundsInput.addEventListener("input", (e) =>
      validateNumericInput(e.target)
    );
  }
  if (penceInput) {
    penceInput.addEventListener("input", (e) =>
      validateNumericInput(e.target, 99)
    );
    penceInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        checkAnswer();
      }
    });
  }
});
