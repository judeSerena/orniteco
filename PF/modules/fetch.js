/*
XENO-CANTO API DOCS
https://xeno-canto.org/explore/api
https://xeno-canto.org/help/search
*/

export { fetchRecordings, fetchLevelInfo };

async function fetchRecordings(bird = 'Inventus forfetchus', minQuality = 'c', minDuration = 5, maxDuration = 10) {
    //q_gt:c = Quality_GreaterThan:C (recording quality levels go A > E)
    const endpoint = `https://xeno-canto.org/api/2/recordings?query=${bird.replace(/ /g, '+')}`
        + `+q_gt:${minQuality}`
        + `+len:${minDuration}-${maxDuration}`
        + `+type:song`;
    
    let response = await fetch(endpoint);

    if(response.ok) {
        let data = await response.json();
        console.log(data.recordings);
    } else {
        informFetchError(response, this);
    }
}

async function fetchLevelInfo(level = 0) {
    let response = await fetch('./modules/levels.json');

    if(response.ok) {
        let data = await response.json();
        console.log(data[level]);
    } else {
        informFetchError(response, this);
    }
}

function informFetchError(response, func) {
    console.error(`Error: could not fetch at \'${func.name}\'.` +
      `Reason: ${response.status} (${response.statusText}).`);
}