import { getRoot, injectReact, isRendered, removeReact } from "./ext-qol";
import { detect, undetect } from "./qol";

const setStore = (key_obj) => { //key_obj example: {detecting: false}
    chrome.storage.local.set(key_obj)
}

const setSessionStore = (key_obj) => { //key_obj example: {detecting: false}
    chrome.storage.session.set(key_obj)
}

const clearStore =() =>{
    chrome.storage.local.clear();
}

const getStore = (key) => { // key example: "detecting"
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(key, (results) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError); // In case of an error
            } else {
                resolve(results); // Return the value for the key
            }
        });
    });
};

const getStoreSession = (key) => { // key example: "detecting"
    return new Promise((resolve, reject) => {
        chrome.storage.session.get(key, (results) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError); // In case of an error
            } else {
                resolve(results); // Return the value for the key
            }
        });
    });
};

const popup_detect = (e) => {
    if (e.key === "p") {
        if (isRendered()){
            removeReact()
            setStore({"popupVisible":false})
        } else{
            injectReact(Popup, getRoot(),{startx:popup_pos.x,starty:popup_pos.y})
            setStore({"popupVisible":true})
        }
    }
}

const updateSettingsToContent = () => {
    getStore(["detecting"]).then((result) => {  
        const detecting = result.detecting
        if (detecting !== undefined && detecting !== null) {
            detecting ? detect(document, "keydown", popup_detect) : undetect(document, "keydown", popup_detect);
        } else {
            console.log("Key 'detecting' is not set in storage.");
        }
    }).catch((error) => {
        console.error("Error accessing storage:", error);
    });
};


const getAllStorage = () => {
    
    return getStore({"prompted":"","prompt":""}) //currently all storage
        .then((result) => {
            return result;  // Result will contain the retrieved values
        })
        .catch((error) => {
            console.error("Error accessing storage:", error);
            return {}; // Return an empty object on error
        });
        
};

const getAllStorageSession = () => {
    return getStoreSession({"prompted":"","prompt":""}) //currently all storage
        .then((result) => {
            return result;  // Result will contain the retrieved values
        })
        .catch((error) => {
            console.error("Error accessing storage:", error);
            return {}; // Return an empty object on error
        });  
};

export { getAllStorage, setStore, clearStore}