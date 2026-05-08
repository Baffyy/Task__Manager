import React, {useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function Forgot() {
    const [isEmail, setIsEmail] = useState("");
    const [isAccepted, setIsAccepted] = useState(true);

    const navigate= useNavigate();

    function handleChange(event) {
        const value = event.target.value;
        setIsEmail(value)
        console.log(value)
    }

    async function handleClick(event) {
        event.preventDefault();

        try {
            const result = await axios.post("/forgot", {email: isEmail}, {withCredentials: true})
        if (result.data.success) {
            navigate("/reset");
            console.log(result.data.success)
        } else {
            return ("Wrong email") 
        }
        } catch(error) {
            setIsAccepted(false)
            console.error(error);
        }
        
    }


    return(<form className="form">
        <div className="forgot_group">
            <h2>Forgot Password?</h2>
            <p>Enter the email used for your account</p>
            <div className="box">
                <label htmlFor="Email">Email</label>
                <input type="text" name="email" id="email" onChange={handleChange} value={isEmail} style={{ border: isAccepted? "" : "1px solid red" }} placeholder="Enter your email..."/>
            </div>
            <p className="loginError" style={{display: isAccepted? "none" : "inline-block"}}>Email does not exist</p>
            <button type="submit" className="btn" onClick={handleClick}>Submit</button>
        </div>
    </form>)
}

export default Forgot;