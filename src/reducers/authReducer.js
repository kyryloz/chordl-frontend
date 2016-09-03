function authenticate(state = {}, action) {
    switch (action.type) {
        case "AUTHENTICATE":
            return state;
        default:
            return state;
    }
}

export default authenticate;