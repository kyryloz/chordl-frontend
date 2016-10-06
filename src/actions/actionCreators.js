import Action from "../global/actions";
import {requestAuthUser, requestGetMe} from "../global/api";
import LocalStorage from "../util/LocalStorage";

const storage = new LocalStorage();

export function authLogoutUser() {
    storage.removeJwtToken();
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
    return function (dispatch) {

        dispatch(authShowLoading());

        return requestAuthUser(authData)
            .then(result => {
                storage.setJwtToken(result.jwtToken);
                dispatch(authGetUserAsync())
            })
            .catch(error => error.response.json()
                .then((json) => {
                    console.error("Get user error", json);
                    dispatch(authLogoutUser());
                })
            );
    };
}

export function authGetUserAsync() {
    var jwtToken = storage.getJwtToken();
    if (!jwtToken) {
        return authLogoutUser();
    }

    return function (dispatch) {
        return requestGetMe()
            .then(result => {
                dispatch(authLoginUser(createUser(result)))
            })
            .catch(error => error.response.json()
                .then((json) => {
                    console.error("Get user error", json);
                    dispatch(authLogoutUser());
                })
            );
    };
}

function createUser(userDto) {
    return {
        username: userDto.name,
        authorities: userDto.authorities,
        isAdmin: userDto.authorities.indexOf("ROLE_ADMIN") >= 0
    };
}
