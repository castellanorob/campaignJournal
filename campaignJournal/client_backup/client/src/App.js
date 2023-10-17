import './App.css';
import axios from "axios";
import {useEffect, useState} from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import CampaignSelector from './pages/CampaignSelector';
import CampaignJournal from './pages/CampaignJournal';
import Login from './pages/Login';
import Registration from './pages/Registration';
import CreateJournalEntry from './pages/CreateJournalEntry';
import { AuthContext } from "./helpers/AuthContext";

function App() {

  const [authState, setAuthState] = useState({
    username:"",
    id:0,
    status:false
  });

  useEffect(() => {
    axios.get("http://localhost:3001/Users/auth", {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    }).then((response) => {
      if (response.data.error){
        setAuthState({...authState, status: false});
      }else{
        setAuthState({
          username: response.data.username,
          id: response.data.id,
          status: true,
        });
      }
    });
  }, [])

  useEffect(() =>{
    if(authState.status){
      localStorage.setItem("username", authState.username);
      localStorage.setItem("userId", authState.id);
    }
  }, [])

  const logout = () =>{
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    setAuthState({ username: "", id: 0, status: false });
  }

  return (
    <div className="App">
      <AuthContext.Provider value={{authState, setAuthState}}>
      <Router>
        <div className='navbar'>
          {authState.status ? (
            <>
            <Link to="/">My Campaigns</Link>
            <Link to="/CampaignJournal">Journal</Link>
            <Link to="/CreateJournalEntry"> New Journal Entry</Link>
            <div className="loggedInContainer">
              <h1>{authState.username}</h1>
              <button onClick={logout}>Logout</button>
            </div>
            </>
          ):(
            <>
            <Link to="/Login">Login</Link>
            <Link to="/Registration">Register</Link>
            </>
          )}
        </div>
        <Switch>
          <Route path = "/" exact component={CampaignSelector} />
          <Route path = "/CampaignJournal" exact component={CampaignJournal} />
          <Route path = "/CreateJournalEntry" exact component = {CreateJournalEntry}/>
          <Route path = "/Login" exact component = {Login}/>
          <Route path = "/Registration" exact component = {Registration}/>
        </Switch>
      </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;