
function getUrlParameter(name) {
    const regex = new RegExp(`[?&]${name}=([^&#]*)`);
    const results = regex.exec(window.location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Popup translations for supported languages
const popupTranslations = {
    de: {
        message: "Es scheint, als würdest du die folgende Sprache nutzen: ",
        switch: "Sprache wechseln",
        stay: "Die aktuelle Sprache beibehalten"
    },
    en: {
        message: "We detected your browser language as ",
        switch: "Switch Language",
        stay: "Stay in Current Language"
    },
    fr: {
        message: "Nous avons détecté la langue de votre navigateur : ",
        switch: "Changer de langue",
        stay: "Rester dans la langue actuelle"
    },
    es: {
        message: "Hemos detectado el idioma de su navegador: ",
        switch: "Cambiar idioma",
        stay: "Mantener el idioma actual"
    },
    pt: {
        message: "Detectamos o idioma do seu navegador como ",
        switch: "Mudar idioma",
        stay: "Permanecer no idioma atual"
    },
    nl: {
        message: "We hebben de taal van uw browser gedetecteerd als ",
        switch: "Taal wijzigen",
        stay: "Blijf in de huidige taal"
    },
    uk: {
        message: "Ми виявили мову вашого браузера як ",
        switch: "Змінити мову",
        stay: "Залишитися на поточній мові"
    },
    tr: {
        message: "Tarayıcı dilinizin şu dil olduğunu tespit ettik: ",
        switch: "Dili Değiştir",
        stay: "Mevcut Dilde Kal"
    },
    it: {
        message: "Abbiamo rilevato la lingua del browser come ",
        switch: "Cambia Lingua",
        stay: "Rimani nella lingua corrente"
    },
    pl: {
        message: "Wykryliśmy język twojej przeglądarki jako ",
        switch: "Zmień język",
        stay: "Pozostań w bieżącym języku"
    },
    da: {
        message: "Vi har registreret dit browsersprog som ",
        switch: "Skift sprog",
        stay: "Bliv på nuværende sprog"
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
    if (lang == "de"){
        const newUrl = `${window.location.pathname}?lang=${lang}`;
        window.location.href = newUrl;
        return;
    }
    const popup = document.getElementById('language-popup');
    const message = document.getElementById('language-message');
    const switchLangBtn = document.getElementById('switch-lang-btn');
    const closePopupBtn = document.getElementById('close-popup-btn');
    
    // Use translations based on the detected language or default to English
    const translations = popupTranslations[lang] || popupTranslations['en'];

    // Update the message and button text in the popup
    message.textContent = `${translations.message}${lang.toUpperCase()}. Would you like to switch to this language?`;
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

// Function to update the scale for navlink and logo elements
function updateNavlinkLogoScale(translations, scaleFactor) {
    document.querySelectorAll('.translateable').forEach(element => {
        const elementId = element.id;

        if (elementId.startsWith('navlink') || elementId === 'logo') {
            // Get the computed style in pixels
            var style = window.getComputedStyle(element, null).getPropertyValue('font-size');
            console.log(elementId);
            var fontSizePx = parseFloat(style); 
            
            // Convert px to vw
            var vw = (fontSizePx / window.innerWidth) * 100;
            console.log(`Converted to vw: ${vw}vw`);
            console.log(`scale: ${scaleFactor}`);
            
            // Apply the new font size in vw
            element.style.fontSize = `${vw * scaleFactor}vw`;
        }
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

        // Listen for window resize and update the scaling
        window.addEventListener('resize', () => {
            updateNavlinkLogoScale(translations, scaleFactor);
        });

    } catch (error) {
        console.error('Error loading translations:', error);
    }
}

// Call the function when the document is ready
document.addEventListener('DOMContentLoaded', loadTranslations);
