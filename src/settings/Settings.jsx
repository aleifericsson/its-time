import { useEffect, useState } from "react";
import './Settings.css'
import { sendMessage } from "../content/message.js";
import { getAllStorage } from "../content/storage.js";



export default function Settings({props}){
    const [popup_visible, set_visible] = useState(false); // Default to false
    const [detecting, set_detecting] = useState(false);   // Default to false

    const togglePopup = (event) => {
        set_visible(!popup_visible)
        sendMessage({message:"toggle_popup", popup_visible: !popup_visible })
    }
    const toggleDetection = (event) => {
        set_detecting(!detecting)
        sendMessage({message:"toggle_detection", detecting: !detecting })
    }
    const startAnimation = () => {
        sendMessage({message:"loading_animation_start"})
    }

    useEffect(() => {
        const loadSettings = async () => {
            const all_settings = await getAllStorage();
            if (all_settings.popupVisible !== undefined) {
                set_visible(all_settings.popupVisible);
            }
            if (all_settings.detecting !== undefined) {
                set_detecting(all_settings.detecting);
            }
        };
        loadSettings();
    }, []); // Empty dependency array ensures this runs once on mount

    return(
        <div className="settings">
            <div className="toggle-box">
                <input
                    type="checkbox"
                    id="show"
                    className="checkbox"
                    checked={popup_visible}
                    onChange={togglePopup}
                />                
                <label className="switch" htmlFor="show"></label>
                <div>Show Popup?</div>
            </div>
            <div className="toggle-box">
                <input
                    type="checkbox"
                    id="detect"
                    className="checkbox"
                    checked={detecting}
                    onChange={toggleDetection}
                />                
                <label className="switch" htmlFor="detect"></label>
                <div>{"Detect Popup? (Press P)"}</div>
            </div>
            <div className="animation_button">
                <input
                    type="button"
                    id="start-animation"
                    value="Start Animation"
                    aria-label="Start Animation"
                    onClick={startAnimation}
                />
            </div>
        </div>
    )
}
