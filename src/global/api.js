import "whatwg-fetch";
import LocalStorage from "../util/LocalStorage";

const storage = new LocalStorage();

const backend = '/api';

export default {
    performers: `${backend}/performers`,
    songs: `${backend}/songs`,
    search: `${backend}/search/`,
    index: `${backend}/index`,
    featured: `${backend}/featured`
};

export function requestGetAllPerformers() {
    return json(fetch(`${backend}/performers/all`, get()));
}

export function requestGetPerformerIdByName(name) {
    return json(fetch(`${backend}/performers/v2/search/?name=${name}`, get()));
}

export function requestGetSongById(id) {
    return json(fetch(`${backend}/songs/${id}`, get()));
}

export function requestPostSong(song) {
    return json(fetch(`${backend}/songs`, post(song)));
}

export function requestEditSong(song) {
    return json(fetch(`${backend}/songs`, put(song)));
}

export function requestDeleteSong(id) {
    return json(fetch(`${backend}/songs/${id}`, del()));
}

export function requestHydrateChords(input) {
    return json(fetch(`${backend}/chord/hydrate`, post(input)));
}

export function requestPostChords(chords) {
    return Promise.all(
        chords.map(chord => json(fetch(`${backend}/chord`, post(chord))))
    );
}

export function requestGetPrettyHistory(history) {
    return json(fetch(`${backend}/history/pretty?historyId=${history.id}`, get()));
}

export function requestApplyHistory(historyId, songId) {
    return json(fetch(`${backend}/history/apply?historyId=${historyId}&songId=${songId}`, get()));
}

export function requestAuthUser(authData) {
    return json(fetch(`${backend}/auth/signin`, post(authData)));
}

export function requestGetMe() {
    return json(fetch(`${backend}/auth/me`, get()));
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


function get() {
    return createAuthorizedRequestProps("get");
}

function put(data) {
    return createAuthorizedRequestProps("put", data);
}

function post(data) {
    return createAuthorizedRequestProps("post", data);
}

function del() {
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