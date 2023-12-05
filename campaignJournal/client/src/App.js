import './App.css';
import axios from "axios";
import {useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import ProfilePage from './pages/ProfilePage';
import AddFriend from './pages/AddFriend';
import CampaignJournal from './pages/CampaignJournal';
import Login from './pages/Login';
import Help from './pages/Help';
import Registration from './pages/Registration';
import CreateJournalEntry from './pages/CreateJournalEntry';
import CreateCampaign from './pages/CreateCampaign';
import CreateCharacter from './pages/CreateCharacter';
import Characters from './pages/Characters';
import JournalEntry from './pages/JournalEntry';
import ResetPassword from './pages/tokenPages/ResetPassword';
import { AuthContext } from "./helpers/AuthContext";
import new_entry_white from "./resources/new_entry_white.png";
import journal_white from "./resources/journal_white.png";
import elf_white from "./resources/elf_white.png";
import wizard_white from "./resources/wizard_white.png";
import somatic_white from "./resources/somatic_white.png";
import tome_img_small from "./resources/tome_img_small.png";
import { APIURL } from "./helpers/APIURL";

axios.defaults.withCredentials = true;


function App() {

  const [authState, setAuthState] = useState({
    username:"",
    id:0,
    status:false
  });


  const [isAuthCheckComplete, setIsAuthCheckComplete] = useState(false);

  useEffect(() => {
    axios.get(`${APIURL}Users/auth`).then((response) => {
      if (response.data.error){
        setAuthState({...authState, status: false});
      }else{
        setAuthState({
          username: response.data.username,
          id: response.data.id,
          status: true,
        });
      }
      setIsAuthCheckComplete(true);
    }).catch((error) => {
      console.error("Error fetching auth data", error);
      setIsAuthCheckComplete(true);
    });   
  }, [])

  const logout = () =>{
    localStorage.clear();
    sessionStorage.clear();
    setAuthState({ username: "", id: 0, status: false });
    setIsAuthCheckComplete(true);
  }

  return (
    <div className="App">
      <AuthContext.Provider value={{authState, setAuthState, isAuthCheckComplete}}>
      <Router>
        <div className='navbar'>
          {authState.status ? (
            <>
              <img src={tome_img_small} 
              className='tomeLogo'
              alt="tomeLogo" 
              style={{ marginRight: '5px' }}
              />
              <label className="appNameLoggedIn">Campaign Journal</label>
            <Link to="/" className='linkContainer'>
            <img src={wizard_white} 
              className='linkIcon'
              alt="wizard_white" 
              style={{ marginRight: '5px' }}
              />
            <span className='linkSpan'>Profile</span>
            </Link>
            <Link to="/CampaignJournal" className='linkContainer'>
            <img src={journal_white}
              className='linkIcon'
              alt="closedJournalIcon" 
              style={{ marginRight: '5px' }}
              />
            <span className='linkSpan'>Journal</span>
            </Link>
            <Link to="/CreateJournalEntry" className='linkContainer'> 
              <img src={new_entry_white}
              className='linkIcon'
              alt="write entry" 
              style={{ marginRight: '5px' }}
              />
            <span className='linkSpan'>New Journal Entry</span>
            </Link>
            <Link to="/Characters" className='linkContainer'>
            <img src={elf_white} 
              className='linkIcon'
              alt="elfIcon" 
              style={{ marginRight: '5px' }}
              />
            <span className='linkSpan'>Dramatus Personae</span>
            </Link>
            <Link to="/Help" className='linkContainer'>
            <img src={somatic_white} 
              className='linkIcon'
              alt="somatic" 
              style={{ marginRight: '5px' }}
            />
            <span className='linkSpan'>Help</span>
            </Link>
            <div className="loggedInContainer">
              <h1>{authState.username}</h1>
              <button onClick={logout}>Logout</button>
            </div>
            </>
          ):(
            <>
            <img src={tome_img_small} 
              className='tomeLogo'
              alt="tomeLogo" 
              style={{ marginRight: '5px' }}
            />
            <label className="appNameLoggedOut">Campaign Journal</label>
            <Link to="/Login">Login</Link>
            <Link to="/Registration">Register</Link>
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
          <Route path = "/Help" element={ <Help/>}/>
          <Route path = "/JournalEntries/byId/:id" element = { <JournalEntry/> }/>
          <Route path = {`${APIURL}JournalEntries/search`} element = { <JournalEntry/> }/>
          <Route path = "/ResetPassword/:token" element = {<ResetPassword/>}/>
        </Routes>
      </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;