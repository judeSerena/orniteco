import { setTheme, getLanguage, setLanguage } from '../controller/settings.js'
import { fetchThemesInfo, fetchAvailableLanguages, fetchTextInfo } from '../data/fetch.js';
import { applyTheme } from './applyTheme.js';

// Retrieve DOM elements
const form = document.getElementsByTagName('form')[0];
const themeSelect = form.querySelector('select[name="theme"]');
const languageSelect = form.querySelector('select[name="language"]');
const title = document.getElementsByTagName('h1')[0];
const themeText = form.querySelector('label[for="theme"]');
const submitBtn = form.getElementsByTagName('button')[0];

let language = getLanguage();

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

function translateTexts() {
    fetchTextInfo('options', (texts) => {
        title.textContent = texts.title[language];
        themeText.textContent = texts.theme[language];
        submitBtn.textContent = texts.save[language];
        console.log(getLanguage());
    });
}

populateThemes();
populateLanguages();
form.appendChild(fragment);
translateTexts();

form.addEventListener('submit', (e) => {
    e.preventDefault();
    setTheme(themeSelect.value);
    applyTheme(themeSelect.value);
    setLanguage(languageSelect.value);
    language = getLanguage();
    translateTexts();
});