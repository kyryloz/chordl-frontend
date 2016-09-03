import Action from "../global/actions";

export function authLogoutUser() {
    return {
        type: Action.AUTH_LOGOUT_USER
    };
}

export function authLoginUser(user, token) {
    return {
        type: Action.AUTH_LOGIN_USER,
        user,
        token
    };
}