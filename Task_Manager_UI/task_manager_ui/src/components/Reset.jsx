import React, {useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
        
        
function Reset() {
    const [passwordData, setPasswordData] = useState({
        newpwd: "",
        repwd: "",
    });
    const [isAccepted, setIsAccepted] = useState(true);

    const navigate= useNavigate();

    function handleChange(event) {
        const {name, value} = event.target;
        setPasswordData(prevValue => {return {...prevValue, [name]: value}})
    }

    async function handleClick(event) {
        event.preventDefault();

        if (passwordData.newpwd !== passwordData.repwd) {
            setIsAccepted(false);
            return;
        }    
        
        try {
            const result = await axios.post("/reset", passwordData, {withCredentials: true})
        if (result.data.success) {
            navigate("/");
            console.log(result.data.success)
        } else {
            return ("Wrong password") 
        }
        } catch(error) {
            setIsAccepted(false)
            console.error(error);
        }
        
    }


    return(<form className="form">
        <div className="reset-group">
            <h2>Change Your Password</h2>
            <p>Enter a new password below to change your password</p>
            <div className="box">
                <label htmlFor="Email">New password</label>
                <input type="password" name="newpwd" id="pwd" onChange={handleChange} value={passwordData.newpwd} style={{ border: isAccepted? "" : "1px solid red" }}/>
            </div>
            <div className="box">
                <label htmlFor="Email">Re-enter new password</label>
                <input type="password" name="repwd" id="pwd" onChange={handleChange} value={passwordData.repwd} style={{ border: isAccepted? "" : "1px solid red" }}/>
            </div>
            <p className="loginError" style={{display: isAccepted? "none" : "inline-block"}}>Passwords do not match</p>
            <button type="submit" className="btn" onClick={handleClick}>Submit</button>
        </div>
    </form>)
}

export default Reset;
