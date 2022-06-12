export { genQuestionCandidates };
import { fetchLevelInfo } from '../data/fetch.js';

function genQuestionCandidates(currentLevel = 0, callback) {
    /*
    TO-DO:
    * add fetching choice options from older levels too, with a lesser chance,
    and still not repeating any choices...
    */

    fetchLevelInfo((data) => {
        // There will be 3 choices, 1 correct (at index 0) and 2 wrong
        let choices = [,,,];
        let birds;
        // Get array of birds from the current level and reorder it randomly...
        birds = data[currentLevel].birds.slice().sort(() => Math.random() - 0.5);
        // ... so that we can extract 3 random choices from it
        choices = birds.slice(-3);

        callback(choices);
    });
}