import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate} from "react-router-dom";
import InvitePlayerForm from "../Forms/InvitePlayerForm";
import { APIURL } from "../helpers/APIURL";
import { AuthContext } from "../helpers/AuthContext";
import EditProfile from "../Forms/EditProfile";
import addFriendsIcon from "../resources/addFriendsIcon.png";
import spellIcon from "../resources/spellIcon.png";
import swordIcon from "../resources/swordIcon.png";
import crystalBallIcon from "../resources/crystalBallIcon.png";

function ProfilePage() {
  const [campaigns, setCampaigns] = useState([]);
  const [friends, setFriends] = useState([]);
  const [requests, setFriendRequests] = useState([]);
  const [isInvitePopupOpen, setInvitePopupOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [selectedCampaignTitle, setSelectedCampaignTitle] = useState(null);
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [user, setUser] = useState({
    userId: localStorage.getItem("userId"),
    username: localStorage.getItem("username"),
    icon: localStorage.getItem("icon"),
    email: localStorage.getItem("email")
  })
  const [profileIconUrl, setprofileIconUrl] = useState(null)

  const navigate = useNavigate();
  const { authState, isAuthCheckComplete } = useContext(AuthContext);

  const userId = user.userId;

  useEffect(() => {
    
    console.log(`isAuthCheckComplete ${isAuthCheckComplete}`)
    console.log(`authState: ${authState.status}`)

    if(!isAuthCheckComplete){
      return
    }

    if (!authState.status) {
      navigate("/Login");
      return;
    }

    setprofileIconUrl(`${APIURL}ProfileIcons/${user.icon}`)
    console.log(`inside useState profileIconUrl: ${profileIconUrl}`)

    // Fetch friends and campaigns, then update the state

    console.log(`before fetchData - userInformation${JSON.stringify(user)}`)
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
  }, [navigate, isAuthCheckComplete, authState, user]);

  async function fetchFriends() {
    try {
      const response = await axios.get(`${APIURL}Friends/${userId}`);

      if (response.data.error) {
        alert(JSON.stringify(response.data.error));
        console.error(response.data.error);
        return [];
      }

      console.log(`fetch friends for ${userId} response before filtering ${JSON.stringify(response.data)}`);
      const relationships = response.data.filter((relationship) => relationship.userId !== userId);

      console.log(`fetch friends for ${userId} after filtering ${JSON.stringify(relationships)}`);

      const friendPromises = relationships.map(async (relationship) => {
        const friendId = relationship.friendId;
        const friendResponse = await axios.get(`${APIURL}Users/${friendId}`);
        return friendResponse.data;
      });

      return await Promise.all(friendPromises);
    } catch (error) {
      console.error(JSON.stringify(error));
      return [];
    }
  }

  async function fetchFriendRquests() {
    console.log(`getting friend requests for ${user.username}, userId: ${userId}`);
    try {
      const response = await axios.get(`${APIURL}Friends/friendRequests/${userId}`);

      if (response.data.error) {
        alert(response.data.error.message);
        console.error(response.data.error);
        return [];
      }

      const friendRequestPromises = response.data.map(async (friendRequest) => {
        const senderId = friendRequest.senderId;
        console.log(`getting info for ${senderId}`)
        const senderInfo = await axios.get(`${APIURL}Users/${senderId}`);
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
      const response = await axios.get(`${APIURL}CampaignPlayers/${userId}`);
  
      if (response.data.error) {
        alert(response.data.error);
        console.log(`response error:${response.data.error}`)
        return [];
      }
  
      const campaignPromises = response.data.map(async (playerCampaign) => {
        const campaignResponse = await axios.get(`${APIURL}Campaign/${playerCampaign.campaignId}`);
        console.log(`campaignResponse:`, campaignResponse.data);
        
        let players = [];
        let userRole = "";
        if (campaignResponse.data && campaignResponse.data.id) {
          const campaignPlayersResponse = await axios.get(`${APIURL}CampaignPlayers/campaigners/${campaignResponse.data.id}`);
          const playerIds = campaignPlayersResponse.data.map(cp => cp.userId);
          
          console.log(`player ids: ${playerIds}`)
          const playerDetailsPromises = playerIds.map(playerId => 
            axios.get(`${APIURL}Users/${playerId}`)
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

    axios.post(`${APIURL}Friends/addFriends`, data)
    .then((response) => {
      if(response.data.error){
        alert(response.data.error);
      }else{
          let friendRequestData = {
            senderId: senderId,
            receiverId: userId,
            status: "accepted"
          }
          axios.post(`${APIURL}Friends/updateFriendRequest`, friendRequestData)
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

    axios.post(`${APIURL}CampaignPlayers/updateRole`, data)
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

    axios.post(`${APIURL}CampaignPlayers/updateRole`, data)
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

    axios.post(`${APIURL}Friends/updateFriendRequest`, data)
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

    axios.post(`${APIURL}Users/inviteUser/${userInfo}`,{campaignId: campaignId})
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

  const handleEditProfile = (event) => {
    event.stopPropagation();
    setEditProfilePopupOpen(true);
  }

  const handleEditProfileRequest = (data) => {

    alert(`Profile updated`);
    console.log(`Edit profile - data: ${JSON.stringify(data)}\nEdit profile - before setuser. user: ${JSON.stringify(user)}`);
    setUser(data);
    console.log(`Edit profile - after set user ${JSON.stringify(user)}`)
    closeEditProfilePopUp();
  }

  const closeEditProfilePopUp = () => {
    setEditProfilePopupOpen(false);
  }

  console.log(`before html, profileiconurl: ${profileIconUrl}`);
  console.log(`before html, campaigns: ${JSON.stringify(campaigns)}`);

  return (
    <div className="profilePage">
      <div className="topContainer">
        <div className="userInfoContainer">
          {console.log(`inside profilepic div ${profileIconUrl}`)}
          <img src={profileIconUrl} alt="User Icon" className="userIcon" />
          <div className="userInfo">
            <div className="userName">{user.username}</div>
            <div className="userEmail">{user.email}</div>
          </div>
          <div className="profileEditButtonContainer">
            <button className="profileEditButton" onClick={(event) => handleEditProfile(event)}
            style={{ position: 'relative', top: '-5px' }}>
            <img src={spellIcon}
              className='profileButtonIcon'
              alt="spellIcon" 
              style={{ marginRight: '5px'}}
            />
              <span style={{ position: 'relative', top: '-7px', color: "black"}}>Edit Profile</span>
            </button>
          </div>
        </div>
        <div className="friendsListContainer">
          <div className="friendsHeader">Your Friends</div>
          {friends && friends.length > 0 ? (
            friends.map((friend) => (
              <div className="friendName" key={friend.id}>
                <img src={`${APIURL}ProfileIcons/${friend.icon}`} alt={`${friend.username}`} className="friendImage" />
                {friend.username}
              </div>
            ))
          ) : (
            <p>You don't have any friends, yet...</p>
          )}
          <div className="addFriendContainer" onClick={() => {navigate("/AddFriend")}}>
            <img src={addFriendsIcon}
              className='profileButtonIcon'
              alt="friendsIcon" 
              style={{ marginRight: '5px'}}
            />
            <span style={{ position: 'relative', top: '-7px', color: "black"}}>Add Friend</span>
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
        <div className="campaignsHeader">Your Campaigns</div>
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
                      src={`${APIURL}ProfileIcons/${player.icon}`}
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
                <img src={swordIcon}
                  className='profileButtonIcon'
                  alt="swordIcon" 
                  style={{ marginRight: '5px'}}
                />
                <span style={{ position: 'relative', top: '-8px', color: "black"}}>Invite a Player</span>
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
            <p>You're not in any campaigns, yet...</p>
          )}
        <div className="createCampaignContainer" onClick={() => navigate("/createCampaign")}>
          <img src={crystalBallIcon}
              className='profileButtonIcon'
              alt="crystalball" 
              style={{ marginRight: '5px'}}
          />
          <span style={{ position: 'relative', top: '-7px', color: "black"}}>Create a Campaign</span>
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
                  Accept Invitation
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
        <EditProfile
            isOpen={isEditProfilePopupOpen}
            onClose={closeEditProfilePopUp}
            onSubmit={handleEditProfileRequest}
          />
      </div>
    </div>
  );
}

export default ProfilePage