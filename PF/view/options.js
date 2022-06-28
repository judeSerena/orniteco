import { setTheme, getLanguage } from '../controller/settings.js'
import { fetchThemesInfo } from '../data/fetch.js';
import { applyTheme } from './applyTheme.js';

// Retrieve DOM elements
const form = document.getElementsByTagName('form')[0];
const themeSelect = form.querySelector('select[name="theme"]');

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

populateThemes();
form.appendChild(fragment);


form.addEventListener('submit', (e) => {
    e.preventDefault();
    setTheme(themeSelect.value);
    applyTheme(themeSelect.value)
});