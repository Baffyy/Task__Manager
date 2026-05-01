import React from "react";
import axios from "axios";

function Items(props) {
    const navigate=useNavigate();

   async function done() {
        console.log("done clicked")
        console.log(props.id)
         const data = await axios.post("https://task-manager-fibo.onrender.com/done",{id: props.id}, {withCredentials: true}) 
         console.log("response:", data)
         if (data) {
            props.done(props.id);
         }
    }

    async function del() {

        const data= await axios.post("https://task-manager-fibo.onrender.com/delete", {id: props.id}, {withCredentials: true});
        if(data) {
            props.delete(props.id);
        }
    }

    return(<div className="item">
       
        <div>
        <h3>{props.title}</h3>
        <p>{props.description}</p>
        </div>
       

        <div className="item-btn">
            <button onClick={done}>✅</button>
            <button onClick={del}>❌</button>
        </div>
    </div>)
}

export default Items;