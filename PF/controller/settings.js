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

export { selectLevel, getSelectedLevel, sumPoints, getPoints };