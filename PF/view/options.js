import { setTheme, getLanguage } from '../controller/settings.js'
import { fetchThemesInfo, fetchAvailableLanguages } from '../data/fetch.js';
import { applyTheme } from './applyTheme.js';

// Retrieve DOM elements
const form = document.getElementsByTagName('form')[0];
const themeSelect = form.querySelector('select[name="theme"]');
const languageSelect = form.querySelector('select[name="language"]');

const language = getLanguage();

const fragment = new DocumentFragment();


// Populate the theme <select> with the theme options available in the data
function populateThemes() {
    // Fetch the themes array
    fetchThemesInfo((themes) => {
        themes.forEach((theme) => {
            const option = document.createElement('option');
            option.value = theme.id;
            option.textContent = theme.name[language];
            themeSelect.appendChild(option);
        })
    });
};

// Populate the language <select> with the language options available in the data
function populateLanguages() {
    // Fetch the available languages object
    fetchAvailableLanguages((languages) => {
        const languageCodes = Object.keys(languages);
        const languageNames = Object.values(languages);
        for(let i = 0; i < languageCodes.length; i++){
            const option = document.createElement('option');
            option.value = languageCodes[i];
            option.textContent = languageNames[i];
            languageSelect.appendChild(option);
        }
    });
};

populateThemes();
populateLanguages();
form.appendChild(fragment);


form.addEventListener('submit', (e) => {
    e.preventDefault();
    setTheme(themeSelect.value);
    applyTheme(themeSelect.value)
});