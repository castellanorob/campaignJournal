import React, { useEffect } from "react";
import {Formik, Form, Field, ErrorMessage} from "formik";
import * as Yup from 'yup';
import axios from "axios";
import { useNavigate } from "react-router-dom";


function AddFriend() {
    let navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");

        if(!accessToken) {
            navigate("/");
        }
    },[navigate])

    const initialValues  ={
        receiverInfo: "",
    }

    const validationSchema = Yup.object().shape({
        receiverInfo: Yup.string().max(500).required("Type in your friend's username or email")
    });

    const friendRequest = (data) => {

        const headers = {
            accessToken: localStorage.getItem("accessToken")
        }
        
        axios.get(`http://localhost:3001/Users/findUser/${data.receiverInfo}`, {headers})
        .then((response) => {
            if(response.data.error){
                alert(response.data.error)
            } else {
                console.log(`response from findUser: ${JSON.stringify(response.data)} `);
                // data.requesterId = localStorage.getItem("userId");
                // data.receiverId = response.data.userId;

                const friendRequestData = {
                    senderId: localStorage.getItem("userId"),
                    receiverId: response.data.id,
                    senderUsername: response.data.username,
                    senderEmail: response.data.email
                }

                console.log(`friendRequestData: ${JSON.stringify(friendRequestData)}`);
                axios.post(`http://localhost:3001/Friends/friendRequest`, friendRequestData, {headers})
                .then((response) => {
                    if(response.data.error){
                        alert(response.data.error);
                    }else{
                        alert("Friend request sent!");
                        navigate("/");
                    }
                })
            }
        }).catch(error => {if(error.response.status === 404){
            alert("User not found");
        } else{
            alert(error);
        }});
    }

    return(
        <div className="createPostPage">
            <Formik initialValues={ initialValues } onSubmit={ friendRequest } validationSchema={validationSchema}>
                <Form className="formContainer">
                    <label>Friend Request</label>
                    <ErrorMessage name="receiverInfo" component="span" />
                    <Field 
                    as="textarea"
                    id="submitFriendRequest"
                    name="receiverInfo"
                    placeholder="Type your friends username or email" />
                    <button type="submit">Send Friend Request</button>
                </Form>
            </Formik>
        </div>
    );
}

export default AddFriend