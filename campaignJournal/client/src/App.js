import './App.css';
import axios from "axios";
import {useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import ProfilePage from './pages/ProfilePage';
import AddFriend from './pages/AddFriend';
import CampaignJournal from './pages/CampaignJournal';
import Login from './pages/Login';
import Registration from './pages/Registration';
import CreateJournalEntry from './pages/CreateJournalEntry';
import CreateCampaign from './pages/CreateCampaign';
import CreateCharacter from './pages/CreateCharacter';
import Characters from './pages/Characters';
import JournalEntry from './pages/JournalEntry';
import ResetPassword from './pages/tokenPages/ResetPassword';
import { AuthContext } from "./helpers/AuthContext";
import writeEntryIcon from "./resources/writeEntryIcon.png";
import closedJournalIcon from "./resources/closedJournalIcon.png";
import elfIcon from "./resources/elfIcon.png";
import wizardIcon from "./resources/wizardIcon.png";

axios.defaults.withCredentials = true;

function App() {

  const [authState, setAuthState] = useState({
    username:"",
    id:0,
    status:false
  });

  useEffect(() => {
    console.log(`APP.JS\ncalling users/auth headers:`);
    axios.get("http://localhost:3001/Users/auth").then((response) => {
      if (response.data.error){
        setAuthState({...authState, status: false});
      }else{
        setAuthState({
          username: response.data.username,
          id: response.data.id,
          status: true,
        });
      }
    }).catch((error) => {
      console.error("Error fetching auth data", error);
    });   
  }, [])

  const logout = () =>{
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    localStorage.removeItem("entryId");
    setAuthState({ username: "", id: 0, status: false });
  }

  return (
    <div className="App">
      <AuthContext.Provider value={{authState, setAuthState}}>
      <Router>
        <div className='navbar'>
          {authState.status ? (
            <>
            <Link to="/" className='linkContainer'>
            <img src={wizardIcon} 
              className='linkIcon'
              alt="wizardIcon" 
              style={{ marginRight: '5px' }}
              />
            <span className='linkSpan'>Profile</span>
            </Link>
            <Link to="/CampaignJournal" className='linkContainer'>
            <img src={closedJournalIcon} 
              className='linkIcon'
              alt="closedJournalIcon" 
              style={{ marginRight: '5px' }}
              />
            <span className='linkSpan'>Journal</span>
            </Link>
            <Link to="/CreateJournalEntry" className='linkContainer'> 
              <img src={writeEntryIcon} 
              className='linkIcon'
              alt="write entry" 
              style={{ marginRight: '5px' }}
              />
            <span className='linkSpan'>New Journal Entry</span>
            </Link>
            <Link to="/Characters" className='linkContainer'>
            <img src={elfIcon} 
              className='linkIcon'
              alt="elfIcon" 
              style={{ marginRight: '5px' }}
              />
            <span className='linkSpan'>Dramatus Personae</span>
            </Link>
            <label className="appNameLoggedIn">Campaign Journal</label>
            <div className="loggedInContainer">
              <h1>{authState.username}</h1>
              <button onClick={logout}>Logout</button>
            </div>
            </>
          ):(
            <>
            <Link to="/Login">Login</Link>
            <Link to="/Registration">Register</Link>
            <label className="appNameLoggedOut">Campaign Journal</label>
            </>
          )}
        </div>
        <Routes>
          <Route path = "/" element={ <ProfilePage/> }/>
          <Route path = "/CampaignJournal" element={ <CampaignJournal/>}/>
          <Route path = "/CreateJournalEntry" element = { <CreateJournalEntry/> }/>
          <Route path = "/CreateCampaign" element = { <CreateCampaign/> }/>
          <Route path = "/Login" element = { <Login/> }/>
          <Route path = "/Registration" element = { <Registration/> }/>
          <Route path = "/Characters" element = { <Characters/> }/>
          <Route path = "/CreateCharacter" element = { <CreateCharacter/> }/>
          <Route path = "/AddFriend" element={ <AddFriend/> }/>
          <Route path = "/JournalEntries/byId/:id" element = { <JournalEntry/> }/>
          <Route path = "http://localhost:3001/JournalEntries/search" element = { <JournalEntry/> }/>
          <Route path = "/ResetPassword/:token" element = {<ResetPassword/>}/>
        </Routes>
      </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;