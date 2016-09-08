export function validateTitle(title, returnBool) {
    if (containsIllegalChars(title)) {
        return returnBool ? false : 'error';
    }

    const length = title.length;
    if (length > 60) return (returnBool ? false : 'error');
    else if (length > 1) return (returnBool ? true : 'success');
    else if (length > 0 || length > 60) return (returnBool ? false : 'error');
}

export function validateLyrics(lyrics, returnBool) {
    if (containsIllegalChars(lyrics)) {
        return returnBool ? false : 'error';
    }

    const length = lyrics.length;
    if (length > 1) return (returnBool ? true : 'success');
    else if (length > 0) return (returnBool ? false : 'error');
}

export function validatePerformer(name, exists, returnBool) {
    if (containsIllegalChars(name)) {
        return returnBool ? false : 'error';
    }

    const length = name.length;
    if (length > 60) return (returnBool ? false : 'error');
    else if (length > 1) return exists ? (returnBool ? true : 'success') : (returnBool ? false : "warning");
    else if (length > 0 || length > 60) return (returnBool ? false : 'error');
}

function containsIllegalChars(text) {
    var illegal = /[\\\/<>\^`{}]/i;
    return illegal.test(text);
}