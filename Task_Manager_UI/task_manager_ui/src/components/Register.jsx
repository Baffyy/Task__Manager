import React, {useState} from "react";
import axios from "axios";


function Register() {
    const [inputText, setText] = useState({
        email:"",
        password:""
    })

    async function handleClick (event) {
        try {
            await axios.post("http://localhost:3000/register", inputText)
        } catch(error) {
            console.error(error);
            res.status(501).send("Could not implement request")
        }

        event.preventDefault();
    }

    function handleChange(event) {
        const {name,value} = event.target;

        setText(prevValue => {
            return{...prevValue, [name]: value}
        })
    }
    
    return(
    <form className="form">
        <div className="register-container">
            <div className="main-register">
                <h2>Register</h2>
                <div className="box">
                    <label htmlFor="email">Email</label>
                    <input type="text" onChange={handleChange} name="email" id="email" value={inputText.email}/>
                </div>
                <div className="box">
                    <label htmlFor="password">Password</label>
                    <input type="password" onChange={handleChange} name="password" id="password" value={inputText.password}/>
                </div>
                <button className="btn" onClick={handleClick} type="submit">Register</button>
            </div>
        </div>
    </form>)
}

export default Register;