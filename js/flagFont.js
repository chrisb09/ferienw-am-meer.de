// Function to detect if the OS is Windows and the browser is not Firefox
function isWindowsAndNotFirefox() {
    const isWindows = navigator.platform.toLowerCase().indexOf('win') > -1;
    const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    return isWindows && !isFirefox;
}

// Function to dynamically add the @font-face rule and apply it to .headline-small
function loadCustomFont() {
    // Define the font-face CSS rule
    const fontFaceRule = `
        @font-face {
            font-family: 'FlagsOnly';
            src: url('../res/NotoColorEmoji-flagsonly.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
        }
    `;

    // Create a <style> element to insert the @font-face rule
    const styleElement = document.createElement('style');
    styleElement.innerHTML = fontFaceRule;
    document.head.appendChild(styleElement);

    // Define the rule to apply the new font stack to .headline-small
    const headlineFontRule = `
        .headline-small {
            font-family: "FlagsOnly", "Meta", 'Segoe UI Emoji', 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;
        }
    `;

    // Create another <style> element to apply the new font-family to the class
    const headlineStyleElement = document.createElement('style');
    headlineStyleElement.innerHTML = headlineFontRule;
    document.head.appendChild(headlineStyleElement);
}

// Function to initialize after DOM is ready
function init() {
    if (isWindowsAndNotFirefox()) {
        loadCustomFont();
    }
}

// Ensure the DOM is fully loaded before running the font load function
document.addEventListener('DOMContentLoaded', init);