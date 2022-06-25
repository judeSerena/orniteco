import { selectLevel } from '../controller/settings.js'

// Retrieve the level buttons
const levelsContainer = document.getElementsByClassName('lvl-nav')[0];

levelsContainer.addEventListener('click', e => {
    if (e.target.classList.contains('btn')){
        // Levels get shown on-screen with index 1, but we operate with them in index 0
        selectLevel(parseInt(e.target.textContent) - 1);
    }
});