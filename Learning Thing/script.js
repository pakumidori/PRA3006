
// FETCH AND INITALIZE DATASETS, DEFINITIONS AND ADDITIONAL INFORMATION



let drugsData = []; // Array to hold drug data
let selectedDrugs = []; // Array to track selected buttons
let drugs = []; // Array to store drug labels
let comboDefinitions = []; // Array for combo definitions

console.log("Drugs Data:", drugsData); // Debugging log for drugsData


// Ensure the DOM is fully loaded before running scripts

document.addEventListener("DOMContentLoaded", () => {
    // Fetch all required datasets and populate the button cloud after loading

    Promise.all([fetchDrugLabels(), fetchDrugsData(), fetchComboDefinitions()]).then(() => {
        populateButtonCloud(drugs); // Populate button cloud after loading all data
    });
});


// Fetch drug labels using SPARQL query

function fetchDrugLabels() {
    const sparqlEndpoint = "https://query.wikidata.org/sparql";

    // SPARQL query to fetch drug labels
    const query = `
        SELECT ?drug ?drugLabel
        WHERE {
          VALUES ?drug {
            wd:Q2728188  # 2c
            wd:Q156      # alcohol
            wd:Q2445303  # amphetamines
            wd:Q83871    # benzodiazepine
            wd:Q60235    # caffeine
            wd:Q2845     # cannabis
            wd:Q41576    # cocaine
            wd:Q407217   # dmt
            wd:Q243547   # ketamine
            wd:Q23118    # lsd
            wd:Q69488    # mdma
            wd:Q193140   # mescaline
            wd:Q262613   # mephedrone
            wd:Q208118   # mushrooms
            wd:Q427523   # opioids
            wd:Q334477   # ssris
          }
          SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
        }
    `;

    // Fetch SPARQL data
    return fetch(`${sparqlEndpoint}?query=${encodeURIComponent(query)}`, {
        headers: { Accept: "application/json" },
    })
        .then(response => response.json())
        .then(data => {
            // Extract drug labels and store them in the `drugs` array
            drugs = data.results.bindings.map(result => result.drugLabel.value);
            console.log("Fetched drug labels:", drugs); // Debugging log
        })
        .catch(error => {
            console.error("SPARQL Query Error:", error); // Log errors
        });
}


// fetch drug interaction data from drugs.json
function fetchDrugsData() {
    return fetch("drugs.json")
        .then(response => response.json())
        .then(data => {
            drugsData = data; // Populate drugsData with the JSON content
            console.log("Fetched drugs.json data:", drugsData); // Debugging log
        })
        .catch(error => {
            console.error("Error fetching drugs.json:", error); // Log errors
        });
}



// Fetch combo definitions from combo_definitions.json

function fetchComboDefinitions() {
    return fetch("combo_definitions.json")
        .then(response => response.json())
        .then(data => {
            comboDefinitions = data; // Populate comboDefinitions
            console.log("Combo Definitions Loaded:", comboDefinitions); // Debugging log
        })
        .catch(error => console.error("Error fetching combo_definitions.json:", error)); // Log errors
}




















// FUNCTIONS TO HANDLE BUTTONS, BUTTON LABELS AND SELECTIONS

// Function to populate the button cloud dynamically
function populateButtonCloud(drugs) {
    const buttonCloud = document.getElementById("buttonCloud"); // Get the button cloud container
    buttonCloud.innerHTML = ""; // Clear existing content

    // Create and add a button for each drug

    drugs.forEach(drug => {
        const button = document.createElement("button");
        button.textContent = drug; // Set button text to drug label
        button.classList.add("drug-button"); // Apply CSS class for styling
        button.addEventListener("click", () => handleButtonClick(button, drug)); // Add click event listener
        buttonCloud.appendChild(button); // Append the button to the cloud
    });
}

// Function to handle button clicks
function handleButtonClick(button, drug) {
    // Toggle the selected state of the button

    if (button.classList.contains("selected")) {
        button.classList.remove("selected"); // Deselect button
        selectedDrugs = selectedDrugs.filter(selectedDrug => selectedDrug !== drug); // Remove from selected list
    } else {
        if (selectedDrugs.length < 2) {
            button.classList.add("selected"); // Select button
            selectedDrugs.push(drug); // Add to selected list
        } else {
            alert("You can only select up to two drugs. Deselect one to choose another.");

        }
    }

    // When exactly two buttons are selected
    if (selectedDrugs.length === 2) {
        showSelectedButtons(); // Move selected buttons to their container
        runTest(); // Run the interaction test
    }
}

// Function to display selected buttons and hide others
function showSelectedButtons() {
    const allButtons = document.querySelectorAll(".drug-button"); 
    const actionButtons = document.getElementById("actionButtons"); // Container for action buttons

    allButtons.forEach(button => {
        if (!button.classList.contains("selected")) {
            button.style.display = "none"; // Hide non-selected buttons
        }
    });

    actionButtons.style.display = "block"; // Show action buttons

    // Move selected buttons to a container and position them
    const selectedButtons = document.querySelectorAll(".drug-button.selected");
    const buttonCloud = document.getElementById("buttonCloud");

    // Create a container for selected buttons
    const selectedContainer = document.createElement("div");
    selectedContainer.classList.add("selected-container"); // CSS styling for alignment
    
    selectedButtons.forEach(button => {
        selectedContainer.appendChild(button); // Add selected buttons to container
    });

    // Clear buttonCloud and append the selectedContainer and action buttons
    buttonCloud.innerHTML = "";
    buttonCloud.appendChild(selectedContainer);
    buttonCloud.appendChild(actionButtons);

    // Show action buttons
    actionButtons.style.display = "flex";
}

// Function to reset the button cloud
function resetButtonCloud() {
    // Reload the page
    location.reload();
}













// FUNCTIONS THAT HANDLE TEST AND RESULT DISPLAYING


// Function to run the test and fetch the danger level
function runTest() {
    const dangerLevelDisplay = document.getElementById("dangerLevelDisplay"); // Get the display container


    // Ensure two drugs are selected
    if (selectedDrugs.length !== 2) {
        alert("Please select exactly two drugs.");
        return;
    }

    const [drug, interactingDrug] = selectedDrugs;

    // Find the danger level from the drugsData
    const result = drugsData.find(
        entry => entry.Drug === drug && entry.Interacting_Drug === interactingDrug
    );


    // Handle undefined result
if (!result) {
    const unknownDefinition = comboDefinitions.find(
        def => def.status.toLowerCase() === "unknown"
    );

    if (unknownDefinition) {
        dangerLevelDisplay.style.display = "block";
        dangerLevelDisplay.innerHTML = `
            <div style="color: ${unknownDefinition.color}; font-weight: bold; font-size: 1.5rem;">
                ${unknownDefinition.emoji} ${unknownDefinition.status}
            </div>
            <p>${unknownDefinition.definition}</p>
        `;
    } else {
        dangerLevelDisplay.style.display = "block";
        dangerLevelDisplay.innerHTML = `
            <div style="font-weight: bold; font-size: 1.5rem; color: gray;">
                Unknown
            </div>
            <p>No interaction information available for this combination.</p>
        `;
    }
    return; // Exit the function after handling "Unknown"
}


    // Display the danger level
    dangerLevelDisplay.style.display = "block";    
    dangerLevelDisplay.innerHTML = result
    
    // Find the definition for the result's danger level

    const definition = comboDefinitions.find(
        def => def.status.toLowerCase() === result.Danger_Level.toLowerCase()
    );


    if (definition) {
        // Update display with enriched information
        dangerLevelDisplay.innerHTML = `
            <div style="color: ${definition.color}; font-weight: bold; font-size: 1.5rem;">
                ${definition.emoji} ${definition.status}
            </div>
            <p>${definition.definition}</p>
        `;

    }
}