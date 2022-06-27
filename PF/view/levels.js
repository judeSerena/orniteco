import { selectLevel, getPoints, pointsNecessary } from '../controller/settings.js'

// Retrieve the level buttons
const levelsContainer = document.getElementsByClassName('lvl-nav')[0];
const levels = levelsContainer.getElementsByTagName('div');

levelsContainer.addEventListener('click', e => {
    if (e.target.tagName === 'A'){
        // Levels get shown on-screen with index 1, but we operate with them in index 0
        selectLevel(parseInt(e.target.textContent) - 1);
    }
});

// Unblock levels >1 depending on the amount of points
function unlockLevels() {
    for (let i = 0; i < levels.length; i++) {
        if(getPoints() >= pointsNecessary(i)) {
            levels[i].classList.remove('disabledLink');
        }
    }
}

unlockLevels();