// Saving and retrieving settings and game state, to and from localStorage

function selectLevel(level) {
    localStorage.setItem('level', level);
}

function getSelectedLevel() {
    const level = localStorage.getItem('level') ? localStorage.getItem('level') : 0;
    return parseInt(level);
}

function sumPoints(amount) {
    const points = localStorage.getItem('points') ? localStorage.getItem('points') : 0;
    localStorage.setItem('points', parseInt(points) + amount);
}

function getPoints() {
    const points = localStorage.getItem('points') ? localStorage.getItem('points') : 0;
    return parseInt(points);
}

// Determine the number of points necessary to unlock each level
function pointsNecessary(level) {
    return level * (50 * level);
}


// ---------------------- Editable by user ----------------------

function setTheme(theme) {
    localStorage.setItem('theme', theme);
}

function getTheme() {
    const theme = localStorage.getItem('theme') ? localStorage.getItem('theme') : 'light';
    return theme;
}

function setLanguage(language) {
    localStorage.setItem('language', language);
}

function getLanguage() {
    const language = localStorage.getItem('language') ? localStorage.getItem('language') : 'ca';
    return language;
}


export {
    selectLevel,
    getSelectedLevel,
    sumPoints,
    getPoints,
    pointsNecessary,
    setTheme,
    getTheme,
    setLanguage,
    getLanguage
};