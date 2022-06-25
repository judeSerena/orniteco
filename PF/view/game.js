import { genQuestionCandidates } from '../controller/genQuestionCandidates.js';
import { fetchRecordings } from '../data/fetch.js'

// Settings for recording fetching.
////////////////////////////////////////////////// TO-DO: make settings editable by user?
////////////////////////////////////////////////// TO-DO: load audio element hidden in html, then unhide it once its loaded
const minQuality = 'c';
const minDuration = 5;
const maxDuration = 10;
const language = 'ca';

// Retrieve DOM elements
const audioElement = document.getElementsByTagName('audio')[0];
const answerContainer = document.getElementsByClassName('answers')[0];
const answerButtons = document.querySelectorAll('.answers button');

/**
 * Draws game interface (with question and 3 possible answers) in view/game.html, from an array of 3 bird names,
 * the first of which is the correct option.
 * @param {String[]} choices Array of 3 objects representing birds.
 */
function drawQuestion(choices) {
    // Get recording from first bird (correct choice) in choices.
    // Draw the question via callback when we get the data.
    fetchRecordings(choices[0].name.sci, minQuality, minDuration, maxDuration, (recordings) => {
        // Choose a random recording from the ones available for this species and load it into the <audio> tag
        const randomIndex = Math.floor(Math.random() * recordings.length);
        audioElement.setAttribute('src', recordings[randomIndex].file);

        // Random choice order, stored in a sepparate array so that we can always
        // access the correct option at choices[0].
        const choiceOrder = [0, 1, 2].sort(() => Math.random() - 0.5);
        answerButtons[0].textContent = choices[choiceOrder[0]].name[language];
        // answerButtons[0].setAttribute('data-correct', 'yes');////////////////////////////////crec que no caldrà
        answerButtons[1].textContent = choices[choiceOrder[1]].name[language];
        answerButtons[2].textContent = choices[choiceOrder[2]].name[language];
        ///////////////////////////////////////////////////////////////////////////TO-DO: mostrar també imatges.
        //els DIVS han de contenir botó + image.
        //s'haurà d'arreglar els querySelector.
    })
}

/////////////////////////////////////////////////////////////////////////TO-DO: rebre nivell des de localstorage
//(hauré guardat el nivell a un arxiu levels.js enllaçat a levels.html)
//a levels.js també hauré de settejar exp a 0 si no es troba exp guardada a localstorage, i segons la exp, mostrar nivells desbloquejats
genQuestionCandidates(0, drawQuestion);

answerContainer.addEventListener('click', e => {
    if (e.target.classList.contains('btn')){
        // If the clicked button is the correct choice (index 0)...
        if (e.target === answerButtons[0]) {
            alert('correct');
            //suma exp i actualitza-la a localstorage, i mostra que és correcte, i genera nova pregunta si es clica botó de següent
        } else {
            alert('incorrect');
            //mostra que és incorrecte i genera nova pregunta si es clica botó de següent
        }
    }
});