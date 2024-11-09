import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import './form.css'
import { sendMessage } from '../content/message';
import generateMessage from '../prompt-testing.js'

export default function form(){
    const [inputValue, setInputValue] = useState(''); // State for input value

  // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent page reload on submit
        const input = inputValue
        console.log('Submitted Value:', input); // Log the submitted value
        setInputValue(''); // Clear the input field after submit
        sendMessage({message:"loading_animation_start"})
        generateMessage(input).then(result => {
            sendMessage({message:"proompt", new_text: result})
            console.log(result)
        })
    };

  // Handle change in input field
    const handleInputChange = (event) => {
        setInputValue(event.target.value); // Update state with input value
    };

    
    return(
        <div className="form">
            <form onSubmit={handleSubmit}>
                <img src="https://www.frlib.org/question-mark-2.png/@@images/image.png" alt="quest-mark" className="form-image" />
                <label>What do you want to change about this page?
                <input type="text" value={inputValue} onChange={handleInputChange} placeholder="What If...?" />
                </label>
                <button type="submit">Submit</button> {/* Submit button */}
            </form>

        </div>
    )
}
