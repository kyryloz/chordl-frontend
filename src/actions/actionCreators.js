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

export function authShowLoading() {
    return {
        type: Action.AUTH_LOGIN_LOADING
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

        dispatch(authShowLoading());

        return fetch(`${api.auth}/signin`, props)
            .then(checkStatus)
            .then(res => res.json())
            .then(result => {
                storage.setJwtToken(result.jwtToken);
                ajaxInitializer();
                dispatch(authGetUserAsync())
            })
            .catch(error => error.response.json()
                .then((json) => {
                    console.error("Get user error", json);
                    dispatch(authLogoutUser());
                })
            )
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
                dispatch(authLoginUser(createUser(result)))
            })
            .catch(error => error.response.json()
                .then((json) => {
                    console.error("Get user error", json);
                    dispatch(authLogoutUser());
                })
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

function createUser(userDto) {
    return {
        username: userDto.name,
        authorities: userDto.authorities,
        isAdmin: userDto.authorities.indexOf("ROLE_ADMIN") >= 0
    };
}
