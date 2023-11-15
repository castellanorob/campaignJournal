import React, { useContext, useState } from "react";
import axios from "axios";
import {useNavigate} from 'react-router-dom'
import { AuthContext } from "../helpers/AuthContext";


function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthState } = useContext(AuthContext);

  let navigate = useNavigate();

  const login = () => {
    const data = { username: username, password: password };
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
  return (
    <div className="loginContainer">
      <label>Username:</label>
      <input
        type="text"
        placeholder="Username..."
        onChange={(event) => {
          setUsername(event.target.value);
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

      <button onClick={login}> Login </button>
    </div>
  );
}

export default Login;