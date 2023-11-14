import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function CampaignJournal() {
    const[characters, setCharacters] = useState([]);

    let navigate = useNavigate();

    useEffect(() =>{

      const headers = {
        accessToken: localStorage.getItem("accessToken")
      }

      const accessToken = localStorage.getItem("accessToken");
      const campaignId = sessionStorage.getItem("campaignId");

      if(!accessToken || !campaignId){
        navigate("/");
      }

      axios.get(`http://localhost:3001/Characters/${campaignId}`, {headers})
      .then((response) =>{
        setCharacters(response.data);
      })
    }, [navigate]);

    return (
      <div>
        {characters.length > 0? characters.map((character) => {
          //const author = journalAuthors.find(author => author.id === journalEntry.userId);
          return (
            <div
              key={character.id}
              userId = {character.userId}
              className="post"
            >
            <div className="body">{character.name}</div>
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