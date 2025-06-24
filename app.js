//Calculator state variables
let currentNumber = "0";
let previousNumber = "";
let operator = "";
let waitingForNewNumber = false;

// Get display elements
const mainDisplay = document.getElementById("main-display");
const operationDisplay = document.getElementById("operation-display");

// Initialize calculator
function initCalculator() {
  updateMainDisplay();
  updateOperationDisplay();

  // Add event listeners to all buttons
  addEventListeners();
}

// Update main display
function updateMainDisplay() {
  mainDisplay.value = currentNumber;
}

// Update operation display
function updateOperationDisplay() {
  if (previousNumber && operator) {
    operationDisplay.textContent = `${previousNumber} ${operator}`;
  } else {
    operationDisplay.textContent = "";
  }
}

// Add event listeners to buttons
function addEventListeners() {
  // Number buttons
  const numberButtons = document.querySelectorAll(".button-number");
  numberButtons.forEach((button) => {
    button.addEventListener("click", () => handleNumber(button.dataset.number));
  })

  // Operator buttons
  const operatorButtons = document.querySelectorAll(".button-operator");
  operatorButtons.forEach((button) => {
    button.addEventListener("click", () => handleOperator(button.dataset.operator));
  })

  // Equals button
  const equalsButton = document.getElementById("equals");
  if (equalsButton) {
    equalsButton.addEventListener("click", handleEquals);
  }

  // Decimal button
  const decimalButton = document.getElementById("decimal");
  if (decimalButton) {
    decimalButton.addEventListener("click", handleDecimal);
  }

  // Clear button
  const clearButton = document.getElementById("clear");
  if (clearButton) {
    clearButton.addEventListener("click", handleClear);
  }

  // Clear Entry button
  const clearEntryButton = document.getElementById("clear-entry");
  if (clearEntryButton) {
    clearEntryButton.addEventListener("click", handleClearEntry);
  }

  // Backspace button
  const backspaceButton = document.getElementById("backspace");
  if (backspaceButton) {
    backspaceButton.addEventListener("click", handleBackspace);
  }

  // Keyboard support
  document.addEventListener("keydown", handleKeyboard);
}

// Handle number input
function handleNumber(num) {
  if (waitingForNewNumber) {
    currentNumber = num;
    waitingForNewNumber = false;
  } else {
    currentNumber = currentNumber === "0" ? num : currentNumber + num;
  }
  updateMainDisplay();
}

// Handle operator input
function handleOperator(op) {
  if (previousNumber && operator && !waitingForNewNumber) {
    calculate();
  }

  previousNumber = currentNumber;
  operator = op;
  waitingForNewNumber = true;
  updateOperationDisplay();
}

// Handle equals button
function handleEquals() {
  if (previousNumber && operator) {
    calculate();
    operator = "";
    previousNumber = "";
    waitingForNewNumber = true;
    updateOperationDisplay();
  }
}

// Handle decimal point
function handleDecimal() {
  if (waitingForNewNumber) {
    currentNumber = "0,";
    waitingForNewNumber = false;
  } else if (currentNumber.indexOf(",") === -1) {
    currentNumber += ",";
  }
  updateMainDisplay();
}

// Handle clear (reset everything)
function handleClear() {
  currentNumber = "0";
  previousNumber = "";
  operator = "";
  waitingForNewNumber = false;
  updateMainDisplay();
  updateOperationDisplay();
}

// Handle clear entry (clear current number only)
function handleClearEntry() {
  currentNumber = "0";
  updateMainDisplay();
}

// Handle backspace
function handleBackspace() {
  if (currentNumber.length > 1) {
    currentNumber = currentNumber.slice(0, -1);
  } else {
    currentNumber = "0";
  }
  updateMainDisplay();
}

// Perform calculation
function calculate() {
  const prev = Number.parseFloat(previousNumber.replace(",", "."));
  const current = Number.parseFloat(currentNumber.replace(",", "."));
  let result;

  switch (operator) {
    case "+":
      result = prev + current;
      break;
    case "-":
      result = prev - current;
      break;
    case "×":
      result = prev * current;
      break;
    case "÷":
      if (current === 0) {
        alert("Cannot divide by zero!");
        return;
      }
      result = prev / current;
      break;
    default:
      return;
  }

  // Format result and handle decimal places
  currentNumber = formatNumber(result)
  updateMainDisplay();
}

// Format number for display
function formatNumber(num) {
  // Round to avoid floating point precision issues
  const rounded = Math.round(num * 100000000) / 100000000;

  // Convert to string and replace dot with comma for decimal
  let formatted = rounded.toString().replace(".", ",");

  // Limit decimal places to avoid overflow
  if (formatted.includes(",")) {
    const parts = formatted.split(",");
    if (parts[1].length > 8) {
      formatted = rounded.toFixed(8).replace(".", ",");
    }
  }

  return formatted;
}

// Handle keyboard input
function handleKeyboard(event) {
  const key = event.key;

  // Numbers
  if (key >= "0" && key <= "9") {
    handleNumber(key);
  }

  // Operators
  switch (key) {
    case "+":
      handleOperator("+");
      break;
    case "-":
      handleOperator("-");
      break;
    case "*":
      handleOperator("×");
      break;
    case "/":
      event.preventDefault();
      handleOperator("÷");
      break;
    case "Enter":
    case "=":
      handleEquals();
      break;
    case ".":
    case ",":
      handleDecimal();
      break;
    case "Escape":
      handleClear();
      break;
    case "Backspace":
      handleBackspace();
      break;
  }
}

// Initialize calculator when page loads
document.addEventListener("DOMContentLoaded", initCalculator);
