import { fetchThemeInfo } from './fetch.js'
import { getTheme, getFontOn } from './settings.js'

function applyTheme(theme) {
    fetchThemeInfo(theme, (themeData) => {
        const colorNames = Object.keys(themeData.colors);
        const colorValues = Object.values(themeData.colors);
        for (let i = 0; i < colorNames.length; i++) {
            document.documentElement.style.setProperty(colorNames[i], colorValues[i]);
        }
    })
}

function applyDislexiaFont(fontOn) {
    const fontName = (fontOn === 'yes') ? 'OpenDyslexic' : '\"Source Sans Pro\", sans-serif';
    document.documentElement.style.setProperty('--font', fontName);
}

applyTheme(getTheme());
applyDislexiaFont(getFontOn());

export { applyTheme, applyDislexiaFont };