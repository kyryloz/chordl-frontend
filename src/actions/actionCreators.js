import Action from "../global/actions";
import * as api from "../api";
import AuthStore from "../store/authStore";
import ajaxInitializer from "../config/AjaxInitializer";

const authStore = new AuthStore;

export function authLogoutUser() {
    authStore.removeJwtToken();
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

export function authLoginError() {
    return {
        type: Action.AUTH_LOGIN_USER,
        user: {
            username: "ERROR LOGIN"
        },
        token: "token"
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
            .then(res => res.json())
            .then(result => {
                authStore.setJwtToken(result.jwtToken);
                ajaxInitializer();
                dispatch(authGetUserAsync())
            })
            .catch(error => {
                console.error(error);
                dispatch(authLoginError());
            })
    };
}

export function authGetUserAsync() {
    if (!authStore.getJwtToken()) {
        return authLogoutUser();
    }

    const props = {
        headers: {
            'Authorization': `Bearer ${authStore.getJwtToken()}`
        },
        dataType: "json"
    };
    return function (dispatch) {
        return fetch(`${api.auth}/me`, props)
            .then(res => res.json())
            .then(result => {
                dispatch(authLoginUser({
                    username: result.name
                }))
            })
            .catch(error => {
                    console.error(error);
                    return dispatch(authLoginError());
                }
            )
    };
}
