import React from "react";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { APIURL } from "../helpers/APIURL";
import { AuthContext } from "../helpers/AuthContext";

function CampaignJournal() {
    const[characters, setCharacters] = useState([]);

    let navigate = useNavigate();
    const { authState, isAuthCheckComplete } = useContext(AuthContext);

    useEffect(() =>{

      const campaignId = sessionStorage.getItem("campaignId");

      if(!isAuthCheckComplete){
        return
      }

      if(!authState.status || !campaignId){
        navigate("/");
      }

      axios.get(`${APIURL}Characters/${campaignId}`)
      .then((response) =>{
        setCharacters(response.data);
      })
    }, [navigate, isAuthCheckComplete, authState]);

    return (
      <div className="charactersPage">
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
                No characters to display
            </div>
        )}
      </div>
      <div>
        <Link to="/createCharacter">Create new chracter</Link>
      </div>  
      </div>   
    );
  }

export default CampaignJournal