import react, {useState} from "react";
import { useNavigate } from "react-router-dom";

function Button() {
    const [filter, setFilter] = useState("all");

    return(

// In your JSX:
<div className="button-group">
    <button onClick={() => setFilter("all")}>All</button>
    <button onClick={() => setFilter("active")}>Active</button>
    <button onClick={() => setFilter("completed")}>Completed</button>
</div>)
}

export default Button;