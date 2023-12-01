import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Help() {

    console.log("Help component rendered.");

    const[help, setHelp] = useState([]);

    let navigate = useNavigate();

    const profilePageText = 'The Profile page is the main page that displays after login. It contains your user icon, account information, friend request information, \n and game campaigns you are part of. From here you can add a friend, see existing friend requests, create a campaign, join a campaign, \n and see pending campaign invites.';
    const journalPageText = 'The Journal page displays all of the journal entries associated with the current game campaign. You can select an individual entry to view, \n or you can search for an entry based on search terms that can be entered in the search bar at the top of the page.';
    const journalEntryPageText = 'The New Journal Entry page is where a new journal entry can be written and posted. \n Simply enter the text in the main text field, select the kind of privacy for the entry, and click Submit to post a new entry.';
    const dramatusPageText = 'The Dramatus Personae page displays a list of characters and their information for the given campaign. Each character is listed';

    return (
        <div className="helpContainer">
            <h1 className="helpBanner" style={{ fontSize: "45px", padding: "30px" }}>
                Campaign Journal Help Page
            </h1>
            <div>
                <h2 className="helpHeading" style={{ fontSize: "30px", paddingLeft: "50px" }}>
                    Profile Page
                </h2>
                    <div className="display-linebreak" style={{ fontSize: "20px", paddingLeft: "50px" }}>
                        {profilePageText}
                    </div>
                <h2 className="helpHeading" style={{ fontSize: "30px", paddingLeft: "50px" }}>
                    Journal Page
                </h2>
                    <div className="display-linebreak" style={{ fontSize: "20px", paddingLeft: "50px" }}>
                        {journalPageText}
                    </div>
                <h2 className="helpHeading" style={{ fontSize: "30px", paddingLeft: "50px" }}>
                    New Journal Entry Page
                </h2>
                    <div className="display-linebreak" style={{ fontSize: "20px", paddingLeft: "50px" }}>
                        {journalEntryPageText}
                    </div>
                    <h2 className="helpHeading" style={{ fontSize: "30px", paddingLeft: "50px" }}>
                    Dramatus Personae Page
                </h2>
                    <div className="display-linebreak" style={{ fontSize: "20px", paddingLeft: "50px" }}>
                        {dramatusPageText}
                    </div>
                {/* Add more content as needed */}
            </div>
        </div>
    );

}
export default Help