import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function CampaignJournal() {
    const[journalEntries, setJournalEntries] = useState([]);
    const[journalAuthors, setJournalAuthors] = useState([]);

    let navigate = useNavigate();

    useEffect(() =>{
      const accessToken = localStorage.getItem("accessToken");
      const campaignId = sessionStorage.getItem("campaignId");
      const headers = {
        accessToken: localStorage.getItem("accessToken")
      }

      if(!accessToken || !campaignId){
        navigate("/");
      }

      axios.get(`http://localhost:3001/JournalEntries/${campaignId}`, {headers})
      .then((response) =>{
        setJournalEntries(response.data);

        const authorPromises = response.data.map(journal => {
          return axios.get(`http://localhost:3001/Users/${journal.userId}`, { headers });
        });

        Promise.all(authorPromises).then((authorResponses) => {
          const authors = authorResponses.map(response => response.data);
          setJournalAuthors(authors);
        });
      }).catch((error) => {
        console.error('Error fetching journal entries or authors:', error);
      });
    }, [navigate]);

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