//ONSCREEN POPUP NOT THE SETTINGS POPUP

import { useEffect, useState } from 'react'
import { removeReact } from './ext-qol.jsx'
import './popup.css'
import { detect, find, getRect, undetect } from './qol.js'

const detecting = false;
const speed = 3;

export default function Popup({props}){ //props: {startx, starty}
    const [x, setX] = useState(props.startx)
    const [y, setY] = useState(props.starty)
    const [classes, setClasses] = useState("popup alfa")

    const closePopup = () =>{
        removeReact()
    }

    const setPos = (x,y) => {
        setX(x)
        setY(y)
    }

    const getPos = () => {
        return {x, y}
    }

    const handleKeyPresses = (e) => {
        if (e.key === "ArrowUp") {
            setY((y)=>{return y-speed})
          } else if (e.key === "ArrowDown") {
            setY((y)=>{return y+speed})
          } else if (e.key === "ArrowLeft") {
            setX((y)=>{return y-speed})
          } else if (e.key === "ArrowRight") {
            setX((y)=>{return y+speed})
          }
    }

    const startDrag = (e) => {
        e.preventDefault();
        detect(document.body, "mousemove", updateDrag)
        detect(document.body, "mouseup", stopDrag)
    }

    const updateDrag = (e) => {
        e.preventDefault();
        const rect = getRect(find(".popup.alfa"))
        setX(e.pageX)
        setY(e.pageY + rect.height/2) //it's + so that the popup moves down onto the mouse duh
    }
    const stopDrag = (e) => {
        e.preventDefault();
        undetect(document.body, "mousemove", updateDrag)
        undetect(document.body, "mouseup", stopDrag)
    }

    useEffect(() => {
        detect(document, "keydown", handleKeyPresses)
        detect(find(".top-bar.alfa"), "mousedown", startDrag)
    }, []); 

    return(
        <div className={classes}style={{left:x,top:y}}>
            <div className="top-bar alfa">
                <img className="close-icon" onClick={closePopup} src={ chrome.runtime.getURL('images/close.png')}></img>
            </div>
            <div className='popup-content'>
                Popup
            </div>
        </div>
    )
}