import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Help() {

    console.log("Help component rendered.");

    const[help, setHelp] = useState([]);

    let navigate = useNavigate();

    return (
        <div className="helpContainer">
            <h1 className="helpBanner" style={{ fontSize: "45px", padding: "30px" }}>
                Campaign Journal Help Page
            </h1>
            <div>
                <h2 className="helpHeading" style={{ fontSize: "30px", paddingLeft: "50px" }}>
                    Profile Page
                </h2>
                    <h3 className="helpText" style={{ fontSize: "20px", paddingLeft: "50px" }}>
                        The Profile page
                    </h3>
                <h2 className="helpHeading" style={{ fontSize: "30px", paddingLeft: "50px" }}>
                    Section 2
                </h2>
                    <h3 className="helpText" style={{ fontSize: "20px", paddingLeft: "50px" }}>
                        Text for the second heading
                    </h3>
                <h2 className="helpHeading" style={{ fontSize: "30px", paddingLeft: "50px" }}>
                    Section 3
                </h2>
                    <h3 className="helpText" style={{ fontSize: "20px", paddingLeft: "50px" }}>
                        Text for the third heading
                    </h3>
                {/* Add more content as needed */}
            </div>
        </div>
    );

}
export default Help