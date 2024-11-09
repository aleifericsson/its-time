import { render } from "./content/qol.js";
import { generateRoot, injectReact } from "./content/ext-qol.jsx";
import { handleMessages } from "./content/message.js";
import { getAllStorage, updateSettingsToContent } from "./content/storage.js";
import Popup from "./content/Popup.jsx";

console.log("bruh")

const root = generateRoot()
render(document.body, root)

updateSettingsToContent()
handleMessages()

getAllStorage().then((result) =>{
    if (result.popupVisible) {injectReact(Popup, root,{startx:300,starty:500})}
})

