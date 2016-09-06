import * as $ from "jquery";
import LocalStorage from "../util/LocalStorage";
const storage = new LocalStorage();

export default function init() {
    var jwtToken = storage.getJwtToken();
    if (jwtToken) {
        $.ajaxSetup({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
        });
    } else {
        $.ajaxSetup({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });
    }
}