import { setTheme, getLanguage, setLanguage, getTheme, getPoints, pointsNecessary } from '../controller/settings.js'
import { fetchThemesInfo, fetchAvailableLanguages, fetchTextInfo } from '../data/fetch.js';
import { applyTheme } from './applyTheme.js';

// Retrieve DOM elements
const form = document.getElementsByTagName('form')[0];
const themeSelect = form.querySelector('select[name="theme"]');
const languageSelect = form.querySelector('select[name="language"]');
const title = document.getElementsByTagName('h1')[0];
const themeText = form.querySelector('label[for="theme"]');
const back = document.getElementsByClassName('back')[0];

let language = getLanguage();

const fragment = new DocumentFragment();


// Populate the theme <select> with the theme options available in the data
function populateThemes() {
    // Fetch the themes array
    fetchThemesInfo((themes) => {
        for(let i = 0; i < themes.length; i++) {
            // Only put the theme inside the select if it is unlocked by level
            if(getPoints() >= pointsNecessary(themes[i].unlockAtLevel)) {
                console.log(getPoints());
                const option = document.createElement('option');
                option.value = themes[i].id;
                option.textContent = themes[i].name[language];

                // If this is the option that the user saved last time, show it already selected
                if (getTheme() === themes[i].id) { option.selected = true; }

                themeSelect.appendChild(option);
            }
        }
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

            // If this is the option that the user saved last time, show it already selected
            if (getLanguage() === languageCodes[i]) { option.selected = true; }

            languageSelect.appendChild(option);
        }
    });
};

function translateTexts() {
    fetchTextInfo('options', (texts) => {
        title.textContent = texts.title[language];
        themeText.textContent = texts.theme[language];
        back.textContent = texts.back[language];
    });
}

populateThemes();
populateLanguages();
form.appendChild(fragment);
translateTexts();

themeSelect.addEventListener('change', (e) => {
    console.log(e.target.value);
    setTheme(e.target.value);
    applyTheme(e.target.value);
});

languageSelect.addEventListener('change', (e) => {
    setLanguage(languageSelect.value);
    language = getLanguage();
    translateTexts();
})