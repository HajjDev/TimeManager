// Function to check if a tab Id is already in the dictionnary or no.
const isPresent = (tabId, dict) => {
    console.log(dict);
    for (const key of Object.keys(dict)) {
        console.log(key);
        if (dict[key]["ids"].has(tabId)) {
            return key;
        }
    }
    return false;
}

export {isPresent};