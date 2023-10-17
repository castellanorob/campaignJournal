import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

function CampaignSelector(){

    let history = useHistory();

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        const campaignId = sessionStorage.getItem("campaignId");

        if(!accessToken) {
            history.push("/Login");
        }
    })

    //TODO need to store the campaignId to sessionStorage after the campaign is selected
    return(
        <div>CampaignSelector</div>
    )
}

export default CampaignSelector;