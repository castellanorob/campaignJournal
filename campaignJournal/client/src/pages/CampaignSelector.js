import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { APIURL } from "../helpers/APIURL";
import { AuthContext } from "../helpers/AuthContext";

function CampaignSelector(){

    const[campaigns, setCampaigns] = useState([]);

    let navigate = useNavigate();
      const { authState, isAuthCheckComplete } = useContext(AuthContext);

    useEffect(() => {

        if(!authState.status) {
            navigate("/Login");
        } else {
            let userId = localStorage.getItem("userId");
            axios.get(`${APIURL}CampaignPlayers/${userId}`)
            .then(async (response) => {
                if(response.data.error){
                    alert(response.data.error);
                } else {
                    let playerCampaigns = [];
                    for (const campaign of response.data){
                        let playerCampaign = await axios.get(`${APIURL}Campaign/${campaign.campaignId}`)
                        playerCampaigns.push(playerCampaign.data[0]);
                    }
                    setCampaigns(playerCampaigns)
                }
            });
        }
    },[navigate, isAuthCheckComplete, authState])

    //TODO 
    return(
        <div>
            {campaigns.length > 0 ? (
                <div className="campaignsContainer">
                {campaigns.map((campaign) => {

                return(
                    <div
                        key = {campaign.id}
                        title = {campaign.title}
                        className="campaign"
                        onClick={() => {
                            sessionStorage.setItem("campaignId", campaign.id);
                            navigate("/CampaignJournal")
                        }}
                    >
                        <div 
                            className="campaignBody"
                            style={{textAlign: 'center'}}
                        >
                            {campaign.title}
                        </div>
                    </div>
                );
            })}
                <div className="campaign" style={{textAlign: 'center'}}>
                    <Link 
                        className="campaignBody" 
                        to="/createCampaign"
                        style={{textDecoration: 'none'}}
                    >
                        +
                    </Link>
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