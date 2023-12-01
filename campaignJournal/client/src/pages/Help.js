import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Help() {

    console.log("Help component rendered.");

    const[help, setHelp] = useState([]);

    let navigate = useNavigate();

    return (
        <div className="characterContainer">
            <label 
            className="charactersLabel"
            style={{fontSize: "40px", paddingLeft: "30px"}}
            >
            Welcome to the Campaign Journal Help Page
            </label>
        </div>
    );

}
export default Help