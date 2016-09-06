import Action from "../global/actions";
import * as api from "../global/api";
import LocalStorage from "../util/LocalStorage";
import ajaxInitializer from "../config/AjaxInitializer";
import "whatwg-fetch";

const storage = new LocalStorage();

export function authLogoutUser() {
    storage.removeJwtToken();
    ajaxInitializer();
    return {
        type: Action.AUTH_LOGOUT_USER
    };
}

export function authLoginUser(user) {
    return {
        type: Action.AUTH_LOGIN_USER,
        user
    };
}

export function authUser(authData) {
    const props = {
        dataType: "json",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        method: "post",
        body: JSON.stringify(authData)
    };
    return function (dispatch) {
        return fetch(`${api.auth}/signin`, props)
            .then(checkStatus)
            .then(res => res.json())
            .then(result => {
                storage.setJwtToken(result.jwtToken);
                ajaxInitializer();
                dispatch(authGetUserAsync())
            })
            .catch(error => {
                console.error(error);
                dispatch(authLogoutUser());
            })
    };
}

export function authGetUserAsync() {
    var jwtToken = storage.getJwtToken();
    if (!jwtToken) {
        return authLogoutUser();
    }

    const props = {
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        },
        dataType: "json"
    };
    return function (dispatch) {
        return fetch(`${api.auth}/me`, props)
            .then(checkStatus)
            .then(res => res.json())
            .then(result => {
                dispatch(authLoginUser({
                    username: result.name,
                    authorities: result.authorities,
                    facebookLink: result.facebookLink,
                    facebookUserId: result.facebookUserId
                }))
            })
            .catch(error => {
                    console.error(error);
                    dispatch(authLogoutUser());
                }
            )
    };
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
