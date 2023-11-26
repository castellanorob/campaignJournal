import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate} from "react-router-dom";
import InvitePlayerForm from "../Forms/InvitePlayerForm";

function ProfilePage() {
  const [campaigns, setCampaigns] = useState([]);
  const [friends, setFriends] = useState([]);
  const [requests, setFriendRequests] = useState([]);
  const [isInvitePopupOpen, setInvitePopupOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [selectedCampaignTitle, setSelectedCampaignTitle] = useState(null);
  

  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");

  const userId = localStorage.getItem("userId");
  const headers = {
    accessToken: localStorage.getItem("accessToken")
  }

  useEffect(() => {

    if (!accessToken) {
      navigate("/Login");
      return;
    }

    // Fetch friends and campaigns, then update the state
    async function fetchData() {
      const friendsToAdd = await fetchFriends();
      console.log(`before setFriends\nfriendsToAdd:${JSON.stringify(friendsToAdd)}`);
      setFriends(friendsToAdd);

      const campaignsToAdd = await fetchCampaigns();
      console.log(`before setCampaigns\ncampaignsToAdd:${JSON.stringify(campaignsToAdd)}`);
      setCampaigns(campaignsToAdd);

      const friendRequestSenders = await fetchFriendRquests();
      console.log(`before friendRequestSenders\nfriendRequestSenders:${JSON.stringify(friendRequestSenders)}`);
      setFriendRequests(friendRequestSenders);
    }

    // Call the fetchData function
    fetchData();
  }, [navigate]);

  async function fetchFriends() {
    try {
      const response = await axios.get(`http://localhost:3001/Friends/${userId}`, { headers });

      if (response.data.error) {
        alert(JSON.stringify(response.data.error));
        console.error(response.data.error);
        return [];
      }

      const relationships = response.data.filter((relationship) => relationship.friendId !== userId);

      const friendPromises = relationships.map(async (relationship) => {
        const friendId = relationship.friendId;
        const friendResponse = await axios.get(`http://localhost:3001/Users/${friendId}`, { headers });
        return friendResponse.data;
      });

      return await Promise.all(friendPromises);
    } catch (error) {
      console.error(JSON.stringify(error));
      return [];
    }
  }

  async function fetchFriendRquests() {
    console.log(`getting friend requests for ${localStorage.getItem("username")}, userId: ${userId}`);
    try {
      const response = await axios.get(`http://localhost:3001/Friends/friendRequests/${userId}`, { headers });

      if (response.data.error) {
        alert(response.data.error.message);
        console.error(response.data.error);
        return [];
      }

      const friendRequestPromises = response.data.map(async (friendRequest) => {
        const senderId = friendRequest.senderId;
        console.log(`getting info for ${senderId}`)
        const senderInfo = await axios.get(`http://localhost:3001/Users/${senderId}`, { headers });
        return senderInfo.data;
      });

      return await Promise.all(friendRequestPromises);
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async function fetchCampaigns() {
    console.log("getting campaigns")
    try {
      const response = await axios.get(`http://localhost:3001/CampaignPlayers/${userId}`, { headers });
  
      if (response.data.error) {
        alert(response.data.error);
        console.log(`response error:${response.data.error}`)
        return [];
      }
  
      const campaignPromises = response.data.map(async (playerCampaign) => {
        const campaignResponse = await axios.get(`http://localhost:3001/Campaign/${playerCampaign.campaignId}`, { headers });
        console.log(`campaignResponse:`, campaignResponse.data);
        
        let players = [];
        let userRole = "";
        if (campaignResponse.data && campaignResponse.data.id) {
          const campaignPlayersResponse = await axios.get(`http://localhost:3001/CampaignPlayers/${campaignResponse.data.id}`, { headers });
          const playerIds = campaignPlayersResponse.data.map(cp => cp.userId);
          
          const playerDetailsPromises = playerIds.map(playerId => 
            axios.get(`http://localhost:3001/Users/${playerId}`, { headers })
          );
          const playerDetailsResponses = await Promise.all(playerDetailsPromises);
          
          players = playerDetailsResponses.map(pd => pd.data);
          userRole = playerCampaign.role;
        }
  
        return {
          ...campaignResponse.data,
          userRole: userRole,
          players: players
        };
      });

      return await Promise.all(campaignPromises);
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  useEffect(() => {
    console.log(`Friends updated:`, JSON.stringify(friends));
  }, [friends]);
  
  useEffect(() => {
    console.log(`Campaigns updated:`, JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() =>{
    console.log(`friendRequests updated:`, JSON.stringify(requests));
  }, [requests]);
  

  const handleCampaignClick = (campaignId) => {
    sessionStorage.setItem("campaignId", campaignId);
    navigate("/CampaignJournal");
  };

  const acceptFriendRequest = (senderId) => {

    let data = {
      userId: userId,
      friendId: senderId
    }

    axios.post(`http://localhost:3001/Friends/addFriends`, data, {headers})
    .then((response) => {
      if(response.data.error){
        alert(response.data.error);
      }else{
          let friendRequestData = {
            senderId: senderId,
            receiverId: userId,
            status: "accepted"
          }
          axios.post('http://localhost:3001/Friends/updateFriendRequest', friendRequestData, {headers})
          .then(async (response) => {
            if(response.data.error){
              alert(response.data.error);
            }else{
              let updatedFriendsList = await fetchFriends();
              setFriends(updatedFriendsList);

              let updatedFriendsRequest = await fetchFriendRquests();
              setFriendRequests(updatedFriendsRequest);
            }
          }).catch(error => alert(error));
        }
      }).catch(error => alert(error));
  };

  const acceptCampaignInvite = (campaignId) => {
    let data = {
      userId: userId,
      role: "accepted",
      campaignId: campaignId
    }

    console.log("acceptCampaignInvite data: ", JSON.stringify(data));

    axios.post(`http://localhost:3001/CampaignPlayers/updateRole`, data, {headers})
    .then(async (response) => {
      if(response.data.error){
        alert(response.data.error);
        return;
      }
      const updatedCampaigns = await fetchCampaigns();
      setCampaigns(updatedCampaigns);
    })
  }

  const rejectCampaignInvite = (campaignId) =>{
    let data = {
      userId: userId,
      role: "rejected",
      campaignId: campaignId
    }

    axios.post(`http://localhost:3001/CampaignPlayers/updateRole`, data, {headers})
    .then(async (response) => {
      if(response.data.error){
        alert(response.data.error);
        return;
      }
      const updatedCampaigns = await fetchCampaigns();
      setCampaigns(updatedCampaigns);
    })
  }


  const declineFriendRequest = (senderId)=> {
    const data = {
      senderId: senderId,
      receiverId: userId,
      status: "rejected"
    }

    axios.post('http://localhost:3001/Friends/updateFriendRequest', data, {headers})
    .then((response) => {
      if(response.data.error){
        alert(response.data.error);
      }else{
        const updatedRequests = requests.filter(request => request.id !== senderId);
        setFriendRequests(updatedRequests) 
      }
    }).catch(error => alert(error));
  };

  const handleInvitePlayer = (event, campaignId, campaignTitle) => {
    event.stopPropagation();
    setSelectedCampaignId(campaignId);
    setSelectedCampaignTitle(campaignTitle);
    setInvitePopupOpen(true);
  };

  const closeInvitePopup = () => {
    setInvitePopupOpen(false);
  };

  const handleSubmitInvite = (userInfo, campaignId) => {
    
    console.log("inside handleSubmitInvite");
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    axios.post(`http://localhost:3001/Users/inviteUser/${userInfo}`,{campaignId: campaignId}, {headers})
    .then((response) =>{
      if (response.data.error){
        if(emailPattern.test(userInfo)){
          alert(`Unable to send email, please try again`);
        }else{
          console.log("error in findUser");
          alert(`${response.data.error}: Please try again, or submit an email`);
        }
      }else{
        alert(`Invitation sent to ${userInfo}`);
      }
    })
  };

  return (
    <div className="profilePage">
      <div className="topContainer">
        <div className="userInfoContainer">
          <img src={`/userIcons/${localStorage.getItem("icon")}`} alt="User Icon" className="userIcon" />
          <div className="userInfo">
            <div className="userName">{localStorage.getItem("username")}</div>
            <div className="userEmail">{localStorage.getItem("email")}</div>
          </div>
        </div>
        <div className="friendsListContainer">
          {friends && friends.length > 0 ? (
            friends.map((friend) => (
              <div className="friendName" key={friend.id}>
                <img src={`/userIcons/${friend.icon}`} alt={`${friend.username}`} className="friendImage" />
                {friend.username}
              </div>
            ))
          ) : (
            <p>No friends to display.</p>
          )}
          <div className="addFriendContainer" onClick={() => {navigate("/AddFriend")}}>
            + Add Friend
          </div>
        </div>
        <div className="friendsRequestContainer">
          <div className="friendRequestsHeader">
            Friend Requests
          </div>
          {requests && requests.length > 0 ? (
            requests.map((friendRequest) => (
              <div className="friendRequest" key = {friendRequest.id}>
                <img src={`/userIcons/${friendRequest.icon}`} alt={`${friendRequest.username}`} className="requesterIcon" />
                {friendRequest.username}
                <button onClick={() => acceptFriendRequest(friendRequest.id)}>Accept</button>
                <button onClick={() => declineFriendRequest(friendRequest.id)}>Decline</button>
              </div>
            ))
          ):(
            <p>No friend requests to display</p>
          )}
        </div>
      </div>

      <div className="bottomContainer">
      <div className="campaignListContainer">
          {campaigns && campaigns.length > 0 ? (
            campaigns
            .filter (campaign => campaign.userRole !== "invited" && campaign.userRole !== "rejected")
            .map((campaign) => (
              <div className="campaignContainer" key={campaign.id}>
              <div className="campaignRow">
                <div className="campaignInfo" onClick={() => handleCampaignClick(campaign.id)}>
                <div className="campaignTitle">{campaign.title}</div>
                <div className="playerIcons">
                  {campaign.players.slice(0, 3).map((player) => (
                    <img
                      key={player.id}
                      src={`/userIcons/${player.icon}`}
                      alt={player.username}
                      className="playerIcon"
                      data-username={player.username}
                    />
                  ))}
                  {campaign.players.length > 3 && <span className="ellipsis">...</span>}
                  </div>
                </div>
              </div>
              <button
              className="invitePlayerButton"
                onClick={(event) => handleInvitePlayer(event, campaign.id, campaign.title)}
              > 
                +invite a player
              </button>
                <InvitePlayerForm
                  isOpen={isInvitePopupOpen}
                  onClose={closeInvitePopup}
                  onSubmit={handleSubmitInvite}
                  campaignId={selectedCampaignId}
                  campaignTitle={selectedCampaignTitle}
                />
              </div>
            ))
          ) : (
            <p>No campaigns to display.</p>
          )}
        <div className="createCampaignContainer" onClick={() => navigate("/createCampaign")}>
          + Create a campaign
        </div>
      </div>

      <div className="invitedCampaignsContainer">
        <div className="invitedCampaignsHeader">
          Pending Campaign Invites
          </div>
          {campaigns && campaigns.length > 0 ? (
            campaigns
            .filter (campaign => campaign.userRole === "invited")
            .map((campaign) => (
              <div className="invitedCampaignRow" key={campaign.id}>
                <div className="campaignTitle">{campaign.title}</div>
                <button
                onClick={() => acceptCampaignInvite(campaign.id)}
                >
                  Accpet Invitation
                </button>

                <button
                onClick={() => rejectCampaignInvite(campaign.id)}
                >
                  Decline Invitation
                </button>
              </div>
            ))
          ) : (
            <p>No pending campaign invitation</p>
          )}
      </div>
      </div>

    </div>
  );
}

export default ProfilePage