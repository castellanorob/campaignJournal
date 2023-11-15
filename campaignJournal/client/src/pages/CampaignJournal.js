import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field } from "formik";

function CampaignJournal() {
  const [journalEntries, setJournalEntries] = useState([]);
  const [journalAuthors, setJournalAuthors] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [filtered, setFiltered] = useState(false);

  let navigate = useNavigate();

    useEffect(() =>{
      const accessToken = localStorage.getItem("accessToken");
      const campaignId = sessionStorage.getItem("campaignId");
      const headers = {
        accessToken: localStorage.getItem("accessToken")
      }

    if (!accessToken || !campaignId) {
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
                    onClick={() => {
                      sessionStorage.setItem(
                        "entryId",
                        journalEntry.id
                      );
                      navigate(`/JournalEntries/byId/${journalEntry.id}`);
                    }}
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