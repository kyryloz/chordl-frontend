const TOKEN_KEY = "jwtToken";

export default class Store {

    getJwtToken() {
        var token = sessionStorage.getItem(TOKEN_KEY);
        console.log("GET GET TOKEN", token);
        return token;
    }

    setJwtToken(token) {
        console.log("SET TOKEN", token);
        sessionStorage.setItem(TOKEN_KEY, token);
    }

    removeJwtToken() {
        sessionStorage.removeItem(TOKEN_KEY);
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