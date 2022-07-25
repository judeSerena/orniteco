import { genQuestion } from '../controller/genQuestionCandidates.js';
import { fetchRecordings, fetchTextInfo } from '../data/fetch.js'
import { sumPoints, getPoints, pointsNecessary, getSelectedLevel, getLanguage } from '../controller/settings.js';

let popupShown = false;

// Settings for recording fetching.
const minQuality = 'c';
const minDuration = 5;
const maxDuration = 10;
const language = getLanguage();
const level = getSelectedLevel();
const pointsPerCorrectAnswer = 10;
let correctOption = '';

// Retrieve DOM elements
const pointBar = document.getElementsByClassName('point-bar')[0];
const pointTotal = document.getElementsByClassName('point-total')[0];

const feedbackBar = document.getElementById('feedbackBar');
const feedbackMessage = feedbackBar.getElementsByTagName('p')[0];

const questionContainer = document.getElementsByClassName('question')[0];
const audioElement = questionContainer.getElementsByTagName('audio')[0];
const answerContainer = questionContainer.getElementsByClassName('answers')[0];
const answerButtons = answerContainer.querySelectorAll('.answers button');
const answerButtonsCommonNames = answerContainer.querySelectorAll('.answers button .common-name');
const answerButtonsScientificNames = answerContainer.querySelectorAll('.answers button .scientific-name');
const answerButtonsImgs = answerContainer.querySelectorAll('.answers button img');
const popup = document.getElementById('popup');
const closePopupBtn = popup.getElementsByClassName('close')[0];
const topBar = document.getElementsByClassName('game-top-bar')[0];

// To translate
const title = document.querySelector('header h2');
const question = document.querySelector('main p:first-child');
const back = topBar.querySelector('ul li:nth-child(1) a');
const settings = topBar.querySelector('ul li:nth-child(2) a');
const points = document.getElementById('pointLabel');
const nextLevel = document.getElementById('progressLabel');
const nextQuestionBtn = feedbackBar.getElementsByTagName('button')[0];
const congrats = popup.getElementsByTagName('h2')[0];
const unlocked = document.getElementById('popupTitle');
const backToLevels = popup.getElementsByTagName('a')[0];
const share = document.getElementById('share');
const twitterBtn = document.getElementById('twitter');
const facebookBtn = document.getElementById('facebook');
const mailBtn = document.getElementById('mail');
const copyBtn = document.getElementById('copy');
/* These need to be editable later: we want to make a single fetch of the translation and store the
result, instead of fetching the text each time we run the feedback functions */
let incorrectText, correctText, hintText, twitterUrl, facebookUrl, mailUrl, copyText;

function adaptTextToUrl(text) {
    return text.replace(/ /g, '%20').replace(/#/g, '%23');
}

function translateTexts() {
    fetchTextInfo('game', (texts) => {
        title.textContent = `${texts.title[language]} ${level + 1}`;
        question.textContent = texts.question[language];
        back.textContent = texts.back[language];
        settings.textContent = texts.settings[language];
        points.textContent = texts.points[language];
        nextLevel.textContent = texts.nextLevel[language];
        nextQuestionBtn.textContent = texts.next[language];
        congrats.textContent = texts.congrats[language];
        unlocked.textContent = texts.unlocked[language];
        backToLevels.textContent = texts.backToLevels[language];
        share.textContent = texts.share[language];

        // urls with composed messages (except for facebook) for the share buttons
        twitterUrl = "https://twitter.com/intent/tweet?text="
            + `${adaptTextToUrl(texts.message1[language])}`
            + `%20${level + 1}%20`
            + `${adaptTextToUrl(texts.message2[language])}`;
        facebookUrl = "https://www.facebook.com/sharer/sharer.php?u="; //////////////////////// TO-DO: AFEGIR LINK DARRERE
        mailUrl = "mailto:?subject=Orniteco&"
            + `body=${adaptTextToUrl(texts.message1[language])}`
            + `%20${level + 1}%20`
            + `${adaptTextToUrl(texts.message2[language])}`;
        copyText = `${texts.message1[language]}`
            + ` ${level + 1} `
            + `${texts.message2[language]}`;

        // Add aria labels to the icon buttons so that they can be read by screen readers
        twitterBtn.ariaLabel = `${texts.ariaShare[language]} Twitter`;
        facebookBtn.ariaLabel = `${texts.ariaShare[language]} Facebook`;
        mailBtn.ariaLabel = `${texts.ariaShare[language]} ${texts.ariaMail[language]}`;
        copyBtn.ariaLabel = texts.ariaCopy[language];

        incorrectText = texts.incorrect[language];
        correctText = texts.correct[language];
        hintText = texts.hint[language];
    });
}

function loadBackground(level) {
    // Background images must be saved with 0.2 opacity and named starting with index 0
    document.body.style.backgroundImage = `url(\"./data/imgs/lvls/${level}.jpg\")`;
    document.body.style.backgroundBlendMode = 'multiply';
}

loadBackground(level);

function redrawPoints() {
    /*
    100% of bar = points until next level
    A% of B = A / B * 100
    Then we need to subtract from A the points we already needed to unlock the current level
    */
    let width = (getPoints() >= pointsNecessary(level + 1)) ?
        100 : Math.floor((getPoints() - pointsNecessary(level)) / pointsNecessary(level + 1) * 100);
    pointBar.style.width = width + '%';

    // Make progress readable by screen readers
    pointBar.ariaValueNow = width;
    
    // By removing and re-adding the class with the animation, it is played again
    pointBar.classList.remove('point-bar-glow');
    pointTotal.classList.remove('point-text-glow');
    /* This next line is needed to trigger a DOM reflow. Otherwise the animation doesn't restart
    when we add the class */
    void pointBar.offsetWidth;
    void pointTotal.offsetWidth;
    pointBar.classList.add('point-bar-glow');
    pointTotal.classList.add('point-text-glow');

    pointTotal.textContent = getPoints();
}

// Reset the content of the answer feedback bar and the color of the body
function resetFeedback(hint) {
    feedbackMessage.innerHTML = `<b>${hintText}</b>: ${hint[language]}`;
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
            button.disabled = false;
        }
    } else {
        for (const button of answerButtons) {
            button.classList.add('disabledLink');
            button.disabled = true;
        }
    }
}

/**
 * Draws game interface (with question and 3 possible answers) in view/game.html, from an array of 3 bird names,
 * the first of which is the correct option.
 * @param {String[]} birdChoices Array of 3 objects representing birds.
 */
function drawQuestion(birdChoices, hint) {
    // Get recording from first bird (correct choice) in choices.
    // Draw the question via callback when we get the data.
    fetchRecordings(birdChoices[0].name.sci, minQuality, minDuration, maxDuration, (recordings) => {
        // Choose a random recording from the ones available for this species and load it into the <audio> tag
        const randomIndex = Math.floor(Math.random() * recordings.length);
        audioElement.setAttribute('src', recordings[randomIndex].file);

        resetFeedback(hint);
        changeAnswerClickability(true);

        // Save the correct option's name for the feedback
        correctOption = birdChoices[0].name[language];

        /* Random choice order, stored in a sepparate array so that we know that the correct option
        is always at answerButtons[0] even if they are displayed in random order on the page.*/
        const choiceOrder = [0, 1, 2].sort(() => Math.random() - 0.5);

        // Load names and images into the answer buttons
        for(let i = 0; i < answerButtons.length; i++) {
            answerButtonsCommonNames[choiceOrder[i]].textContent = birdChoices[i].name[language];
            answerButtonsScientificNames[choiceOrder[i]].textContent = birdChoices[i].name.sci;
            answerButtons[choiceOrder[i]].setAttribute('data-correct', i === 0 ? 'yes' : 'no');
            // Randomly choose 1 out of 2 possible images for each bird (files named "bird 1.jpg" and "bird 2.jpg")
            answerButtonsImgs[choiceOrder[i]].src = `./data/imgs/${birdChoices[i].name.sci} ${Math.floor(Math.random() * 2) + 1}.jpg`;
        }
    })
}

function showPopup() {
    popup.hidden = false;
    topBar.classList.add('disabledLink');
    nextQuestionBtn.disabled = true;
    nextQuestionBtn.classList.add('disabledLink');
    popupShown = true;
    backToLevels.focus();
}

function hidePopup() {
    popup.hidden = true;
    topBar.classList.remove('disabledLink');
    nextQuestionBtn.disabled = false;
    nextQuestionBtn.classList.remove('disabledLink');
}

function correctFeedback() {
    feedbackMessage.innerHTML = correctText;
    nextQuestionBtn.hidden = false;
    document.body.className = 'correct';
    questionContainer.classList.add('correct');
}

function incorrectFeedback() {
    feedbackMessage.innerHTML = `${incorrectText} <b>${correctOption}</b>.`;
    nextQuestionBtn.hidden = false;
    document.body.className = 'incorrect';
    questionContainer.classList.add('incorrect');
}

function givePoints() {
    if (getPoints() + pointsPerCorrectAnswer <= pointsNecessary(level + 1)) {
        sumPoints(10);
        redrawPoints();
    }
    if (!popupShown && getPoints() >= pointsNecessary(level + 1)) {
        showPopup();
        popupShown = true;
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
    if (e.target.tagName !== 'DIV'){
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

closePopupBtn.addEventListener('click', () => {
    hidePopup();
});

twitterBtn.addEventListener('click', () => {
    open(twitterUrl, '_blank');
});

facebookBtn.addEventListener('click', () => {
    open(facebookUrl, '_blank');
});

mailBtn.addEventListener('click', () => {
    open(mailUrl, '_blank');
});

copyBtn.addEventListener('click', () => {
    try {
        navigator.clipboard.writeText(copyText);
        copyBtn.innerHTML = '<svg viewBox=\"0 0 24 24\"><path d=\"M2,12L10,20L22,6\"/></svg>';
    } catch(err) {
        copyBtn.innerHTML = '<svg viewBox=\"0 0 24 24\"><line x1=\"3\" y1=\"3\" x2=\"21\" y2=\"21\"/><line x1=\"3\" y1=\"21\" x2=\"21\" y2=\"3\"/></svg>';
    }
});

nextQuestionBtn.addEventListener('click', () => {
    genQuestion(level, drawQuestion);
});

genQuestion(level, drawQuestion);
translateTexts();
redrawPoints();