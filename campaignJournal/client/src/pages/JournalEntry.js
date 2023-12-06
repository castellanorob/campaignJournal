import React from "react";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EditableTextField from "../components/EditableTextField";
import waterColorCastle from "../resources/water_color_castle.png"
import { APIURL } from "../helpers/APIURL";
import { AuthContext } from "../helpers/AuthContext";

function JournalEntry() {
    let { id } = useParams();
    const[journalEntry, setJournalEntry] = useState({});
    const[journalAuthor, setJournalAuthor] = useState([]);

    let navigate = useNavigate();
    const { authState, isAuthCheckComplete } = useContext(AuthContext);

    useEffect(() => {
      if(!isAuthCheckComplete){
        return
      }

      if(!authState){
        navigate("/")
      }

      axios.get(`${APIURL}JournalEntry/byId/${id}`).then((response) => {
        setJournalEntry(response.data);
      })
      axios.get(`${APIURL}Users`).then((response) =>{
        setJournalAuthor(response.data);
      })
    }, [navigate, isAuthCheckComplete, authState]);

      return (
        <div 
          className="entryPage"
          style={{ backgroundImage: `url(${waterColorCastle})`}}
        >
          <div
            key={journalEntry.id}
            userId = {journalEntry.userId}
            className="entryContainer"
          >
          <EditableTextField
            className="entryText"
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