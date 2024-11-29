// Load JSON data and populate the button cloud
let drugsData = []; // Variable to hold drug data
let selectedDrugs = []; // Array to track selected buttons

fetch("drugs.json")
    .then(response => response.json())
    .then(data => {
        drugsData = data;
        const uniqueDrugs = getUniqueDrugs(drugsData);
        populateButtonCloud(uniqueDrugs);
    })
    .catch(error => console.error("Error loading drugs data:", error));

// Function to get unique drugs from the dataset
function getUniqueDrugs(data) {
    // Create a Set of unique drug names from the "Drug" field
    return [...new Set(data.map(entry => entry.Drug))];
}

// Function to populate the button cloud
function populateButtonCloud(drugs) {
    const buttonCloud = document.getElementById("buttonCloud");

    if (!buttonCloud) {
        console.error("Button Cloud element not found!");
        return;
    }

    // Dynamically create buttons for each drug
    drugs.forEach(drug => {
        const button = document.createElement("button");
        button.textContent = drug; // Set button label
        button.classList.add("drug-button");
        button.addEventListener("click", () => handleButtonClick(button, drug)); // Add click handler
        buttonCloud.appendChild(button);
    });
}

// Function to handle button clicks
function handleButtonClick(button, drug) {
    if (button.classList.contains("selected")) {
        // If already selected, deselect it
        button.classList.remove("selected");
        selectedDrugs = selectedDrugs.filter(selectedDrug => selectedDrug !== drug);
    } else {
        // If not selected, add to the selection (limit to 2)
        if (selectedDrugs.length < 2) {
            button.classList.add("selected");
            selectedDrugs.push(drug);
        } else {
            alert("You can only select up to two drugs. Deselect one to choose another.");
            return;
        }
    }

    // When two buttons are selected
    if (selectedDrugs.length === 2) {
        showSelectedButtons(); // Display selected buttons and hide others
    }
}

// Function to display selected buttons and hide others
function showSelectedButtons() {
    const allButtons = document.querySelectorAll(".drug-button");
    const resetButton = document.getElementById("resetButton");

    // Hide all non-selected buttons
    allButtons.forEach(button => {
        if (!button.classList.contains("selected")) {
            button.style.display = "none"; // Hide non-selected buttons
        }
    });

    // Create a flex container for selected buttons
    const selectedContainer = document.createElement("div");
    selectedContainer.classList.add("selected-container");

    // Append selected buttons to the container
    const selectedButtons = document.querySelectorAll(".drug-button.selected");
    selectedButtons.forEach(button => {
        selectedContainer.appendChild(button);
    });

    // Add the container to the main content area
    const content = document.getElementById("content");
    content.appendChild(selectedContainer);

    // Show the reset button
    resetButton.style.display = "block";
}

// Function to reset the button cloud
function resetButtonCloud() {
    const buttonCloud = document.getElementById("buttonCloud");
    const allButtons = document.querySelectorAll(".drug-button");
    const resetButton = document.getElementById("resetButton");
    const selectedContainer = document.querySelector(".selected-container");

    // Reset button positions and styles
    allButtons.forEach(button => {
        button.classList.remove("selected"); // Remove selected class
        button.style.display = "inline-block"; // Show all buttons
        button.style.position = "static"; // Reset position
        button.style.transform = "none"; // Remove transformations

        // Move all buttons back to the button cloud
        buttonCloud.appendChild(button);
    });

    // Remove the selected-container if it exists
    if (selectedContainer) {
        selectedContainer.remove();
    }

    // Hide the reset button
    resetButton.style.display = "none";

    // Clear the selectedDrugs array
    selectedDrugs = [];
}