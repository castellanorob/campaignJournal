import React, { useState } from 'react';

const ForgotPassword = ({ isOpen, onClose, onSubmit}) => {
  const [email, setEmail] = useState('');
//  const [message, setMessage] = useState(''); Will allo users to send a message with the invite

  const handleResetPassword = () => {
    onSubmit(email);
  };

  if (!isOpen) return null;

  return (
    <div className="forgotPasswordPopup">
        <h2>Please enter your email to receive a password reset link</h2>
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button 
      className='passwordResetButton'
      onClick={handleResetPassword}
      >
        Reset password
      </button>

      <button 
      className='passwordResetButton'
      onClick={onClose}>
        Close
      </button>
    </div>
  );
};

export default ForgotPassword;