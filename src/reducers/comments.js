function postComments(state = [], action) {
    switch (action.type) {
        case "ADD_COMMENT":
            return [...state, {
                user: action.author,
                text: action.comment
            }];
        case "REMOVE_COMMENT":
            return [
                ...state.splice(0, action.i),
                ...state.splice(action.i + 1)
            ];
        default:
            return state;
    }
}


function comments(state = [], action) {
    if (typeof action.postId !== "undefined") {
        return {
            ...state,
            [action.postId]: postComments(state[action.postId], action)
        }
    }
    return state;
}

// function comments(state = [], action) {
//     switch (action.type) {
//         case "ADD_COMMENT":
//             console.log(state)
//
//
//             const i = state.indexOf(action.postId);
//
//             return [state.slice(0, i).push({
//                 author: action.author,
//                 comment: action.comment
//             }).push(state.slice(i + 1))
//             ];
//             break;
//         default:
//             return state;
//     }
// }

export default comments;