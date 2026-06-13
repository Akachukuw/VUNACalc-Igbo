// ===============================
// 🧠 SMART RESULT MEMORY FEATURE
// ===============================

let LAST_RESULT = 0;
var currentExpression = "";

// ------------------------------
// Theme Toggle Logic
// ------------------------------
function toggleTheme() {
  const body = document.body;
  const btn = document.getElementById("theme-toggle");

  body.classList.toggle("dark-mode");

  if (body.classList.contains("dark-mode")) {
    btn.innerHTML = "☀️";
    btn.title = "Switch to light mode";
    localStorage.setItem("theme", "dark");
  } else {
    btn.innerHTML = "🌙";
    btn.title = "Switch to dark mode";
    localStorage.setItem("theme", "light");
  }
}

// Set theme on page load from localStorage
window.addEventListener("DOMContentLoaded", function () {
  const theme = localStorage.getItem("theme");
  const body = document.body;
  const btn = document.getElementById("theme-toggle");

  if (btn) {
    if (theme === "dark") {
      body.classList.add("dark-mode");
      btn.innerHTML = "☀️";
      btn.title = "Switch to light mode";
    } else {
      btn.innerHTML = "🌙";
      btn.title = "Switch to dark mode";
    }
  }
});

// ------------------------------
// Calculator State
// ------------------------------
let left = "";
let operator = "";
let right = "";
let steps = [];
const MAX_STEPS = 6;

// ------------------------------
// Basic Calculator Functions
// ------------------------------
function appendToResult(value) {
  currentExpression += value.toString();
  updateResult();
}

function bracketToResult(value) {
  currentExpression += value;
  updateResult();
}

function backspace() {
  currentExpression = currentExpression.slice(0, -1);
  updateResult();
}

function operatorToResult(value) {
  if (value === "^") {
    currentExpression += "**";
  } else {
    currentExpression += value;
  }
  updateResult();
}

function clearResult() {
  currentExpression = "";
  updateResult();
}


function normalizeExpression(expr) {
  return expr
    .replace(/asin\(/g, "asinDeg(")
    .replace(/acos\(/g, "acosDeg(")
    .replace(/atan\(/g, "atanDeg(")
    .replace(/sin\(/g, "sinDeg(")
    .replace(/cos\(/g, "cosDeg(")
    .replace(/tan\(/g, "tanDeg(")
    .replace(/asinh\(/g, "asinh(")
    .replace(/sinh\(/g, "sinh(")
    .replace(/\be\b/g, "Math.E")
    .replace(/\bpi\b/g, "Math.PI");
}

function percentToResult() {
  if (!currentExpression) return;

  const match = currentExpression.match(/(.+?)(\*\*|[+\-*/^])([0-9.]*)$/);

  if (!match) {
    const num = parseFloat(currentExpression);
    if (isNaN(num)) return;

    currentExpression = (num / 100).toString();
  } else {
    const leftPart = match[1];
    const rightPart = match[3];

    if (!rightPart) return;

    let leftVal;

    try {
      leftVal = eval(leftPart);
    } catch (e) {
      leftVal = parseFloat(leftPart);
    }

    const rightVal = parseFloat(rightPart);
    if (isNaN(leftVal) || isNaN(rightVal)) return;

    const percentVal = (leftVal * rightVal) / 100;

    currentExpression = percentVal.toString();
  }

  // 🔥 ADD THIS LINE
  currentExpression += "*";

  updateResult();
}

// ------------------------------
// Calculate Result
// ------------------------------
function calculateExpression(expression) {
  try {
   
    let normalizedExpression = normalizeExpression(expression);

    // 🧠 Replace "ans" with last result automatically
    normalizedExpression = normalizedExpression.replace(
      /\bans\b/gi,
      LAST_RESULT,
    );

    // Calculate result
    let result = eval(normalizedExpression);
    console.log("Calculated result for expression:", expression, "->", result);
 
    if (isNaN(result) || !isFinite(result)) {
      throw new Error();
    }

    return result;
  } catch (e) {
    return "Error";
  }
}
function calculateResult() {
  if (!currentExpression) return;
    const display = document.getElementById("result"); 
    // Calculate result
    let result = calculateExpression(currentExpression);
    result = String(result);

    // Save result for future expressions
    LAST_RESULT = result;

    // Display normally
    display.value = result;

    currentExpression = result;
    updateResult();
}


function updateResult() {
  document.getElementById("result").value = currentExpression || "0";
}
const igboUnits = [
  "efu",
  "otu",
  "abuo",
  "ato",
  "ano",
  "ise",
  "isii",
  "asaa",
  "asato",
  "itoolu"
];

const igboTens = {
  10: "iri",
  20: "iri abuo",
  30: "iri ato",
  40: "iri ano",
  50: "iri ise",
  60: "iri isii",
  70: "iri asaa",
  80: "iri asato",
  90: "iri itoolu"
};
function convertBelow1000(num) {

  if (num === 0) return "";

  let words = [];

  if (num >= 100) {
    let hundreds = Math.floor(num / 100);
    words.push(igboUnits[hundreds] + " nari");

    num %= 100;
  }

  if (num >= 20) {
    let tens = Math.floor(num / 10) * 10;

    words.push(igboTens[tens]);

    num %= 10;
  }

  else if (num >= 10) {

    const teenWords = {
      10: "iri",
      11: "iri na otu",
      12: "iri na abuo",
      13: "iri na ato",
      14: "iri na ano",
      15: "iri na ise",
      16: "iri na isii",
      17: "iri na asaa",
      18: "iri na asato",
      19: "iri na itoolu"
    };

    words.push(teenWords[num]);
    num = 0;
  }

  if (num > 0) {
    words.push(igboUnits[num]);
  }

  return words.join(" ");
}
function numberToIgbo(num) {

  if (num === 0) return "efu";

  let result = [];

  let millions = Math.floor(num / 1000000);

  if (millions > 0) {

    result.push(
      convertBelow1000(millions) +
      " nde"
    );

    num %= 1000000;
  }

  let thousands = Math.floor(num / 1000);

  if (thousands > 0) {

    result.push(
      convertBelow1000(thousands) +
      " puku"
    );

    num %= 1000;
  }

  if (num > 0) {
    result.push(
      convertBelow1000(num)
    );
  }

  return result.join(" ");
}
function translateToIgbo() {

  let value =
    parseInt(document.getElementById("result").value);

  if (isNaN(value)) {
    alert("Result is not a whole number.");
    return;
  }

  if (value < 0 || value > 999999999) {

    alert(
      "Supported range is 0 - 999,999,999"
    );

    return;
  }

  document.getElementById("igboOutput").value =
    numberToIgbo(value);
}
function speakIgboResult() {

  const text =
    document.getElementById("igboOutput").value;

  if (!text) {
    alert("Translate first.");
    return;
  }

  const speech =
    new SpeechSynthesisUtterance(text);

  speech.lang = "ig-NG";
  speech.rate = 0.8;

  window.speechSynthesis.speak(speech);
}
