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
};

export function requestGetAllPerformers() {
    return json(fetch(`${backend}/performers/all`, createGetProps()));
}

export function requestGetPerformerIdByName(name) {
    return json(fetch(`${backend}/performers/v2/search/?name=${name}`, createGetProps()));
}

export function requestGetSongById(id) {
    return json(fetch(`${backend}/songs/${id}`, createGetProps()));
}

export function requestPostSong(song) {
    return json(fetch(`${backend}/songs`, createPostProps(song)));
}

export function requestEditSong(song) {
    return json(fetch(`${backend}/songs`, createPutProps(song)));
}

export function requestDeleteSong(id) {
    return json(fetch(`${backend}/songs/${id}`, createDeleteProps()));
}

export function requestHydrateChords(input) {
    return json(fetch(`${backend}/chord/hydrate`, createPostProps(input)));
}

export function requestPostChords(chords) {
    return Promise.all(
        chords.map(chord => json(fetch(`${backend}/chord`, createPostProps(chord))))
    );
}

export function requestGetPrettyHistory(history) {
    return json(fetch(`${backend}/history/pretty?historyId=${history.id}`, createGetProps()));
}

export function requestApplyHistory(historyId, songId) {
    return json(fetch(`${backend}/history/apply?historyId=${historyId}&songId=${songId}`,
        createGetProps()));
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

function json(promise) {
    return promise.then(checkStatus).then(res => res.json())
}