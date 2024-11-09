import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './form.css'
import { sendMessage } from '../content/message';

export default function form(){
    const [inputValue, setInputValue] = useState(''); // State for input value
    const [submittedValue, setSubmittedValue] = useState(''); // State to store submitted value

  // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent page reload on submit
        setSubmittedValue(inputValue); // Store the submitted input value
        setInputValue(''); // Clear the input field after submit
        console.log('Submitted Value:', inputValue); // Log the submitted value
        sendMessage({message:"loading_animation_start"})
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
