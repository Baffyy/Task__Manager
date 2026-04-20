import React, {useState} from "react";
import Items from "./Items";

function Dashboard() {
    const [items, setItems] = useState([]);
    const [inputText, setText] = useState({
        title: "",
        description:"",
    });

    function handleChange(event) {
        const {name,value}= event.target

        setText(prevItems => {
            return {...prevItems, [name]:value}
        })
    }

    function handleClick(event) {
        event.preventDefault();

        setItems(prevItems => {
            return([...prevItems, inputText])
        })
        setText({ title: "", description: "" })
    }

    return(<div className="dash-container">
        <nav>
            <h1>Task Manager</h1>
            <button className="btn">Logout</button>
        </nav>
        <form action="">
            <div className="input-group">
                <input onChange={handleChange} type="text" name="title" id="title" value={inputText.title}/>
                <textarea onChange={handleChange} name="description" id="description" value={inputText.description}></textarea>
            </div>
            <button type="submit" onClick={handleClick}>Add</button>
        </form>
        <hr />
        <div className="button-group">
            <button>All</button>
            <button>Active</button>
            <button>Completed</button>
        </div>

        {items.map(item => <Items title={item.title} description={item.description} />)}
    </div>)
}

export default Dashboard;