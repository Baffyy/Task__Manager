import react, {useState} from "react";
import { useNavigate } from "react-router-dom";

function Button(props) {
    return(

<div className="button-group">
    <button onClick={() => props.setFilter("all")}>All</button>
    <button onClick={() => props.setFilter("active")}>Active</button>
    <button onClick={() => props.setFilter("completed")}>Completed</button>
</div>)
}

export default Button;