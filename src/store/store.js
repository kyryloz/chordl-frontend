const TOKEN_KEY = "jwtToken";

export default class Store {

    getJwtToken() {
        var token = localStorage.getItem(TOKEN_KEY);
        console.log("GET GET TOKEN", token);
        return token;
    }

    setJwtToken(token) {
        console.log("SET TOKEN", token);
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