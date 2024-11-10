import React from 'react';
import ReactDOM from 'react-dom/client';
import { addClass, addClasses, create, write } from './qol.js';

let root_render = null
let root = null

function injectReact(Component, root_ele, props={}) {
    if (!root_render){
      root_render = ReactDOM.createRoot(root_ele)
    }
    root_render.render(
      <React.StrictMode>
        <Component props={props}/>
      </React.StrictMode>,
    )
  }

function removeReact(){
  if(root_render){  
    try{
      root_render.unmount()
    }
    catch{

    }
    root_render = null
  }
}

function generateRoot(){  
  const rot = create("div")
  addClasses(rot, ["react-root","plus-ample"])
  root = rot
  return rot
}

function isRendered(){
  return root_render ? true : false
}

function getRoot(){
  return root
}

function isDevMode(){
  if (import.meta.env.MODE === 'development') return true
  else return false
}

function getCurrentPage() { //ONLY AVAILABLE FROM SETTINGS SCRIPT
  return new Promise((resolve, reject) => {
    // Query the active tab in the last focused window
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      const tab = tabs[0]; // Get the first tab object in the array
      if (tab && tab.url) {
        resolve(tab.url);
      } else {
        reject(new Error("No active tab with a URL found"));
      }
    });
  });
}

export {injectReact, removeReact, generateRoot, isRendered, getRoot, isDevMode, getCurrentPage}