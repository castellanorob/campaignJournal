import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Help() {

    const[help, setHelp] = useState([]);

    let navigate = useNavigate();

    // Profile page
    const profilePageText = 'The Profile page is the main page that displays after login. It contains your user icon, account information, friend request information, \n and game campaigns. From here you can add a friend, see existing friend requests, create a campaign, join a campaign, \n and see pending campaign invites.';
    const friendsText = "To add a friend, select the +Add Friend button and enter your friend's username or email address in the Friend Request field and \n select the Send Friend Request button. This will send your friend request to the desired recipient. \n \n Pending friend requests can be viewed in the Friend Requests section of the Profile page.";
    const campaignsText = "The Campaigns section of the Profile page displays the campaigns you are currently part of, and pending campaign invites. \n \n Create a new campaign by selecting the +Create a campaign button. Enter the name of the campaign and select your player type from the drop-down menu. \n Select the Create New Campaign button. Your newly created campaign will now display in the Campaigns section of the Profile page.";

    // Journal Page
    const journalPageText = 'The Journal page displays all of the journal entries associated with the current game campaign. You can select an individual entry to view, \n or you can search for an entry based on search terms that can be entered in the search bar at the top of the page.';
    const editEntryText = "To edit a journal entry, select the entry you would like to edit, then select the edit button. This will allow you to change the text in the journal entry.";
    

    // New Journal Entry Page
    const journalEntryPageText = 'The New Journal Entry page is where a new journal entry can be written and posted. \n \n Simply enter the text in the main text field, select the kind of privacy for the entry, and click Submit to post a new entry.';
    
    // Dramatus Personae Page
    const dramatusPageText = 'The Dramatus Personae page displays a list of characters and their information for the given campaign. Characters are listed with their name, \n description, and status for quick reference.';
    const charactersText = "Create a new character by selecting the Create the first character link. From here, enter the Character Name, Charact Description, and \n Character Status in the applicable fields and select character type from the drop-down menu. Then select the Submit Character button to finish creating your character. \n Your character will now display on the Dramatus Personae page. \n \n";
    
    
   

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
                    <h3 className="helpSubHeading" style={{ fontSize: "20px", paddingLeft: "50px" }}>
                        Adding Friends
                    </h3>
                    <div className="display-linebreak" style={{ fontSize: "20px", paddingLeft: "50px" }}>
                        {friendsText}
                    </div>
                    <h3 className="helpSubHeading" style={{ fontSize: "20px", paddingLeft: "50px" }}>
                        Campaigns
                    </h3>
                    <div className="display-linebreak" style={{ fontSize: "20px", paddingLeft: "50px" }}>
                        {campaignsText}
                    </div>
                <h2 className="helpHeading" style={{ fontSize: "30px", paddingLeft: "50px" }}>
                    Journal Page
                </h2>
                    <div className="display-linebreak" style={{ fontSize: "20px", paddingLeft: "50px" }}>
                        {journalPageText}
                    </div>
                    <h3 className="helpSubHeading" style={{ fontSize: "20px", paddingLeft: "50px" }}>
                        Edit Journal Entry
                    </h3>
                    <div className="display-linebreak" style={{ fontSize: "20px", paddingLeft: "50px" }}>
                        {editEntryText}
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
                    <h3 className="helpSubHeading" style={{ fontSize: "20px", paddingLeft: "50px" }}>
                        Characters
                    </h3>
                    <div className="display-linebreak" style={{ fontSize: "20px", paddingLeft: "50px" }}>
                        {charactersText}
                    </div>
                {/* Add more content as needed */}
            </div>
        </div>
    );

}
export default Help