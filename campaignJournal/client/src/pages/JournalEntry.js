import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EditableTextField from "../components/EditableTextField";

function JournalEntry() {
    let { id } = useParams();
    const[journalEntry, setJournalEntry] = useState({});
    const[journalAuthor, setJournalAuthor] = useState([]);

    let navigate = useNavigate();

    useEffect(() => {
        //const accessToken = localStorage.getItem("accessToken");
        axios.get(`http://localhost:3001/JournalEntry/byId/${id}`).then((response) => {
            setJournalEntry(response.data);
        })
        axios.get("http://localhost:3001/Users").then((response) =>{
            setJournalAuthor(response.data);
        })
    }, [navigate]);

      return (
        <div>
              <div
                key={journalEntry.id}
                userId = {journalEntry.userId}
                className="post"
              >
              <EditableTextField
                initialText = {journalEntry.journalBody}
                entry = {journalEntry}
              />
                {journalAuthor ? (<div className="footer">{journalAuthor.username}</div>):(
                <div className="footer">Unkown Author</div>
                )}
                </div>
        </div>     
      );
}

export default JournalEntry;