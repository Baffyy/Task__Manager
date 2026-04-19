import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
    const [inputText, setText] = useState({
        email:"",
        password:""
    })

    const navigate= useNavigate();

    async function handleClick (event) {
        try {
            await axios.post("http://localhost:3000/login", inputText)
        } catch(error) {
            console.error(error);
            res.status(501).send("Could not implement request")
        }

        event.preventDefault();
    }

    function handleRegister() {
        navigate("/register")
    }

    function handleChange(event) {
        const {name,value} = event.target;

        setText(prevValue => {
            return{...prevValue, [name]: value}
        })
    }
    
    return(
    <form className="form">
        <div className="header">
        <h1>Welcome to the TaskManager</h1>
        </div>

        <div className="container">
            <div className="login">
                <h2>Sign In</h2>
                <div className="login-box">
                <label htmlFor="email">Email</label>
                <input type="text" onChange={handleChange} name="email" id="email" value={inputText.email}/>
                </div>
                <div className="login-box">
                <label htmlFor="password">Password</label>
                <input type="password" onChange={handleChange} name="password" id="password" value={inputText.password}/>
                </div>
                <button className="btn" onClick={handleClick} type="submit">Login</button>
            </div>

            <hr className="line"/>OR <hr className="line"/>

            <div className="register">
                <h2>Register if new</h2>
                <button onClick={handleRegister} className="btn" type="submit">Sign up</button>
            </div>
        </div>
    </form>)
}

export default Login;