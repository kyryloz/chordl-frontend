export function validateTitle(title, returnBool) {
    if (containsIllegalChars(title)) {
        return returnBool ? false : 'error';
    }

    const length = title.trim().length;
    if (length > 60) return (returnBool ? false : 'error');
    else if (length > 1) return (returnBool ? true : 'success');
    else if (length > 0 || length > 60) return (returnBool ? false : 'error');
}

export function validateLyrics(lyrics, returnBool) {
    if (containsIllegalChars(lyrics)) {
        return returnBool ? false : 'error';
    }

    const length = lyrics.trim().length;
    if (length > 1) return (returnBool ? true : 'success');
    else if (length > 0) return (returnBool ? false : 'error');
}

export function validatePerformer(name, exists, returnBool) {
    if (containsIllegalChars(name)) {
        return returnBool ? false : 'error';
    }

    const length = name.trim().length;
    if (length > 60) return (returnBool ? false : 'error');
    else if (length > 1) return exists ? (returnBool ? true : 'success') : (returnBool ? false : "warning");
    else if (length > 0 || length > 60) return (returnBool ? false : 'error');
}

export function validateChord(diagram = "", returnBool) {
    if (!diagram) {
        return (returnBool ? false : 'warning');
    }

    const length = diagram.trim().length;

    if (length < 6) return (returnBool ? false : 'warning');

    const pattern = /^[0-9xX]{6}$/;
    if (pattern.test(diagram)) {
        return (returnBool ? true : 'success');
    } else {
        return (returnBool ? false : 'error')
    }
}

function containsIllegalChars(text) {
    return false;
    // var illegal = /[\\<>\^`{}]/i;
    // return illegal.test(text);
}