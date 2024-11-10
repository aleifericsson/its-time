import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import './form.css'
import { sendMessage } from '../content/message';
import generateMessage from '../prompt-testing.js'
import { scrapePage } from '../content/wiki-scraper.js';
import { setStore } from '../content/storage.js';
import DontClose from './DontClose.jsx';
import Finished from './finished.jsx';

export default function form(){
    const [inputValue, setInputValue] = useState(''); // State for input value
    const [loading, setLoading] = useState(false); // State for input value
    const [finished, setFinished] = useState(false); // State for input value

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.message === "prompt") {
          setFinished(true)
        }
      });

  // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent page reload on submit
        const input = inputValue
        console.log('Submitted Value:', input); // Log the submitted value
        setInputValue(''); // Clear the input field after submit
        setStore({"prompt":input})
        setStore({"prompted":true})
        setLoading(true)
        sendMessage({message:"loading_animation_start"})
        scrapePage().then(result => {
            generateMessage(input, result).then(result => {
                sendMessage({message:"prompt", new_text: result['output-text'], explanations: result['explanation']})
            })
        })
    };

  // Handle change in input field
    const handleInputChange = (event) => {
        setInputValue(event.target.value); // Update state with input value
    };

    if (loading){
        if (finished){
            getAllStorage().then((result) => {
                return (<Finished prompt={result.prompt}/>)
            })
        }
        else{
            return(<DontClose />)
        }
    }
    else{
        return(
            <div className="form what">
                <form onSubmit={handleSubmit} className="what">
                    <img src="/images/question.png" alt="question-logo" className="form-image" />
                    <div>How do you want to change the past?
                    <input type="text" value={inputValue} onChange={handleInputChange} placeholder="What If...?" />
                    </div>
                    <button type="submit">Enter the timestream <img src="/images/Time-Travelling-Image.webp" width={30} alt="time travel image" /></button> {/* Submit button */}
                </form>
    
            </div>
        )
    }
}
