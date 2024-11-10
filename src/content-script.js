import { render } from "./content/qol.js";
import { generateRoot, injectReact } from "./content/ext-qol.jsx";
import { handleMessages } from "./content/message.js";
import { getAllStorage, updateSettingsToContent } from "./content/storage.js";
import Popup from "./content/Popup.jsx";
import './prompt-testing.css';
import { handleMessages, sendMessage } from "./content/message.js";
import { clearStore, getAllStorage, setStore } from "./content/storage.js";
import { changeText } from "./content/wiki-scraper.js";

console.log("running")
clearStore()
/*
getAllStorage().then((result) => {
    if (result.new_text){
        changeText(new_text)
    }
})
*/

const root = generateRoot()
render(document.body, root)

handleMessages()
