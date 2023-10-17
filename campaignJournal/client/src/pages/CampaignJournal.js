import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";

function CampaignJournal() {
    const[journalEntries, setJournalEntries] = useState([]);
    const[journalAuthors, setJournalAuthors] = useState([]);

    let history = useHistory();

    useEffect(() =>{
      const accessToken = localStorage.getItem("accessToken");
      const campaignId = sessionStorage.getItem("campaignId");

      if(!accessToken || !campaignId){
        history.push("/")
      }

      axios.get(`http://localhost:3001/JournalEntries/${campaignId}`, {
        headers:{
          accessToken: accessToken
        }
      }).then((response) =>{
        setJournalEntries(response.data);
      })
      
      axios.get("http://localhost:3001/Users").then((response) =>{
        setJournalAuthors(response.data);
      })
    }, [history]);

    return (
        <div>
          {journalEntries.length > 0? journalEntries.map((journalEntry) => {
            const author = journalAuthors.find(author => author.id === journalEntry.userId);
            return (
              <div
                key={journalEntry.id}
                userId = {journalEntry.userId}
                className="post"
              >
              <div className="body">{journalEntry.journalBody}</div>
                {author ? (<div className="footer">{author.username}</div>):(
                <div className="footer">Unkown Author</div>
                )}
                </div>);
                }):(
                <div>
                    <Link to="/createJournalEntry">Create your first journal entry</Link>
                  </div>
                )}
              </div>
            );
    }

export default CampaignJournal