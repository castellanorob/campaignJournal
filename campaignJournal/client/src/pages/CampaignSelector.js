import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function CampaignSelector(){

    const[campaigns, setCampaigns] = useState([]);

    let navigate = useNavigate();

    useEffect(() => {

        const headers = {
            accessToken: localStorage.getItem("accessToken")
          }

        const accessToken = localStorage.getItem("accessToken");

        if(!accessToken) {
            navigate("/Login");
        } else {
            let userId = localStorage.getItem("userId");
            axios.get(`http://localhost:3001/CampaignPlayers/${userId}`, {headers})
            .then(async (response) => {
                if(response.data.error){
                    alert(response.data.error);
                } else {
                    let playerCampaigns = [];
                    for (const campaign of response.data){
                        let playerCampaign = await axios.get(`http://localhost:3001/Campaign/${campaign.campaignId}`)
                        playerCampaigns.push(playerCampaign.data[0]);
                    }
                    setCampaigns(playerCampaigns)
                }
            });
        }
    },[navigate])

    //TODO 
    return(
        <div>
            {campaigns.length > 0 ? (
                <div>
                {campaigns.map((campaign) => {

                return(
                    <div
                        key = {campaign.id}
                        title = {campaign.title}
                        className="post"
                        onClick={() => {
                            sessionStorage.setItem("campaignId", campaign.id);
                            navigate("/CampaignJournal")
                        }}
                    >
                        <div className="body">
                            {campaign.title}
                        </div>
                    </div>
                );
            })}
                <div>
                    <Link to="/createCampaign">Create another campaign</Link>
                </div>
            </div>
            ):(
                <div>
                    <Link to="/createCampaign">Create your first campaign</Link>
                </div>
            )}

        </div>
    )
}

export default CampaignSelector;
