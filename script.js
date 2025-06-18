document.getElementById("budgetForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const income = +document.getElementById("income").value;
  const expenses = +document.getElementById("expenses").value;
  const goalAmount = +document.getElementById("goalAmount").value;
  const goalMonths = +document.getElementById("goalMonths").value;
  const itemName = document.getElementById("itemName").value;
  const itemCost = +document.getElementById("itemCost").value;
  const itemType = document.getElementById("itemType").value;

  const surplus = income - expenses;
  const monthlySavingNeed = goalAmount / goalMonths;
  const freeMoney = surplus - monthlySavingNeed;

  const resultBox = document.getElementById("result");
  const savingsBar = document.getElementById("savingsBar");

  let msg = "";
  let emoji = "";

  if (surplus <= 0) {
    msg = "You're spending more than you earn 😓. Cut back to save anything!";
    emoji = "💀";
  } else if (freeMoney <= 0) {
    msg = `To hit your goal of $${goalAmount} in ${goalMonths} months, you need to save $${monthlySavingNeed.toFixed(2)} monthly. Your surplus is only $${surplus.toFixed(2)}.`;
    msg += "<br>You can’t afford " + itemName + " right now. 🥲";
    emoji = itemType === "want" ? "🫠" : "⚠️";
  } else if (itemCost > freeMoney) {
    const waitMonths = Math.ceil(itemCost / freeMoney);
    msg = `You’ll need to wait ${waitMonths} month(s) to afford ${itemName} *and* still meet your savings goal.`;
    emoji = "⌛";
  } else {
    msg = `You can afford ${itemName} AND still save $${monthlySavingNeed.toFixed(2)} this month. 💅`;
    emoji = itemType === "want" ? "♡" : "🙌";
    launchConfetti();
  }

  resultBox.innerHTML = `${emoji} ${msg}`;

  // Update progress bar (assume $0 saved to start)
  let progress = (monthlySavingNeed > 0) ? (Math.min(freeMoney, monthlySavingNeed) / monthlySavingNeed) * 100 : 0;
savingsBar.value = Math.min(progress, 100);


  // Save check
  saveCheck(itemName, itemCost, emoji);
});

function saveCheck(item, cost, icon) {
  const history = JSON.parse(localStorage.getItem("history")) || [];
  const entry = {
    date: new Date().toLocaleDateString(),
    item,
    cost,
    icon
  };
  history.unshift(entry);
  localStorage.setItem("history", JSON.stringify(history));
  showHistory();
}

function showHistory() {
  const history = JSON.parse(localStorage.getItem("history")) || [];
  const list = document.getElementById("history");
  list.innerHTML = "";
  history.slice(0, 5).forEach(h => {
    const li = document.createElement("li");
    li.textContent = `${h.date}: Tried to buy ${h.item} ($${h.cost}) ${h.icon}`;
    list.appendChild(li);
  });
}

// Dark mode toggle
document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Simple confetti
function launchConfetti() {
  const emojis = ["💖", "🌟", "🍀", "🪙", "💰"];
  const confetti = document.createElement("div");
  confetti.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
  confetti.style.position = "fixed";
  confetti.style.top = "10%";
  confetti.style.left = Math.random() * 100 + "%";
  confetti.style.fontSize = "2rem";
  confetti.style.animation = "fall 2s linear forwards";
  document.body.appendChild(confetti);

  setTimeout(() => document.body.removeChild(confetti), 2000);
}
