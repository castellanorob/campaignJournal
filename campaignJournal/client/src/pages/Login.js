import React, { useContext, useState } from "react";
import axios from "axios";
import {useNavigate} from 'react-router-dom'
import { AuthContext } from "../helpers/AuthContext";
import ForgotPassword from "../Forms/ForgotPassword";
import tome_img from "../resources/tome_img.png";


function Login() {
  const [userInfo, setUserInfo] = useState("");
  const [password, setPassword] = useState("");
  const [isForgotPasswordPopupOpen, setForgotPasswordPopupOpen] = useState(false);
  const { setAuthState } = useContext(AuthContext);

  let navigate = useNavigate();

  const login = () => {
    const data = { userInfo: userInfo, password: password };
    axios.post("http://localhost:3001/Users/login", data).then((response) => {
      if(response.data.error){
        alert(response.data.error);
      }else{
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("userId", response.data.user.id);
        localStorage.setItem("username", response.data.user.username);
        localStorage.setItem("icon", response.data.user.icon);
        localStorage.setItem("email", response.data.user.email);
        setAuthState({
            username: response.data.user.username,
            id: response.data.user.id,
            status: true,
        });
        
        navigate("/");
      }
    });
  };

  const handleForgotPassword = (event) => {
    event.stopPropagation();
    setForgotPasswordPopupOpen(true);
  }

  const handleResetPasswordRequest = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if(!emailPattern.test(email)){
      alert("Please enter a valid email address");
    }else{

      console.log(`Email submitted: ${email}`);
      axios.post(`http://localhost:3001/Users/forgotPassword`, {email: email})
      .then((response) => {
        if(response.data.error){
          alert(response.data.error);
        }else{
          alert("Password reset has been sent. Please check your email and follow the link provided to reset your password");
          closeForgotPasswordPopup();
        }
      })
      .catch((error) =>{
        //TODO create ClientErrorLogging router to log client side errors
        //Add post requests to other pages in order to log client side errors
//        axios.post("http://localhost:3001/ClientErrorLogging");
        alert(error);
      });
    }
  }

  const closeForgotPasswordPopup = () => {
    setForgotPasswordPopupOpen(false);
  }

  return (
    <div className="loginContainer" style={{ backgroundImage: `url(${tome_img})` }}>
      <div className="loginForms">
      <label>Username or email:</label>

      <input
        type="text"
        placeholder="Username..."
        onChange={(event) => {
          setUserInfo(event.target.value);
        }}
      />
      <label>Password:</label>
      <input
        type="password"
        placeholder="Password..."
        onChange={(event) => {
          setPassword(event.target.value);
        }}
      />

      <div className="loginButtonContainer">
      <button onClick={login}> Login </button>
      </div>

      <div className="forgotPasswordButtonContainer">
        <button onClick={(event) => handleForgotPassword(event)}> Forgot password </button>
      </div>
      <ForgotPassword
        isOpen={isForgotPasswordPopupOpen}
        onClose={closeForgotPasswordPopup}
        onSubmit={handleResetPasswordRequest}
      />
      </div>
    </div>
  );
}

export default Login;