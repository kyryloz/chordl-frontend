import Actions from "../global/actions";

export default function auth(state = {}, action) {
    switch (action.type) {
        case Actions.AUTH_LOGOUT_USER:
            return {
                loginLoading: false
            };
        case Actions.AUTH_LOGIN_USER:
            return {
                ...state,
                user: action.user,
                loginLoading: false
            };
        case Actions.AUTH_LOGIN_LOADING:
            return {
                ...state,
                loginLoading: true
            };
        default:
            return state;
    }
}
