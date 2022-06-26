import { genQuestionCandidates } from '../controller/genQuestionCandidates.js';
import { fetchRecordings } from '../data/fetch.js'
import { sumPoints, getPoints, getSelectedLevel } from '../controller/settings.js';

// Settings for recording fetching.
////////////////////////////////////////////////// TO-DO: make settings editable by user?
////////////////////////////////////////////////// TO-DO: load audio element hidden in html, then unhide it once its loaded
const minQuality = 'c';
const minDuration = 5;
const maxDuration = 10;
const language = 'ca';
const level = getSelectedLevel();

// Retrieve DOM elements
const pointBar = document.getElementsByClassName('point-bar')[0];
const levelTitle = document.querySelector('.game-top-bar h2');
const audioElement = document.getElementsByTagName('audio')[0];
const answerContainer = document.getElementsByClassName('answers')[0];
const answerButtons = document.querySelectorAll('.answers a p');
const answerButtonsImgs = document.querySelectorAll('.answers a img');

function updatePointBar(){
    pointBar.textContent = getPoints();
}

/**
 * Draws game interface (with question and 3 possible answers) in view/game.html, from an array of 3 bird names,
 * the first of which is the correct option.
 * @param {String[]} birdChoices Array of 3 objects representing birds.
 */
function drawQuestion(birdChoices) {
    // Get recording from first bird (correct choice) in choices.
    // Draw the question via callback when we get the data.
    fetchRecordings(birdChoices[0].name.sci, minQuality, minDuration, maxDuration, (recordings) => {
        // Choose a random recording from the ones available for this species and load it into the <audio> tag
        const randomIndex = Math.floor(Math.random() * recordings.length);
        audioElement.setAttribute('src', recordings[randomIndex].file);

        /* Random choice order, stored in a sepparate array so that we know that the correct option
        is always at answerButtons[0] even if they are displayed in random order on the page.*/
        const choiceOrder = [0, 1, 2].sort(() => Math.random() - 0.5);
        
        for(let i = 0; i < answerButtons.length; i++) {
            answerButtons[choiceOrder[i]].textContent = birdChoices[i].name[language];
            answerButtons[choiceOrder[i]].setAttribute('data-correct', i === 0 ? 'yes' : 'no');
            // Randomly choose 1 out of 2 possible images for each bird (files named "bird 1.jpg" and "bird 2.jpg")
            answerButtonsImgs[choiceOrder[i]].src = `./data/imgs/${birdChoices[i].name.sci} ${Math.floor(Math.random() * 2) + 1}.jpg`;
        }
    })
}

levelTitle.textContent = `Nivell ${level + 1}`
genQuestionCandidates(level, drawQuestion);
updatePointBar();

answerContainer.addEventListener('click', e => {
    if (e.target.classList.contains('btn')){
        // Correct choice button is the one at index 0
        if (e.target.dataset.correct === 'yes') {
            alert('correct');
            sumPoints(10);
            updatePointBar();
            genQuestionCandidates(level, drawQuestion);
        } else {
            alert('incorrect');
            genQuestionCandidates(level, drawQuestion);
        }
    }
});