import { getLanguage } from '../controller/settings.js'
import { fetchTextInfo } from '../data/fetch.js';

// To translate
const subtitle = document.getElementsByTagName('h2')[0];
const start = document.querySelector('.index-nav a:nth-of-type(1)');
const about = document.querySelector('.index-nav a:nth-of-type(2)');
const settings = document.querySelector('.index-nav a:nth-of-type(3)');

const language = getLanguage();

function translateTexts() {
    fetchTextInfo('index', (texts) => {
        subtitle.textContent = texts.subtitle[language];
        start.textContent = texts.start[language];
        about.textContent = texts.about[language];
        settings.textContent = texts.settings[language];
    });
}

translateTexts();