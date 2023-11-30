import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { APIURL } from "../helpers/APIURL";

function CampaignJournal() {
    const[characters, setCharacters] = useState([]);

    let navigate = useNavigate();

    useEffect(() =>{

      const accessToken = localStorage.getItem("accessToken");
      const campaignId = sessionStorage.getItem("campaignId");

      if(!accessToken || !campaignId){
        navigate("/");
      }

      axios.get(`${APIURL}Characters/${campaignId}`)
      .then((response) =>{
        setCharacters(response.data);
      })
    }, [navigate]);

    return (
      <div className="characterContainer">
        <label 
          className="charactersLabel"
          style={{fontSize: "50px", paddingLeft: "30px"}}
        >
          Dramatus Personae
        </label>
        {characters.length > 0? characters.map((character) => {
          return (
            <div
              key={character.id}
              playerId = {character.playerId}
              className="character"
            >
              <div className="characterName">Name: {character.name}</div>
              <div className="characterDescription">Description: {character.description}</div>
              <div className="characterStatus">Status: {character.status}</div>
            </div>);
              }):(
            <div>
                <Link to="/createCharacter">Create the first character</Link>
            </div>
        )}
      </div>     
    );
  }

export default CampaignJournal