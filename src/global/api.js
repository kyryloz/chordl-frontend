import "whatwg-fetch";
import LocalStorage from "../util/LocalStorage";
const storage = new LocalStorage();

const backend = '/api';

export default {
    performers: `${backend}/performers`,
    songs: `${backend}/songs`,
    search: `${backend}/search/`,
    index: `${backend}/index`,
    featured: `${backend}/featured`,
    auth: `${backend}/auth`,
    history: `${backend}/history`,
    chord: `${backend}/chord`
};

export function getAllPerformers() {
    return fetch(`${backend}/performers/all`, createGetProps())
        .then(checkStatus)
        .then(res => res.json());
}

export function getPerformerIdByName(name) {
    return fetch(`${backend}/performers/v2/search/?name=${name}`, createGetProps())
        .then(checkStatus)
        .then(res => res.json());
}

export function submitNewSong(song) {
    return fetch(`${backend}/songs`, createPostProps(song))
        .then(checkStatus)
        .then(res => res.json());
}

export function hydrateChords(input) {
    return fetch(`${backend}/chord/hydrate`, createPostProps(input))
        .then(checkStatus)
        .then(res => res.json());
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response
    } else {
        var error = new Error(response.statusText);
        error.response = response;
        throw error;
    }
}


function createGetProps() {
    const props = {
        dataType: "json",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        method: "get"
    };

    applyBearer(props);

    return props;
}

function createPostProps(data) {
    const props = {
        dataType: "json",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        method: "post",
        body: JSON.stringify(data)
    };

    applyBearer(props);

    return props;
}

function applyBearer(props) {
    const jwtToken = storage.getJwtToken();

    if (jwtToken) {
        props.headers["Authorization"] = `Bearer ${jwtToken}`;
    }
}