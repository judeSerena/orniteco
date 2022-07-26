import { setTheme, getLanguage, setLanguage, getTheme, getFontOn, setFontOn, getPoints, pointsNecessary } from './settings.js'
import { fetchThemesInfo, fetchAvailableLanguages, fetchTextInfo } from './fetch.js';
import { applyTheme, applyDislexiaFont } from './applyTheme.js';

// Retrieve DOM elements
const title = document.getElementsByTagName('h1')[0];
const back = document.getElementsByClassName('back')[0];

const form = document.getElementsByTagName('form')[0];
const themeText = form.querySelector('label[for="theme"]');
const themeSelect = form.querySelector('select[name="theme"]');
const languageSelect = form.querySelector('select[name="language"]');
const dyslexiaText = form.querySelector('label[for="dyslexicFont"]');
const dyslexiaSelect = form.querySelector('select[name="dyslexicFont"]');
const no = dyslexiaSelect.getElementsByTagName('option')[0];
const yes = dyslexiaSelect.getElementsByTagName('option')[1];


let language = getLanguage();

const fragment = new DocumentFragment();


// Populate the theme <select> with the theme options available in the data
function populateThemes() {
    // Fetch the themes array
    fetchThemesInfo((themes) => {
        // Delete the previous <option>s since they might be in a different language
        themeSelect.innerHTML = '';

        for(let i = 0; i < themes.length; i++) {
            // Only put the theme inside the select if it is unlocked by level
            if(getPoints() >= pointsNecessary(themes[i].unlockAtLevel)) {
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
        dyslexiaText.textContent = texts.dyslexicFont[language];
        no.textContent = texts.no[language];
        yes.textContent = texts.yes[language];
    });
    populateThemes();
}

translateTexts();
populateLanguages();
if (getFontOn() === 'yes') { yes.selected = true };
form.appendChild(fragment);

themeSelect.addEventListener('change', (e) => {
    setTheme(e.target.value);
    applyTheme(e.target.value);
});

languageSelect.addEventListener('change', (e) => {
    setLanguage(e.target.value);
    language = getLanguage();
    translateTexts();
});

dyslexiaSelect.addEventListener('change', (e) => {
    setFontOn(e.target.value);
    applyDislexiaFont(e.target.value);
});