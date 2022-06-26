import { fetchThemeInfo } from '../data/fetch.js'
import { getTheme } from '../controller/settings.js'

function applyTheme(theme) {
    fetchThemeInfo(theme, (themeData) => {
        const colorNames = Object.keys(themeData.colors);
        const colorValues = Object.values(themeData.colors);
        for (let i = 0; i < colorNames.length; i++) {
            document.documentElement.style.setProperty(colorNames[i], colorValues[i]);
        }
    })
}

applyTheme(getTheme());

export { applyTheme };