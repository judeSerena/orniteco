/*
XENO-CANTO API DOCS
https://xeno-canto.org/explore/api
https://xeno-canto.org/help/search
*/

export { fetchRecordings, fetchLevelInfo, fetchThemeInfo };

/**
 * Asynchronously fetches recording(s) data for a bird and sends it into the provided function.
 * @param {string} bird Bird to fetch recording(s) data for.
 * @param {string} minQuality Minimum quality of recording (quality levels go A > E).
 * @param {int} minDuration Minimum duration of recording in seconds.
 * @param {int} maxDuration Maximum duration of recording in seconds.
 * @param {function} callback Function to receive the fetched data as a parameter.
 */
async function fetchRecordings(bird = 'Inventus forfetchus', minQuality = 'c', minDuration = 5, maxDuration = 10, callback) {
    //q_gt:c = Quality_GreaterThan:C (recording quality levels go A > E)
    const endpoint = `https://xeno-canto.org/api/2/recordings?query=${bird.replace(/ /g, '+')}`
        + `+q_gt:${minQuality}`
        + `+len:${minDuration}-${maxDuration}`
        + `+type:song`;
    
    let response = await fetch(endpoint);

    if(response.ok) {
        let data = await response.json();
        callback(data.recordings);
    } else {
        informFetchError(response, this);
    }
}

/**
 * Asynchronously fetches level info from levels.json file.
 * @param {function} callback Function to receive the fetched data as a parameter.
 */
async function fetchLevelInfo(callback) {
    let response = await fetch('./data/levels.json');

    if(response.ok) {
        let data = await response.json();
        callback(data);
    } else {
        informFetchError(response, fetchLevelInfo);
    }
}

/**
 * Asynchronously fetches theme info from themes.json file. Returns theme object.
 * @param {function} callback Function to receive the fetched data as a parameter.
 */
 async function fetchThemeInfo(theme, callback) {
    let response = await fetch('./data/themes.json');

    if(response.ok) {
        let data = await response.json();
        callback(data.filter(t => t.name === theme)[0]);
    } else {
        informFetchError(response, fetchThemeInfo);
    }
}

function informFetchError(response, func) {
    console.error(
        `Error: could not fetch at \'${func.name}\'. ` +
        `Reason: ${response.status} (${response.statusText}).`
    );
}