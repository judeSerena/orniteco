import { genQuestionCandidates } from '../model/genQuestionCandidates.js';
import { fetchRecordings } from '../model/fetch.js'

// Settings for recording fetching.
////////////////////////////////////////////////// TO-DO: make settings editable by user?
const minQuality = 'c';
const minDuration = 5;
const maxDuration = 10;

// Retrieve DOM elements
const audio = document.getElementsByTagName('audio')[0];

genQuestionCandidates(0, drawQuestion);

/**
 * Draws game interface (with question and 3 possible answers) in view/game.html, from an array of 3 bird names,
 * the first of which is the correct option.
 * @param {String[]} choices Array of 3 objects representing birds.
 */
function drawQuestion(choices) {
    // Get recording from first bird (correct choice) in choices.
    // Draw the question via callback when we get the data.
    fetchRecordings(choices[0].name.sci, minQuality, minDuration, maxDuration, (recordings) => {
        console.log(`Question: audio from ${choices[0].name.en}`);

        console.log(recordings);
        // const randomIndex = Math.random() * recordings.length








        console.log(`Options:`);
        // Random choice order, stored in a sepparate array so that we can always
        // access the correct option at choices[0].
        const choiceOrder = [0, 1, 2].sort(() => Math.random() - 0.5);
        console.log(`A: ${choices[choiceOrder[0]].name.en}`);
        console.log(`B: ${choices[choiceOrder[1]].name.en}`);
        console.log(`C: ${choices[choiceOrder[2]].name.en}`);
    })
}

/**
 * Sets audio source to an audio DOM element.
 * @param {HTMLAudioElement} element
 * @param {String} url
 */
function setAudio(element, url) {
    element.setAttribute('src', url);

}