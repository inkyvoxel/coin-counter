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

function getRandomCoins(count = 5) {
  const selected = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * coins.length);
    selected.push(coins[randomIndex]);
  }
  return selected;
}

function displayCoins(selectedCoins) {
  const display = document.getElementById("coins-display");
  display.innerHTML =
    "<ul>" +
    selectedCoins
      .map(
        (coin) =>
          `<li><img src="/assets/${coin.image}" alt="${coin.name}" /> ${coin.name}</li>`
      )
      .join("") +
    "</ul>";
}

function calculateTotal(selectedCoins) {
  return selectedCoins.reduce((sum, coin) => sum + coin.value, 0);
}

function formatAsPounds(pence) {
  const pounds = Math.floor(pence / 100);
  const remainingPence = pence % 100;
  return `£${pounds}.${remainingPence.toString().padStart(2, "0")}`;
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
        <p><strong>${isCorrect ? "Correct! 😻" : "Incorrect 😿"}</strong></p>
      </header>
      <p>Total is ${totalFormatted}</p>
    </article>
  `;
  document.body.appendChild(dialog);

  // Add event to close dialog
  dialog.querySelector("button").addEventListener("click", () => {
    dialog.close();
    dialog.remove();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  window.currentCoins = getRandomCoins();
  displayCoins(window.currentCoins);
  document
    .getElementById("check-button")
    .addEventListener("click", checkAnswer);

  // Clear input values on load
  document.getElementById("pounds-input").value = "";
  document.getElementById("pence-input").value = "";

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
});
