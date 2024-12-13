
// Wait for the DOM to fully load before executing scripts
// Ensures that all HTML elements are available for manipulation
// function ensures that populateButtonCloud gets executed only after DrugLabels, DrugInfo & DrugClasses have been fetched and parsed
document.addEventListener("DOMContentLoaded", () => {
        // Execute all fetch functions in parallel and wait until they are resolved
    Promise.all([fetchDrugLabels(), fetchDrugInfo(), fetchDrugClasses()]).then(() => {
        populateButtonCloud(drugs); // Populate button cloud after loading all data
    });
});

// Global arrays and objects to store fetched data
let drugs = []; // Array to store drug labels retrieved from SPARQL
let drugInfo = []; // Array to store detailed drug information from JSON
let drugClasses = {}; // Object to map drugs to their respective classes



// Fetching drug labels
async function fetchDrugLabels() {
    const sparqlEndpoint = "https://query.wikidata.org/sparql"; // SPARQL query endpoint
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

    try {
                // Fetch data from the SPARQL endpoint

        const response = await fetch(`${sparqlEndpoint}?query=${encodeURIComponent(query)}`, {
            headers: { Accept: "application/json" },
        });
        const data = await response.json();
                // Map the drug labels from the response

        drugs = data.results.bindings.map(result => result.drugLabel.value);
        console.log("Fetched drug labels:", drugs); // Debugging log
    } catch (error) {
        console.error("SPARQL Query Error:", error); // Log any errors during the fetch
    
    }
}


// Fetch detailed drug information from a local JSON file
async function fetchDrugInfo() {
    try {
            // Fetch the drug_info.json file from the server

        const response = await fetch("drug_info.json");
        drugInfo = await response.json();
        console.log("Fetched drug info:", drugInfo); // Debugging log
    } catch (error) {
        console.error("Error fetching drugs_info.json:", error);  // Log errors if the fetch fails
    }
}

// Fetch drug classes from Wikidata using SPARQL
async function fetchDrugClasses() {
    const sparqlEndpoint = "https://query.wikidata.org/sparql"; // SPARQL query endpoint
    const query = `
        SELECT ?drug ?drugLabel ?classLabel
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
          ?drug wdt:P2868 ?class.
          SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
        }
    `;

    try {
        // Fetch data from the SPARQL endpoint

        const response = await fetch(`${sparqlEndpoint}?query=${encodeURIComponent(query)}`, {
            headers: { Accept: "application/json" },
        });
        const data = await response.json();

        // Map the class labels to their corresponding drug labels

        data.results.bindings.forEach(result => {
            const drugLabel = result.drugLabel?.value?.toLowerCase(); // Normalize to lowercase
            const classLabel = result.classLabel?.value || "Unknown"; // Default to "Unknown"
            if (drugLabel) {
                drugClasses[drugLabel] = classLabel; // Add to drugClasses object
            }
        });
        console.log("Mapped Drug Classes:", drugClasses); // Debugging log
    } catch (error) {
        console.error("SPARQL Query Error (Classes):", error);
    }
}


// Populate the button cloud
function populateButtonCloud(drugs) {
    const buttonCloud = document.getElementById("buttonCloud"); // Get the button cloud container
    buttonCloud.innerHTML = ""; // Clear existing buttons

    // Create a button for each drug

    drugs.forEach(drug => {
        const button = document.createElement("button");
        button.textContent = drug; // Set the button text to the drug label
        button.classList.add("drug-button"); // Add a class for styling
        button.addEventListener("click", () => displayDrugInfo(drug)); // Add click event to display drug info
        buttonCloud.appendChild(button); // Add the button to the container
    });
}

// Display detailed information about the selected drug
function displayDrugInfo(selectedDrug) {
    const drugDisplay = document.getElementById("drugDisplay"); // Get the display container
    drugDisplay.style.display = "block"; // Ensure the display is visible

    // Find the drug info in the drugInfo array
    const info = drugInfo.find(
        entry => entry.drug_title.toLowerCase() === selectedDrug.toLowerCase()
    );
    // Retrieve the class label for the selected drug

    const classLabel = drugClasses[selectedDrug] || "Unknown";

    // Populate the display with the drug's information

    if (info) {
        drugDisplay.innerHTML = `
            <div style="font-weight: bold; font-size: 1.5rem; margin-bottom: 10px;">
                ${info.drug_title}
            </div>
            <p><strong>Rank:</strong> ${info.rank}</p>
            <p><strong>Effects:</strong> ${info.effects}</p>
            <p><strong>Feeling:</strong> ${info.feeling}</p>
            <p><strong>Class:</strong> ${classLabel}</p>
        `;
    } else {
        // If no detailed info is available, display only the class label

        drugDisplay.innerHTML = `
            <p>No detailed information available for ${selectedDrug}.</p>
            <p><strong>Class:</strong> ${classLabel}</p>
        `;
    }
}