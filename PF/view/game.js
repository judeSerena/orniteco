import { genQuestionCandidates } from '../controller/genQuestionCandidates.js';
import { fetchRecordings } from '../data/fetch.js'
import { sumPoints, getPoints, pointsNecessary, getSelectedLevel } from '../controller/settings.js';

// Settings for recording fetching.
////////////////////////////////////////////////// TO-DO: make settings editable by user?
////////////////////////////////////////////////// TO-DO: load audio element hidden in html, then unhide it once its loaded
const minQuality = 'c';
const minDuration = 5;
const maxDuration = 10;
const language = 'ca';
const level = getSelectedLevel();
const pointsPerCorrectAnswer = 10;
let correctOption = '';

// Retrieve DOM elements
const pointBar = document.getElementsByClassName('point-bar')[0];
const feedbackBar = document.getElementById('feedbackBar');
const feedbackMessage = feedbackBar.getElementsByTagName('p')[0];
const nextQuestionBtn = feedbackBar.getElementsByTagName('a')[0];
const levelTitle = document.querySelector('header h2');
const audioElement = document.getElementsByTagName('audio')[0];
const questionContainer = document.getElementsByClassName('question')[0];
const answerContainer = questionContainer.getElementsByClassName('answers')[0];
const answerButtons = document.querySelectorAll('.answers a');
const answerButtonsTexts = document.querySelectorAll('.answers a p');
const answerButtonsImgs = document.querySelectorAll('.answers a img');

function loadBackground(level) {
    // Background images must be saved with 0.2 opacity and named starting with index 0
    document.body.style.backgroundImage = `url(\"./data/imgs/lvls/${level}.jpg\")`;
    document.body.style.backgroundBlendMode = 'multiply';
    console.log(document.body.style.backgroundImage);
}

loadBackground(level);

function updatePointBar() {
    pointBar.textContent = getPoints();
}

// Reset the content of the answer feedback bar and the color of the body
function resetFeedback() {
    feedbackMessage.innerHTML = '';
    nextQuestionBtn.hidden = true;
    document.body.className = '';
    questionContainer.classList.remove('incorrect');
    questionContainer.classList.remove('correct');
}

// Enable or disable clickability of the answer buttons
function changeAnswerClickability(on) {
    if (on === true) {
        for (const button of answerButtons) {
            button.classList.remove('disabledLink');
        }
    } else {
        for (const button of answerButtons) {
            button.classList.add('disabledLink');
        }
    }
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

        resetFeedback();
        changeAnswerClickability(true);

        // Save the correct option's name for the feedback
        correctOption = birdChoices[0].name[language];

        /* Random choice order, stored in a sepparate array so that we know that the correct option
        is always at answerButtons[0] even if they are displayed in random order on the page.*/
        const choiceOrder = [0, 1, 2].sort(() => Math.random() - 0.5);

        // Load names and images into the answer buttons
        for(let i = 0; i < answerButtons.length; i++) {
            answerButtonsTexts[choiceOrder[i]].textContent = birdChoices[i].name[language];
            answerButtons[choiceOrder[i]].setAttribute('data-correct', i === 0 ? 'yes' : 'no');
            // Randomly choose 1 out of 2 possible images for each bird (files named "bird 1.jpg" and "bird 2.jpg")
            answerButtonsImgs[choiceOrder[i]].src = `./data/imgs/${birdChoices[i].name.sci} ${Math.floor(Math.random() * 2) + 1}.jpg`;
        }
    })
}

function correctFeedback() {
    feedbackMessage.innerHTML = 'Correcte!';
    nextQuestionBtn.hidden = false;
    document.body.className = 'correct';
    questionContainer.classList.remove('correct');
}

function incorrectFeedback() {
    feedbackMessage.innerHTML = `La resposta correcta era <b>${correctOption}</b>.`;
    nextQuestionBtn.hidden = false;
    document.body.className = 'incorrect';
    questionContainer.classList.remove('incorrect');
}

function givePoints() {
    console.log(pointsNecessary(level + 1));
    if (getPoints() + pointsPerCorrectAnswer <= pointsNecessary(level + 1)) {
        feedbackMessage.innerHTML += ' +10 punts.';
        sumPoints(10);
        updatePointBar();
    }
}

function correctAnswer() {
    correctFeedback();
    givePoints();
    changeAnswerClickability(false);
}

function incorrectAnswer() {
    incorrectFeedback();
    changeAnswerClickability(false);
}

answerContainer.addEventListener('click', e => {
    if (e.target.tagName !== 'div'){
        /* Correct choice button is the one at index 0.
        There are both a <p> and an <img> inside of a <a>, but only the <a> has the attribute
        data-correct, so if we want to be able to click on <p> or <img> and get the feedback as
        well, we need to check for the parent node too.
        */
        if (e.target.dataset.correct === 'yes' || e.target.parentNode.dataset.correct === 'yes') {
            correctAnswer();
        } else {
            incorrectAnswer();
        }
    }
});

nextQuestionBtn.addEventListener('click', () => {
    genQuestionCandidates(level, drawQuestion);
});

levelTitle.textContent = `Nivell ${level + 1}`
genQuestionCandidates(level, drawQuestion);
updatePointBar();