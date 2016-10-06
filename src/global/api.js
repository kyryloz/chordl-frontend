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

export function requestGetAllPerformers() {
    return fetch(`${backend}/performers/all`, createGetProps())
        .then(checkStatus)
        .then(res => res.json());
}

export function requestGetPerformerIdByName(name) {
    return fetch(`${backend}/performers/v2/search/?name=${name}`, createGetProps())
        .then(checkStatus)
        .then(res => res.json());
}

export function requestGetSongById(id) {
    return fetch(`${backend}/songs/${id}`, createGetProps())
        .then(checkStatus)
        .then(res => res.json());
}

export function requestPostSong(song) {
    return fetch(`${backend}/songs`, createPostProps(song))
        .then(checkStatus)
        .then(res => res.json());
}

export function requestEditSong(song) {
    return fetch(`${backend}/songs`, createPutProps(song))
        .then(checkStatus)
        .then(res => res.json());
}

export function requestDeleteSong(id) {
    return fetch(`${backend}/songs/${id}`, createDeleteProps())
        .then(checkStatus)
        .then(res => res.json());
}

export function requestHydrateChords(input) {
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
    return createAuthorizedRequestProps("get");
}

function createPutProps(data) {
    return createAuthorizedRequestProps("put", data);
}

function createPostProps(data) {
    return createAuthorizedRequestProps("post", data);
}

function createDeleteProps() {
    return createAuthorizedRequestProps("delete");
}

function createAuthorizedRequestProps(method, data) {
    const props = {
        dataType: "json",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        method,
        body: data ? JSON.stringify(data) : null
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