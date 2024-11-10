import { sendMessage } from "../content/message"

export default function Finished({prompt}){

    return(
        <div>
            <div>You have changed the past!</div>
            <div>{prompt}</div>
            <div>Now you must live with your changes</div>
            <div>{"(jk, refresh or press reset to revert to the present)"}</div>
            <button onClick={() => {
                sendMessage({message: "reset"})
            }}>Reset</button>
        </div>
    )
}