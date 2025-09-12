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

// Global variable for coin count
let coinCount = 5;

function getRandomCoins(count = coinCount) {
  const selected = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * coins.length);
    selected.push(coins[randomIndex]);
  }
  return selected;
}

function displayCoins(selectedCoins) {
  const display = document.getElementById("coins-display");
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
              `<div><img src="/assets/${coin.image}" alt="${coin.name}" /> ${coin.name}</div>`
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
  window.currentCoins = getRandomCoins();
  displayCoins(window.currentCoins);
  document.getElementById("pounds-input").value = "";
  document.getElementById("pence-input").value = "";
}

function checkAnswer() {
  // Close any existing dialog
  document.querySelector("dialog")?.close();

  const poundsInput = document.getElementById("pounds-input");
  const penceInput = document.getElementById("pence-input");
  const pounds = parseInt(poundsInput.value, 10) || 0;
  const pence = parseInt(penceInput.value, 10) || 0;
  const userTotal = pounds * 100 + pence;
  const correctTotal = calculateTotal(window.currentCoins);
  const isCorrect = userTotal === correctTotal;
  const totalFormatted = formatAsPounds(correctTotal);

  const dialog = document.createElement("dialog");
  dialog.open = true;
  dialog.innerHTML = `
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
  document.body.appendChild(dialog);

  // Add event to close dialog
  dialog.querySelector("button").addEventListener("click", () => {
    dialog.close();
    dialog.remove();
  });

  // Add event to 'try another'
  const tryAnotherButton = dialog.querySelector("#try-another-button");
  tryAnotherButton.addEventListener("click", () => {
    resetGame();
    dialog.close();
    dialog.remove();
  });
}

function showSettings() {
  // Close any existing dialog
  document.querySelector("dialog")?.close();

  const dialog = document.createElement("dialog");
  dialog.open = true;
  dialog.innerHTML = `
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
  document.body.appendChild(dialog);

  // Set the current coin count in the select
  const selectElement = dialog.querySelector("#coin-count-select");
  selectElement.value = coinCount.toString();

  // Add event to close dialog
  dialog.querySelector("button").addEventListener("click", () => {
    dialog.close();
    dialog.remove();
  });

  // Add event to save settings
  const saveButton = dialog.querySelector("#save-settings-button");
  saveButton.addEventListener("click", () => {
    const newCount = parseInt(selectElement.value, 10);
    coinCount = newCount;
    resetGame();
    dialog.close();
    dialog.remove();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  resetGame();
  document
    .getElementById("check-button")
    .addEventListener("click", checkAnswer);
  document.getElementById("reset-button").addEventListener("click", resetGame);
  document
    .getElementById("settings-button")
    .addEventListener("click", showSettings);

  // Validation to allow only integers
  document.getElementById("pounds-input").addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
  });
  document.getElementById("pence-input").addEventListener("input", (e) => {
    let value = e.target.value.replace(/[^0-9]/g, "");
    const num = parseInt(value, 10);
    if (num > 99) value = "99";
    e.target.value = value;
  });

  // Add Enter key support for check answer
  document.getElementById("pence-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      checkAnswer();
    }
  });
});
