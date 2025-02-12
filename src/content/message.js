import { getRoot, injectReact, isRendered, removeReact } from "./ext-qol";
import LoadingAnim from "./loadingAnim.jsx";
import resetAnim from "./resetAnim.jsx";
import { setStore } from "./storage.js";
import { changeText } from "./wiki-scraper.js";

function sendMessage(message){
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        console.log("message")
        chrome.tabs.sendMessage(tabs[0].id, message);
  });
  }

const handleMessages = () => {
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.message === "loading_animation_start"){ //{message}
        injectReact(LoadingAnim, getRoot())
    }
    if (message.message === "prompt"){ //{message, new_text}
        console.log(message.new_text)
        changeText(message.new_text, message.explanations)
        setStore({"new_text":message.new_text})
    }
    if(message.message === "reset"){
        injectReact(resetAnim, getRoot())
    }
    })
}

export {sendMessage, handleMessages}