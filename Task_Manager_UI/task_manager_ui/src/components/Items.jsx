import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Items(props) {
    const navigate=useNavigate();

   async function done() {
         const data = await axios.post("http://localhost:3000/done",{id: props.id}, {withCredentials: true}) 
         if (data) {
            {props.done(props.id)};
            navigate("/dashboard")
         }
    }

    async function remove() {

    }

    return(<div className="item">
       
        <div>
        <h3>{props.title}</h3>
        <p>{props.description}</p>
        </div>
       

        <div className="item-btn">
            <button onClick={done}>✅</button>
            <button onClick={remove}>❌</button>
        </div>
    </div>)
}

export default Items;