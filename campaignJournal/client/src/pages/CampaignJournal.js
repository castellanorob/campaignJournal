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

  const [players, setPlayers] = useState([]);
  const [characters, setCharacters] = useState([]);

  let navigate = useNavigate();
  const { authState, isAuthCheckComplete } = useContext(AuthContext);

  const campaignId = sessionStorage.getItem("campaignId");

  useEffect(() => {
    if (!isAuthCheckComplete) {
      return
    }

    if (!authState.status || !campaignId) {
      navigate("/");
    }

    const fetchData = async () => {

      try{
        
        const entries = await fetchJournalEntries();
        console.log(`before setJournalEntries entries.data: ${JSON.stringify(entries.data)}\n`)
        setJournalEntries(entries.data);
        console.log(`after setJournalEntries: jornalEntries: ${JSON.stringify(journalEntries)}`)
  
        const userIds = entries.data.map(entry => entry.userId);
        console.log(`got user ids from journal entries: ${JSON.stringify(userIds)}`)
        const authors = await fetchJournalAuthors(userIds)
        console.log(`before setJournalAuthors\njournalAuthors: ${JSON.stringify(journalAuthors)}\nauthors: ${JSON.stringify(authors)}`);
        setJournalAuthors(authors);
        console.log(`after setJournalAuthors: journalAuthors: ${JSON.stringify(journalAuthors)}`)
  
        const players = await fetchPlayers();
        console.log(`before setting players: players: ${JSON.stringify(players)}`);
        setPlayers(players.data);
        console.log(`after setPlayers: players: ${JSON.stringify(players)}`)
  
        const playerCharacters = await fetchCharacters();
        console.log(`before setting characters\ncharacters: ${JSON.stringify(playerCharacters)}`);
        setCharacters(playerCharacters);
        console.log(`after setting characters ${JSON.stringify(characters)}`)

      }catch(error){
        console.log(`error in fetchData: ${error}`)
      }

    }

    fetchData();


  }, [navigate, isAuthCheckComplete, authState, campaignId]);

  async function fetchJournalEntries() {
    try {
      const journalEntries = await axios.get(`${APIURL}JournalEntries/${campaignId}`);

      if (journalEntries.data.error) {
        alert(JSON.stringify(journalEntries.data.error));
        console.error(journalEntries.data.error);
        return []
      }

      console.log(`inside fetchJournalEntries, returning: ${JSON.stringify(journalEntries)}`)

      return journalEntries;

    } catch (error) {
      console.error(JSON.stringify(error));
      return [];
    }
  }

  async function fetchJournalAuthors(userIds) {

    try {
      const requests = userIds.map(id => axios.get(`${APIURL}Users/${id}`));
      const response = await Promise.all(requests);

      const journalAuthors = response.map(response => response.data)

      console.log(`returning authors: ${JSON.stringify(journalAuthors)}`)
      return journalAuthors;
    } catch (error) {
      console.error(`Error in fetchJournalAuthors: ${JSON.stringify(error)}`);
    }
  }

  async function fetchCharacters() {
    try {
      const characters = await axios.get(`${APIURL}Characters/${campaignId}`);

      if (characters.data.error) {
        alert(JSON.stringify(characters.data.error));
        console.error(characters.data.error);
        return [];
      }

      return characters.data;

    } catch (error) {
      console.error(JSON.stringify(error));
      return [];
    }
  }

  async function fetchPlayers() {
    try {
      const players = await axios.get(`${APIURL}CampaignPlayers/players/${campaignId}`);
      return players;
    } catch (error) {
      console.error(JSON.stringify(error));
    }
  }

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

  console.log("journalEntries state: ", journalEntries);
  console.log("characters state: ", characters);
  console.log("players state: ", players)

  return (
    <div className="campaignJournalContainer">
    <div
      style={{ backgroundImage: `url("https://media.wizards.com/2016/dnd/downloads/SKTPreview_map.jpg")` }}
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
            style={{
              position: "relative",
              top: "-20px",
            }}
          >
            {filtered ? "Back" : "Search"}
          </button>
        </Form>
      </Formik>

        <div className="campaignJournalLeftContainer">
          <div className="playersContainer">
            {players.map(player => (
              <div className="playersAndCharactersContainer" key={player.id}>
                <div className="playerContainer">
                  <img className="playerIcon" src={`${APIURL}ProfileIcons/${player.icon}`} alt={`Icon of ${player.userName}`} />
                  <div className="playerUserName">{player.username}</div>
                  <div className="playerCharactersContainer">
                  {characters && characters.length > 0 ? (
                    characters.map(character => {
                      console.log(`before if character.playerId ==== player.id, player.Id:${player.id} character.playerId ${character.userId}`)
                      if (character.playerId === player.id && character.type === 'pc') {
                        console.log(`inside playerCharactersContainer. Character:${JSON.stringify(character)} player: ${JSON.stringify(player)}`);
                        return (
                          <div
                          key={character.id}
                          className="character"
                          >
                            <div className="characterInfo">
                            <div className="characterDescription">Name: {character.name} </div>
                            </div>
                            <div className="characterDescription">Description: {character.description}</div>
                            <div className="characterStatus">Status: {character.status}</div>
                          </div>
                        )
                      }
                      return null;
                    })
                  ) : (
                    <div> No Characters Created </div>
                  )}
                </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="journalEntriesContainer">
        {filteredEntries && filteredEntries.length > 0 ? (
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
            {journalEntries && journalEntries.length > 0 ? (
              journalEntries.map((journalEntry) => {
                const author = journalAuthors.find(
                  (author) => author.id === journalEntry.userId
                );
                console.log(`journal entry exists and length greater than 1 div,\njournal entries: ${journalEntries}`)
                return (
                  <div
                    key={journalEntry.id}
                    userId={journalEntry.userId}
                    className="post"
                    onClick={() => handleEntryClick(journalEntry.id)}
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
              }))
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
      </div>
    </div>
  );
}

export default CampaignJournal;