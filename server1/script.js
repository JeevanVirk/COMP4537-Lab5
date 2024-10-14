class PatientManager {
  constructor() {
    this.insertButton = document.getElementById("insertButton");
    this.submitQueryButton = document.getElementById("submitQuery");
    this.sqlQueryInput = document.getElementById("sqlQuery");
    this.resultDiv = document.getElementById("result");

    this.initEventListeners();
  }

  // Method to initialize event listeners
  initEventListeners() {
    this.insertButton.addEventListener("click", () => this.insertPatient());
    this.submitQueryButton.addEventListener("click", () => this.submitQuery());
  }

  // Method to insert patient data via POST request
  insertPatient() {
    fetch("https://comp4537-lab5-c5m6.onrender.com/insert", { method: "POST" })
      .then((response) => response.json())
      .then((data) => this.displayResult(data))
      .catch((error) => this.displayError(error));
  }

  // Method to submit custom SQL queries
  submitQuery() {
    const query = this.sqlQueryInput.value.trim();

    if (query.toUpperCase().startsWith("SELECT")) {
      fetch(
        `https://comp4537-lab5-c5m6.onrender.com/query?sql=${encodeURIComponent(
          query
        )}`,
        {
          method: "GET",
        }
      )
        .then((response) => response.json())
        .then((data) => this.displayResult(data))
        .catch((error) => this.displayError(error));
    } else {
      this.displayError("Only SELECT queries are allowed!");
    }
  }

  // Method to display the result in the HTML page
  displayResult(data) {
    this.resultDiv.innerText = JSON.stringify(data, null, 2);
  }

  // Method to display an error message
  displayError(error) {
    this.resultDiv.innerText = `Error: ${error}`;
  }
}

// Initialize the PatientManager class when the DOM is ready
document.addEventListener("DOMContentLoaded", () => new PatientManager());
