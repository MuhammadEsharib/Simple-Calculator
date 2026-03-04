const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");
const themeToggle = document.getElementById("themeToggle");
const historyList = document.getElementById("historyList");
const clearHistory = document.getElementById("clearHistory");

let input = "";
let history = JSON.parse(localStorage.getItem("calcHistory")) || [];

// THEME TOGGLE
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark")
  (document.documentElement.classList.add("dark"),
    (themeToggle.textContent = "Light Mode"));

themeToggle.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
  const isDark = document.documentElement.classList.contains("dark");
  themeToggle.textContent = isDark ? "Light Mode" : "Dark Mode";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// HISTORY FUNCTIONS
function saveHistory() {
  localStorage.setItem("calcHistory", JSON.stringify(history));
}

function renderHistory() {
  historyList.innerHTML = "";
  history
    .slice()
    .reverse()
    .forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      li.classList.add("cursor-pointer", "hover:text-blue-500");
      li.addEventListener("click", () => {
        input = item.split("=")[0].trim();
        updateDisplay(input);
      });
      historyList.appendChild(li);
    });
}
renderHistory();

clearHistory.addEventListener("click", () => {
  history = [];
  saveHistory();
  renderHistory();
});

// BUTTON STYLING
buttons.forEach((btn) =>
  btn.classList.add(
    "bg-slate-200",
    "dark:bg-slate-600",
    "rounded-xl",
    "py-3",
    "text-lg",
    "font-medium",
    "hover:bg-blue-500",
    "hover:text-white",
    "transition",
    "duration-200",
  ),
);

// BUTTON LOGIC
buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const value = btn.dataset.value;
    const action = btn.dataset.action;
    if (action === "clear") return clearInput();
    if (action === "delete") return deleteInput();
    if (action === "calculate") return calculate();
    if (value) handleInput(value);
  });
});

function handleInput(value) {
  if ("+-*/".includes(value) && input === "") return;
  if ("+-*/".includes(value) && "+-*/".includes(input.slice(-1))) return;
  if (
    value === "." &&
    input
      .split(/[\+\-\*\/]/)
      .pop()
      .includes(".")
  )
    return;
  input += value;
  updateDisplay(input);
}

function clearInput() {
  input = "";
  updateDisplay("0");
}
function deleteInput() {
  input = input.slice(0, -1);
  updateDisplay(input || "0");
}

function calculate() {
  try {
    const result = Function(`"use strict"; return (${input})`)();
    const record = `${input} = ${result}`;
    history.push(record);
    saveHistory();
    renderHistory();
    input = result.toString();
    updateDisplay(input);
  } catch {
    input = "";
    updateDisplay("Error");
  }
}

function updateDisplay(val) {
  display.textContent = val;
}

// KEYBOARD SUPPORT
window.addEventListener("keydown", (e) => {
  if (e.key >= "0" && e.key <= "9") handleInput(e.key);
  else if ("+-*/".includes(e.key)) handleInput(e.key);
  else if (e.key === ".") handleInput(e.key);
  else if (e.key === "Enter") calculate();
  else if (e.key === "Backspace") deleteInput();
  else if (e.key === "Escape") clearInput();
});
