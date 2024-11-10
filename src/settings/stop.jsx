import React from 'react';
import './stop.css'


export default function Stop(){
    return (
        <div className="form what">
            <form className="what">
                <img src="/images/stopwatch.png" alt="stop-logo" className="form-image" />
                <label className="stop">STOP!</label>
                <label className="message">This extension only works on wikipedia</label>
            </form>
        </div>
    )
}