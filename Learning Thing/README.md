TABLE OF CONTENTS
	•	Overview
	•	Features
	•	Technologies Used
	•	Getting Started
	•	Prerequisites
	•	Installation
	•	Usage
	•	Checker Application
	•	Information Page
	•	Codebase Structure
	•	Data Files
	•	Customization
	•	Contributing
	•	License


OVERVIEW

The Drug Interaction Checker aims to:
	•	Provide users with information about the safety of combining two substances.
	•	Allow users to learn about specific substances and their classifications.
	•	Emphasize harm reduction by categorizing combinations into “Dangerous,” “Unsafe,” “Caution,” “Low Risk,” and “Unknown.”

This tool is not a substitute for professional advice. Users should always conduct additional research and consult healthcare professionals.


FEAUTRES
	1.	Checker Application:
	    •	Select two substances to check their interaction and risk level.
	    •	Displays safety levels using visual feedback (color-coded results with emojis).
	2.	Information Page:
	    •	View detailed information about specific substances, including their rank, effects, feelings, and classification.
	3.	Dynamic Button Cloud:
	    •	Automatically generates a button cloud for substances, fetched via SPARQL queries from Wikidata.
	4.	Customizable Interaction Definitions:
	    •	Risk levels (Dangerous, Unsafe, Caution, etc.) are stored in combo_definitions.json for easy modification.


TECHNOLOGIES USED
	•	HTML/CSS: For structuring and styling the web pages.
	•	JavaScript (Vanilla): For dynamic functionality, including SPARQL queries and UI updates.
	•	SPARQL: To fetch real-time data about substances and their classifications from Wikidata.
	•	JSON: To store and retrieve local interaction data and definitions.


GETTING STARTED

Prerequisites
	•	A modern web browser (e.g., Chrome, Firefox, Safari).
	•	A local server for testing (e.g., Live Server for VS Code).
	•	Basic knowledge of GitHub and Git.

Installation
	1.	Clone the repository:

$git clone https://github.com/pakumidori/PRA3006.git

	2.	Navigate to the project directory:

$cd Learning Thing

	
    3.	Open the project in a code editor (e.g., VS Code).
	4.	Run a local server to test the site:
	•	If using VS Code, right-click index.html and select “Open with Live Server.”


USAGE  

Checker Application
	1.	Navigate to checker.html.
	2.	Select two substances from the dynamic button cloud.
	3.	View the interaction’s risk level, displayed below the buttons with an emoji, color, and description.

Information Page
	1.	Navigate to info.html.
	2.	Select a single substance from the dynamic button cloud.
	3.	View detailed information about the substance, including its rank, effects, feelings, and class.


CODEBASE STRUCTURE

The repository contains the following files and directories:

Root Files
	•	index.html: The main landing page for the application.
	•	checker.html: The interaction checker application.
	•	info.html: The information page for individual substances.
	•	style.css: The global stylesheet for the application.

Scripts
	•	script.js: Handles logic for the checker application.
	•	info.js: Handles logic for the information page.

Data
	•	drugs.json: Contains interaction data between substances.
	•	combo_definitions.json: Defines risk levels, colors, emojis, and descriptions for interactions.
	•	drug_info.json: Contains detailed information about each substance.


DATAFILES

combo_definitions.json
	•	Defines the safety categories for substance interactions.
    •	Example:
    
    {
     "status": "Dangerous",
    "emoji": "☠️",
    "color": "#8C092E",
    "definition": "These combinations are considered extremely harmful and should always be avoided."
    }

drugs.json
	•	Contains data on interactions between substances.
	•	Example:

    {
     "Drug": "Alcohol",
    "Interacting_Drug": "Cannabis",
    "Danger_Level": "Caution"
    }


 drug_info.json
	•	Provides detailed information about each substance.
	•	Example:

    {
     "drug_title": "Alcohol",
    "rank": "Moderate",
    "effects": "Euphoria, Disinhibition",
    "feeling": "Relaxed"
    }



CUSTOMISATION

Adding New Substances
	1.	Update drugs.json with new interactions.
	2.	Update drug_info.json with new substance details.
	3.	If necessary, update SPARQL queries in script.js and info.js.

Updating Interaction Definitions
	•	Edit combo_definitions.json to change descriptions, emojis, or colors for each danger level.


LICENSE

This project is licensed under the MIT License. See the LICENSE file for details.