import React, { useState } from 'react';
import axios from 'axios';
import { APIURL } from "../helpers/APIURL";

const EditProfile = ({ isOpen, onClose, onSubmit, email, username}) => {
    
    const [selectedFile, setSelectedFile] = useState(null);
    const [newUsername, setNewUsername] = useState(localStorage.getItem("username"));
    const [newUserEmail, setNewUserEmail] = useState(localStorage.getItem("email"));
    
    
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    if (!isOpen) return null;

    const handleUpdate = async () => {

        const formData = new FormData();

        formData.append('username', newUsername);
        formData.append('email', newUserEmail);
        formData.append('userId', localStorage.getItem("userId"))
        if (selectedFile instanceof File) {
            formData.append('icon', selectedFile);
        }

        for(let [key, value] of formData.entries()){
            console.log(`formdata {${key}:${value}}`)
        }

        axios.post(`${APIURL}Users/updateUser`, formData)
        .then((response) => {
            if(response.data.error){
                alert(`Unable to update profile: ${response.data.error}`);
            }else{
                console.log(`updated user data, response data: ${JSON.stringify(response.data)}`)
                onSubmit(response.data)
            }
        })
        
    };
    
    return (
        <div className="editProfilePopup">
            <div className="editUserIcon">
                <div className='NewUserIcon'>
                    <label>Upload new profile image</label>
                    <input type='file' onChange={handleFileChange} accept='image/*' />
                </div>
            </div>
            <div className='editUsername'>
                <div className='newUsername'>
                    <label>Update username</label>
                    <input
                        type="text"
                        placeholder={username}
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}/>
                </div>
            </div>
            <div className='editUserEmail'>
                <div className='newUserEmail'>
                    <input
                        type="text"
                        placeholder={email}
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}/>
                </div>
            </div>
            <div>
                <button
                className='editProfileButton'
                onClick={handleUpdate}>
                    EditProfile
                </button>
            </div>
            <div>
                <button
                className='editProfileButton'
                onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default EditProfile;