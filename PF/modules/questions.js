export { generateQuestion };
import { fetchLevelInfo } from './fetch.js';

function generateQuestion(currentLevel = 0) {
    /*
    TO-DO:
    * Find way to add fetching choice options from older levels too, with a lesser chance,
    and still not repeating any choices...
    */

    fetchLevelInfo(currentLevel, (data) => {
        // There will be 3 choices, 1 correct (at index 0) and 2 wrong
        let choices = [,,,];
        let birds;

        console.log(choices);
        // Get array of birds from the current level and reorder it randomly...
        birds = data.birds.slice().sort(() => Math.random() - 0.5);

        // ... so that we can extract 3 random choices from it
        choices = birds.slice(-3);

        drawQuestion(choices);
    });
}

function drawQuestion(choices) {
    console.log(`Question: audio from ${choices[0].name.en}`);
    console.log(`Options:`);
    // Random choice order, stored in a sepparate array so that we can always
    // access the correct option at choices[0]
    const choiceOrder = [0, 1, 2].sort(() => Math.random() - 0.5);
    console.log(`A: ${choices[choiceOrder[0]].name.en}`);
    console.log(`B: ${choices[choiceOrder[1]].name.en}`);
    console.log(`C: ${choices[choiceOrder[2]].name.en}`);
}