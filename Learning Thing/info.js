
// function ensures that populateButtonCloud gets executed only after DrugLabels, DrugInfo & DrugClasses have been fetched and parsed
document.addEventListener("DOMContentLoaded", () => {
    Promise.all([fetchDrugLabels(), fetchDrugInfo(), fetchDrugClasses()]).then(() => {
        populateButtonCloud(drugs); // Populate button cloud after loading all data
    });
});

let drugs = [];
let drugInfo = [];
let drugClasses = {};


// Fetching drug labels
async function fetchDrugLabels() {
    const sparqlEndpoint = "https://query.wikidata.org/sparql";
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
        const response = await fetch(`${sparqlEndpoint}?query=${encodeURIComponent(query)}`, {
            headers: { Accept: "application/json" },
        });
        const data = await response.json();
        drugs = data.results.bindings.map(result => result.drugLabel.value);
        console.log("Fetched drug labels:", drugs); // Debugging log
    } catch (error) {
        console.error("SPARQL Query Error:", error);
    }
}


// Fetch info from drugs_info.json
async function fetchDrugInfo() {
    try {
        const response = await fetch("drug_info.json");
        drugInfo = await response.json();
        console.log("Fetched drug info:", drugInfo); // Debugging log
    } catch (error) {
        console.error("Error fetching drugs_info.json:", error);
    }
}

// Fetching drug classes
async function fetchDrugClasses() {
    const sparqlEndpoint = "https://query.wikidata.org/sparql";
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
        const response = await fetch(`${sparqlEndpoint}?query=${encodeURIComponent(query)}`, {
            headers: { Accept: "application/json" },
        });
        const data = await response.json();

        data.results.bindings.forEach(result => {
            const drugLabel = result.drugLabel?.value?.toLowerCase();
            const classLabel = result.classLabel?.value || "Unknown";
            if (drugLabel) {
                drugClasses[drugLabel] = classLabel;
            }
        });
        console.log("Mapped Drug Classes:", drugClasses); // Debugging log
    } catch (error) {
        console.error("SPARQL Query Error (Classes):", error);
    }
}

data.results.bindings.forEach(result => {
    const drugLabel = result.drugLabel?.value?.toLowerCase();
    const classLabel = result.classLabel?.value || "Unknown";
    if (drugLabel) {
        drugClasses[drugLabel] = classLabel;
    }
});
console.log("Mapped Drug Classes:", drugClasses);
const classLabel = drugClasses[selectedDrug.toLowerCase()] || "Unknown";

// Populate the button cloud
function populateButtonCloud(drugs) {
    const buttonCloud = document.getElementById("buttonCloud");
    buttonCloud.innerHTML = ""; // Clear existing buttons

    drugs.forEach(drug => {
        const button = document.createElement("button");
        button.textContent = drug;
        button.classList.add("drug-button");
        button.addEventListener("click", () => displayDrugInfo(drug));
        buttonCloud.appendChild(button);
    });
}

// Display drug information
function displayDrugInfo(selectedDrug) {
    const drugDisplay = document.getElementById("drugDisplay");
    drugDisplay.style.display = "block";

    // Find the drug info in the drugInfo array
    const info = drugInfo.find(
        entry => entry.drug_title.toLowerCase() === selectedDrug.toLowerCase()
    );
    const classLabel = drugClasses[selectedDrug] || "Unknown";

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
        drugDisplay.innerHTML = `
            <p>No detailed information available for ${selectedDrug}.</p>
            <p><strong>Class:</strong> ${classLabel}</p>
        `;
    }
}