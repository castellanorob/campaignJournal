import React, { useEffect, useState } from "react";
import axios from "axios";
import { Router, useNavigate, Link } from "react-router-dom";

function CampaignSelector(){

    const[campaigns, setCampaigns] = useState([]);

    let navigate = useNavigate();

    useEffect(() => {

        const accessToken = localStorage.getItem("accessToken");

        if(!accessToken) {
            navigate("/Login");
        } else {
            let userId = localStorage.getItem("userId");
            console.log(userId);
            axios.get(`http://localhost:3001/Campaign/${userId}`, {
                headers: {
                    accessToken: accessToken
                  }
            }).then((response) => {
                if(response.data.error){
                    alert(response.data.error);
                } else {
                    sessionStorage.setItem("campaignId", response.data.campaignId);
                }
            });
        }

 

    })

    //TODO need to store the campaignId to sessionStorage after the campaign is selected
    return(
        <>
        <div>CampaignSelector</div>

        <div className='createPostPage'>
            <Link to='/CreateCampaign'>Create Campaign</Link>
        </div>


        </>

    )
}

export default CampaignSelector;