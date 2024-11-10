import { sendMessage } from "../content/message"
import './stop.css'

export default function Finished({prompt}){

    return(
        <div className="form what" >
            <form className="what">
                <img src="/images/time.jpg" alt="time" className="form-image" />
                <div className="message">You have changed the past!</div>
                <div className="message prompt">{prompt}</div>
                <div className="message">Now you must live with your changes</div>
                <div className="message">{"(jk, refresh or press reset to revert to the present)"}</div>
                <button onClick={() => {
                    sendMessage({message: "reset"})
                }}>Reset</button>
            </form>
        </div>
    )
}