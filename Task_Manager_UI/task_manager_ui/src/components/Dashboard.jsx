import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import Items from "./Items";

function Dashboard() {
    const [items, setItems] = useState([]);
    const [inputText, setText] = useState({
        title: "",
        description:"",
    });
    

    const navigate=useNavigate();

    function handleChange(event) {
        const {name,value}= event.target

        setText(prevItems => {
            return {...prevItems, [name]:value}
        })
    }

    useEffect(() => {
        axios.get("http://localhost:3000/dashboard", { withCredentials: true })
            .then(res => {
                if (!res.data.success) {
                    navigate("/")
                } else {
                    setItems(res.data.tasks);
                }
            })
            .catch(() => navigate("/"))
    }, [])

    async function handleClick(event) {
        event.preventDefault();

        const data= await axios.post("http://localhost:3000/dashboard", inputText, { withCredentials: true });
        if (data) {
            setItems(prevItems => {
                return([...prevItems, inputText])
            })
            setText({ title: "", description: "" })
            
        } 
    }

   async function handleLogout() {
      const logout=  await axios.post("http://localhost:3000/logout",{}, { withCredentials: true } );
      if (logout) {
        navigate("/");
      } 
    }

    return(<div className="dash-container">
        <nav>
            <h1>Task Manager</h1>
            <button onClick={handleLogout} className="btn">Logout</button>
        </nav>
        <form action="">
            <div className="input-group">
                <input onChange={handleChange} type="text" name="title" id="title" value={inputText.title} placeholder="Title..."/>
                <textarea onChange={handleChange} name="description" id="description" value={inputText.description} placeholder="Enter your task😌"></textarea>
            </div>
            <button type="submit" onClick={handleClick}>Add</button>
        </form>
        <hr />
        <div className="button-group">
            <button>All</button>
            <button>Active</button>
            <button>Completed</button>
        </div>

        {items.map((item,index) => <Items key={index} title={item.title} description={item.description} />)}
    </div>)
}

export default Dashboard;