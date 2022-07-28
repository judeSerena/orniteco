export { genQuestion };
import { fetchLevelInfo } from './fetch.js';

/**
 * Get 2 random bird objects from the current level, a third bird object from either the level
 * just before the current one (50% chance) or any of the other past levels (50% chance) and a
 * random hint object, and pass them to the callback function.
 * @param {Int} currentLevel 
 * @param {Function} callback 
 */
function genQuestion(currentLevel, callback) {
    fetchLevelInfo((data) => {
        // There will be 3 choices
        ///////////////////////////////////////////////TO-DO: take choice number as parameter here
        // to have a player option for higher difficulty (more answer choices), rethink algorithm
        let choices = [,,,];
        let hint;
        let birds;

        if(currentLevel > 1) {
            // Get array of birds from the current level and reorder it randomly...
            birds = data[currentLevel].birds.sort(() => Math.random() - 0.5);
            // ... so that we can extract 2 random choices from it
            choices = birds.slice(-2);

            // Decide whether to extract the last bird from the lastest level or from another...
            const latestChance = Math.random();

            if(latestChance > 0.5) {
                // Reorder the birds from latest level to pick one randomly (the first one)
                choices.push(data[currentLevel - 1].birds.sort(() => Math.random() - 0.5)[0]);
            } else {
                /* Randomly decide which level to extract the last bird from, from 0 to 2 levels
                before current */
                const level = Math.floor(Math.random() * (currentLevel - 2));
                choices.push(data[level].birds.sort(() => Math.random() - 0.5)[0]);
            }

            /* Finally, reorder the final choices so that birds from earlier levels can also be at
            index 0 (game.js later treats choices[0] as the correct answer) */
            choices.sort(() => Math.random() - 0.5);

        } else if (currentLevel > 0) {
            /* Do the same thing, but we can only choose from the latest level now since there are
            no earlier levels than that */
            birds = data[currentLevel].birds.sort(() => Math.random() - 0.5);
            choices = birds.slice(-2);

            choices.push(data[currentLevel - 1].birds.sort(() => Math.random() - 0.5)[0]);

            choices.sort(() => Math.random() - 0.5);

        } else {
            // We are at level 0 (the first one), simply choose 3 birds from the current level
            birds = data[currentLevel].birds.sort(() => Math.random() - 0.5);
            choices = birds.slice(-3);

        }

        hint = data[currentLevel].hints.sort(() => Math.random() - 0.5)[0];

        callback(choices, hint);
    });
}