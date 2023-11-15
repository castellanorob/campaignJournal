import React, { useState } from 'react';

const InvitePlayerForm = ({ isOpen, onClose, onSubmit, campaignId, campaignTitle }) => {
  const [userInfo, setUserInfo] = useState('');
//  const [message, setMessage] = useState(''); Will allo users to send a message with the invite

  const handleSend = () => {
    onSubmit(userInfo, campaignId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="popup">
        <h2>Invite a player to {campaignTitle}</h2>
      <input
        type="text"
        placeholder="Username or email"
        value={userInfo}
        onChange={(e) => setUserInfo(e.target.value)}
      />

      <button 
      className='sendPlayerInviteButton'
      onClick={handleSend}
      >
        Send
      </button>

      <button 
      className='sendPlayerInviteButton'
      onClick={onClose}>
        Close
      </button>
    </div>
  );
};

export default InvitePlayerForm;