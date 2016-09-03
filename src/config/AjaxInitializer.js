import * as $ from "jquery";
import AuthStore from "../store/authStore";
const auth = new AuthStore;

export default function init() {
    $.ajaxSetup({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth.createAuthorizationTokenHeader()}`
        },
    });
}