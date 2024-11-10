import { getRoot, injectReact, isRendered, removeReact } from "./ext-qol";
import Popup from "./Popup.jsx";
import LoadingAnim from "./loadingAnim.jsx";
import { setStore, updateSettingsToContent } from "./storage.js";
import { changeText } from "./wiki-scraper.js";

let popup_pos = {x: 300, y: 500}

function sendMessage(message){
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, message);
  });
  }

const handleMessages = () => {
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.message == "toggle_popup"){ //{message, popup_visible}
        if(message.popup_visible){
            injectReact(Popup, getRoot(),{startx:popup_pos.x,starty:popup_pos.y})
            setStore({"popupVisible":true})
        }
        else{
            removeReact()
            setStore({"popupVisible":false})
        }
    }
    if (message.message == "toggle_detection"){ //{message, detecting}  
        if (message.detecting){
            setStore({"detecting":true})
        }
        else{
            setStore({"detecting":false})
        }
        updateSettingsToContent()
    }
    if (message.message == "loading_animation_start"){ //{message}
        injectReact(LoadingAnim, getRoot())
        setStore({"loadingAnim":true})
    }
    if (message.message == "prompt"){ //{message, new_text}
        console.log(message.new_text)
        changeText(message.new_text)
    }
    })
}

export {sendMessage, handleMessages}