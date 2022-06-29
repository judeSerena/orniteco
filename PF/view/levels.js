import { selectLevel, getPoints, pointsNecessary, getLanguage } from '../controller/settings.js'
import { fetchLevelInfo, fetchTextInfo } from '../data/fetch.js';

// Retrieve the level buttons
const levelsContainer = document.getElementsByClassName('lvl-nav')[0];
// To translate
const title = document.getElementsByTagName('h1')[0];
const subtitle = document.getElementsByTagName('h2')[0];
const back = document.getElementsByClassName('back')[0];

const fragment = new DocumentFragment();

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
        back.textContent = texts.back[language];
    });
}


// Populate the level <nav> with as many levels as available in levels.json
function populateLevels() {
    // Fetch the level array
    fetchLevelInfo((levels) => {
        for(let i = 0; i < levels.length; i++) {
            const div = document.createElement('div');
            div.classList.add('neumorphic');
            div.classList.add('btn');
            
            if(getPoints() <= pointsNecessary(i)) { div.classList.add('disabledLink'); }

            const link = document.createElement('a');
            link.classList.add('title');
            link.href = "./game.html";
            link.textContent = i + 1;

            div.appendChild(link);
            levelsContainer.appendChild(div);
        }

        document.appendChild(fragment);
    });
};


translateTexts();
populateLevels();