export function validateTitle(title, returnBool) {
    const length = title.length;
    if (length > 60) return (returnBool ? false : 'error');
    else if (length > 1) return (returnBool ? true : 'success');
    else if (length > 0 || length > 60) return (returnBool ? false : 'error');
}

export function validateLyrics(lyrics, returnBool) {
    const length = lyrics.length;
    if (length > 1) return (returnBool ? true : 'success');
    else if (length > 0) return (returnBool ? false : 'error');
}

export function validatePerformer(name, exists, returnBool) {
    const length = name.length;
    if (length > 60) return (returnBool ? false : 'error');
    else if (length > 1) return exists ? (returnBool ? true : 'success') : (returnBool ? false : "warning");
    else if (length > 0 || length > 60) return (returnBool ? false : 'error');
}