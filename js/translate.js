// Function to get the URL parameter by name
function getUrlParameter(name) {
    const regex = new RegExp(`[?&]${name}=([^&#]*)`);
    const results = regex.exec(window.location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Function to load the JSON translation file and update the text of elements
async function loadTranslations() {
    // Get the language code from the URL parameter
    const langCode = getUrlParameter('lang');
    
    // Define the supported country codes
    const supportedLangs = ['en', 'fr', 'es', 'pt', 'nl', 'uk', 'tr', 'it', 'pl', 'da'];
    
    // Check if the language code is supported
    if (!supportedLangs.includes(langCode)) {
        console.warn('Unsupported language code:', langCode);
        return;
    }

    // Construct the URL for the JSON file
    const jsonFilePath = `translations/${langCode}.json`;

    try {
        // Fetch the JSON file
        const response = await fetch(jsonFilePath);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the JSON data
        const translations = await response.json();

        // Check if the JSON contains a 'scale' value (in vw)
        const scaleFactor = translations.scale || 1.0;  // Default scale is 1.0 vw if not provided

        // Update the text of elements with class "translateable"
        document.querySelectorAll('.translateable').forEach(element => {
            const elementId = element.id;
            
            if (translations[elementId]) {
                element.textContent = translations[elementId];
            } else {
                console.warn(`No translation found for ID: ${elementId}`);
            }

            // Apply scaling to elements with IDs starting with 'navlink' or exactly equal to 'logo'
            if (elementId.startsWith('navlink') || elementId === 'logo') {
                console.log(elementId);
                // Apply the scale in vw directly, as specified
                element.style.fontSize = `${scaleFactor}vw`;
            }
        });

    } catch (error) {
        console.error('Error loading translations:', error);
    }
}

// Call the function when the document is ready
document.addEventListener('DOMContentLoaded', loadTranslations);
