
function getUrlParameter(name) {
    const regex = new RegExp(`[?&]${name}=([^&#]*)`);
    const results = regex.exec(window.location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));

}

// Popup translations for supported languages
const popupTranslations = {
    "en": {
        "message": "We detected your browser language as English",
        "switch": "Switch to English",
        "stay": "Seite weiterhin auf Deutsch betrachten"
    },
    "fr": {
        "message": "Nous avons détecté que la langue de votre navigateur est le français",
        "switch": "Passer au français",
        "stay": "Seite weiterhin auf Deutsch betrachten"
    },
    "es": {
        "message": "Hemos detectado que el idioma de tu navegador es español",
        "switch": "Cambiar a español",
        "stay": "Seite weiterhin auf Deutsch betrachten"
    },
    "pt": {
        "message": "Detectámos que o idioma do seu navegador é português",
        "switch": "Mudar para português",
        "stay": "Seite weiterhin auf Deutsch betrachten"
    },
    "nl": {
        "message": "We hebben gedetecteerd dat de taal van uw browser Nederlands is",
        "switch": "Overschakelen naar Nederlands",
        "stay": "Seite weiterhin auf Deutsch betrachten"
    },
    "uk": {
        "message": "Ми виявили, що мова вашого браузера українська",
        "switch": "Переключити на українську",
        "stay": "Seite weiterhin auf Deutsch betrachten"
    },
    "tr": {
        "message": "Tarayıcı dilinizin Türkçe olduğunu tespit ettik",
        "switch": "Türkçeye geç",
        "stay": "Seite weiterhin auf Deutsch betrachten"
    },
    "it": {
        "message": "Abbiamo rilevato che la lingua del tuo browser è l'italiano",
        "switch": "Passa all'italiano",
        "stay": "Seite weiterhin auf Deutsch betrachten"
    },
    "pl": {
        "message": "Wykryliśmy, że język przeglądarki to polski",
        "switch": "Przełącz na polski",
        "stay": "Seite weiterhin auf Deutsch betrachten"
    },
    "da": {
        "message": "Vi har opdaget, at din browsersprog er dansk",
        "switch": "Skift til dansk",
        "stay": "Seite weiterhin auf Deutsch betrachten"
    }
    
};

// Function to detect browser language and handle language switch popup
function detectBrowserLanguage() {
    const browserLang = navigator.language.slice(0, 2); // Get the first two characters of the browser language
    const supportedLangs = ['de', 'en', 'fr', 'es', 'pt', 'nl', 'uk', 'tr', 'it', 'pl', 'da'];

    let langToUse = supportedLangs.includes(browserLang) ? browserLang : 'en'; // Use detected lang if supported, otherwise default to English

    // Show popup with the correct language
    showLanguagePopup(langToUse);
}

// Function to show a language switch popup using an HTML element
function showLanguagePopup(lang) {
    if (lang != "de") {
        const popup = document.getElementById('language-popup');
        const message = document.getElementById('language-message');
        const switchLangBtn = document.getElementById('switch-lang-btn');
        const closePopupBtn = document.getElementById('close-popup-btn');

        // Use translations based on the detected language or default to English
        const translations = popupTranslations[lang] || popupTranslations['en'];

        // Update the message and button text in the popup
        message.textContent = `${translations.message}.`;
        switchLangBtn.textContent = translations.switch;
        closePopupBtn.textContent = translations.stay;

        // Set the event listener for switching the language
        switchLangBtn.addEventListener('click', () => {
            // Reload page with the selected language
            const newUrl = `${window.location.pathname}?lang=${lang}`;
            window.location.href = newUrl;
        });

        // Show the popup
        popup.style.display = 'flex';

        // Add an event listener to close the popup if the user chooses to stay with the current language
        closePopupBtn.addEventListener('click', () => {
            popup.style.display = 'none'; // Hide the popup
            const newUrl = `${window.location.pathname}?lang=de`;
            window.location.href = newUrl;
        });
    }
}

function updateNavlinkLogoScale(translations, scaleFactor) {
    document.querySelectorAll('.translateable').forEach(element => {
        const elementId = element.id;
        
        // Step 1: Store the original font size in a data attribute if it doesn't exist
        if (!element.dataset.originalFontSize) {
            var originalStyle = window.getComputedStyle(element, null).getPropertyValue('font-size');
            element.dataset.originalFontSize = originalStyle; // Store original font-size
        }

        // Step 2: Reset font-size by removing any inline styles
        if (elementId.startsWith('navlink') || elementId === 'logo') {
            element.style.removeProperty("font-size");
        }
    });

    document.querySelectorAll('.translateable').forEach(element => {
        const elementId = element.id;

        if (elementId.startsWith('navlink') || elementId === 'logo') {
            // Step 3: Use the original font-size from the data attribute
            var originalFontSize = parseFloat(element.dataset.originalFontSize);

            // Convert px to vw (based on original font-size)
            var vw = (originalFontSize / window.innerWidth) * 100;

            // Apply the new font size in vw
            element.style.fontSize = `${vw * scaleFactor}vw`;

            console.log("Original font-size: " + originalFontSize);
            console.log("Converted to vw: " + vw);
            console.log("Scale factor: " + scaleFactor);
        }
        console.log("----------------------");
    });
}

// Function to load the JSON translation file and update the text of elements
async function loadTranslations() {
    // Get the language code from the URL parameter
    const langCode = getUrlParameter('lang');

    // Define the supported country codes
    const supportedLangs = ['en', 'fr', 'es', 'pt', 'nl', 'uk', 'tr', 'it', 'pl', 'da'];

    // Check if the language code is supported
    if (!supportedLangs.includes(langCode) && langCode !== 'de') {
        detectBrowserLanguage();
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
        });

        // Apply scaling to navlink and logo elements
        updateNavlinkLogoScale(translations, scaleFactor);

        window.addEventListener('resize', () => {
            updateNavlinkLogoScale(translations, scaleFactor);
        });

    } catch (error) {
        console.error('Error loading translations:', error);
    }
}

// Call the function when the document is ready
document.addEventListener('DOMContentLoaded', loadTranslations);
