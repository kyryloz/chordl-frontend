const TOKEN_KEY = "jwtToken";

export default class AuthStore {

    getJwtToken() {
        return localStorage.getItem(TOKEN_KEY);
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