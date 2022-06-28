import { getLanguage } from '../controller/settings.js'
import { fetchTextInfo } from '../data/fetch.js';

// To translate
// const body = document.querySelector('.index-nav a:nth-of-type(1)');

const language = getLanguage();

function translateTexts() {
    fetchTextInfo('about', (texts) => {
        document.body.innerHTML = texts.body[language];
    });
}

translateTexts();