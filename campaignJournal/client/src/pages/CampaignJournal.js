import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import { APIURL } from "../helpers/APIURL";
import { AuthContext } from "../helpers/AuthContext";

function CampaignJournal() {
  const [journalEntries, setJournalEntries] = useState([]);
  const [journalAuthors, setJournalAuthors] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [filtered, setFiltered] = useState(false);

  let navigate = useNavigate();
  const { authState, isAuthCheckComplete } = useContext(AuthContext);

    useEffect(() =>{

      const campaignId = sessionStorage.getItem("campaignId");

      if(!isAuthCheckComplete){
        return
      }

      if (!authState.status || !campaignId) {
        navigate("/");
      }


      axios.get(`${APIURL}JournalEntries/${campaignId}`)
      .then((response) =>{
        setJournalEntries(response.data);

        const authorPromises = response.data.map(journal => {
          return axios.get(`${APIURL}Users/${journal.userId}`);
        });

        Promise.all(authorPromises).then((authorResponses) => {
          const authors = authorResponses.map(response => response.data);
          setJournalAuthors(authors);
        });
      }).catch((error) => {
        console.error('Error fetching journal entries or authors:', error);
      });
    }, [navigate, authState, isAuthCheckComplete, authState]);

  const initialValues = {
    searchTerms: "",
  };

  const onSearchSubmit = (data, { resetForm }) => {
    if (!filtered) {
      const results = journalEntries.filter((entry) =>
        entry.journalBody.includes(data.searchTerms)
      );
      setFilteredEntries(results);
    } else {
      setFilteredEntries([]);
    }
    setFiltered(!filtered);
    resetForm();
  };

  const handleEntryClick = (journalEntryId) => {
    sessionStorage.setItem("entryId", journalEntryId);
    navigate(`/JournalEntries/byId/${journalEntryId}`);
  };

  return (
    <div 
      style={{ backgroundImage: `url("https://media.wizards.com/2016/dnd/downloads/SKTPreview_map.jpg")`}}
      className="journalContainer"
    >
      <Formik initialValues={initialValues} onSubmit={onSearchSubmit}>
        <Form className="searchBarContainer">
          <Field
            className="searchBar"
            as="textarea"
            id="inputSearchTerms"
            name="searchTerms"
            placeholder="Search entries..."
          />
          <button 
            type="submit"
            style ={{ 
              position: "relative",
              top: "-20px",
          }}
          > 
            {filtered ? "Back" : "Search"} 
          </button>
        </Form>
      </Formik>

      {filteredEntries.length > 0 ? (
        filteredEntries.map((journalEntry) => {
          const author = journalAuthors.find(
            (author) => author.id === journalEntry.userId
          );
          return (
            <div
              key={journalEntry.id}
              userId={journalEntry.userId}
              className="post"
              onClick={() => {
                sessionStorage.setItem("entryId", journalEntry.id);
                navigate(`/JournalEntries/byId/${journalEntry.id}`);
              }}
            >
              <div className="body">{journalEntry.journalBody}</div>
              {author ? (
                <div className="footer">{author.username}</div>
              ) : (
                <div className="footer">Unknown Author</div>
              )}
            </div>
          );
        })
      ) : (
        <div>
          {journalEntries.length > 0
            ? journalEntries.map((journalEntry) => {
                const author = journalAuthors.find(
                  (author) => author.id === journalEntry.userId
                );
                return (
                  <div
                    key={journalEntry.id}
                    userId={journalEntry.userId}
                    className="post"
                    onClick={() => handleEntryClick}
                  >
                    <div className="body">
                      {journalEntry.journalBody}
                    </div>
                    {author ? (
                      <div className="footer">{author.username}</div>
                    ) : (
                      <div className="footer">Unkown Author</div>
                    )}
                  </div>
                );
              })
            : (
                <div>
                  <Link to="/createJournalEntry">
                    Create your first journal entry
                  </Link>
                </div>
              )}
        </div>
      )}
    </div>
  );
}

export default CampaignJournal;