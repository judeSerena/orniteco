import { selectLevel, getPoints, pointsNecessary, getLanguage } from '../controller/settings.js'
import { fetchTextInfo } from '../data/fetch.js';

// Retrieve the level buttons
const levelsContainer = document.getElementsByClassName('lvl-nav')[0];
const levels = levelsContainer.getElementsByTagName('div');
// To translate
const title = document.getElementsByTagName('h1')[0];
const subtitle = document.getElementsByTagName('h2')[0];

const language = getLanguage();

levelsContainer.addEventListener('click', e => {
    if (e.target.tagName === 'A'){
        // Levels get shown on-screen with index 1, but we operate with them in index 0
        selectLevel(parseInt(e.target.textContent) - 1);
    }
});

function translateTexts() {
    fetchTextInfo('levels', (texts) => {
        title.textContent = texts.title[language];
        subtitle.textContent = texts.subtitle[language];
    });
}

// Unblock levels >1 depending on the amount of points
function unlockLevels() {
    for (let i = 0; i < levels.length; i++) {
        if(getPoints() >= pointsNecessary(i)) {
            levels[i].classList.remove('disabledLink');
        }
    }
}

translateTexts();
unlockLevels();