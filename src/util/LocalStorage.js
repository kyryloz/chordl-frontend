const TOKEN_KEY = "jwtToken";

export default class LocalStorage {

    getJwtToken() {
        return localStorage.getItem(TOKEN_KEY);
    }

    setJwtToken(token) {
        localStorage.setItem(TOKEN_KEY, token);
    }

    removeJwtToken() {
        localStorage.removeItem(TOKEN_KEY);
    }
}