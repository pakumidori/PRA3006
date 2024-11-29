let drugsData = []; // Variable to hold drug data
let selectedDrugs = []; // Array to track selected buttons
let drugs = []; // Array to store drug labels

document.addEventListener("DOMContentLoaded", () => {
    fetchDrugLabels().then(() => {
        populateButtonCloud(drugs); // Populate the button cloud after fetching labels
    });
});


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
            console.error("SPARQL Query Error:", error);
        });
}











// Function to populate the button cloud
function populateButtonCloud(drugs) {
    const buttonCloud = document.getElementById("buttonCloud");
    drugs.forEach(drug => {
        const button = document.createElement("button");
        button.textContent = drug;
        button.classList.add("drug-button");
        button.addEventListener("click", () => handleButtonClick(button, drug));
        buttonCloud.appendChild(button);
    });
}

// Function to handle button clicks
function handleButtonClick(button, drug) {
    if (button.classList.contains("selected")) {
        button.classList.remove("selected");
        selectedDrugs = selectedDrugs.filter(selectedDrug => selectedDrug !== drug);
    } else {
        if (selectedDrugs.length < 2) {
            button.classList.add("selected");
            selectedDrugs.push(drug);
        } else {
            alert("You can only select up to two drugs. Deselect one to choose another.");
            return;
        }
    }

    // When exactly two buttons are selected
    if (selectedDrugs.length === 2) {
        showSelectedButtons();
    }
}

// Function to display selected buttons and hide others
function showSelectedButtons() {
    const allButtons = document.querySelectorAll(".drug-button");
    const actionButtons = document.getElementById("actionButtons");

    // Hide all non-selected buttons
    allButtons.forEach(button => {
        if (!button.classList.contains("selected")) {
            button.style.display = "none"; // Hide non-selected buttons
        }
    });

    // Move selected buttons to a container and position them
    const selectedButtons = document.querySelectorAll(".drug-button.selected");
    const buttonCloud = document.getElementById("buttonCloud");

    // Create a container for selected buttons
    const selectedContainer = document.createElement("div");
    selectedContainer.classList.add("selected-container");
    selectedButtons.forEach(button => {
        selectedContainer.appendChild(button);
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




// Function to run the test and fetch the danger level
function runTest() {
    const dangerLevelDisplay = document.getElementById("dangerLevelDisplay");

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

    // Display the danger level
    dangerLevelDisplay.style.display = "block";
    if (result) {
        dangerLevelDisplay.textContent = `Danger Level: ${result.Danger_Level}`;
    } else {
        dangerLevelDisplay.textContent =
            "No interaction information available for this combination.";
    }
}






