const TOKEN_KEY = "jwtToken";

export default class AuthStore {

    getJwtToken() {
        var token = localStorage.getItem(TOKEN_KEY);
        return token;
    }

    setJwtToken(token) {
        localStorage.setItem(TOKEN_KEY, token);
    }

    removeJwtToken() {
        localStorage.removeItem(TOKEN_KEY);
    }

    createAuthorizationTokenHeader() {
        var token = this.getJwtToken();
        if (token) {
            return token;
        } else {
            return "";
        }
    }
}