// Function to check if a tab Id is already in the dictionnary or no.
const isPresent = (tabId, dict) => {
    for (const key of Object.keys(dict)) {
        if (dict[key]["ids"].has(tabId)) {
            return key;
        }
    }
    return false;
}

export {isPresent};