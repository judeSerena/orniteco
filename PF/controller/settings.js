function sumPoints(amount) {
    const points = localStorage.getItem('points') ? localStorage.getItem('points') : 0;
    localStorage.setItem('points', parseInt(points) + amount);
}

function getPoints() {
    const points = localStorage.getItem('points') ? localStorage.getItem('points') : 0;
    return parseInt(points);
}

export { sumPoints, getPoints };