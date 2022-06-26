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

export { selectLevel, getSelectedLevel, sumPoints, getPoints, pointsNecessary };