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

function getCurrentPage() {
  return new Promise((resolve, reject) => {
    // Check if chrome.tabs API is available
    if (!chrome.tabs || !chrome.tabs.query) {
      console.error("chrome.tabs API is unavailable.");
      return reject("chrome.tabs API is not accessible.");
    }

    try {
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        if (chrome.runtime.lastError) {
          console.error("Chrome runtime error:", chrome.runtime.lastError);
          return reject("Failed to query tabs.");
        }
        const tab = tabs[0];
        if (tab && tab.url) {
          console.log("Tab URL:", tab.url);
          resolve(tab.url);
        } else {
          console.log("No active tab with a URL found.");
          reject("No active tab with a URL found.");
        }
      });
    } catch (error) {
      console.error("Unexpected error in getCurrentPage:", error);
      reject("Unexpected error occurred.");
    }
  });
}

export {injectReact, removeReact, generateRoot, isRendered, getRoot, isDevMode, getCurrentPage}