import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CampaignSelector(){

    let navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        const campaignId = sessionStorage.getItem("campaignId");

        if(!accessToken) {
            navigate("/Login");
        }
    })

    //TODO need to store the campaignId to sessionStorage after the campaign is selected
    return(
        <div>CampaignSelector</div>
    )
}

export default CampaignSelector;