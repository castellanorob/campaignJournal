import React, { useEffect, useContext } from "react";
import {Formik, Form, Field, ErrorMessage} from "formik";
import * as Yup from 'yup';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { APIURL } from "../helpers/APIURL";
import { AuthContext } from "../helpers/AuthContext";


function AddFriend() {
    let navigate = useNavigate();
    const { authState, isAuthCheckComplete } = useContext(AuthContext);

    useEffect(() => {

        if(!isAuthCheckComplete){
            return
        }

        if(!authState.status) {
            navigate("/");
        }
    },[navigate, authState, isAuthCheckComplete])

    const initialValues  ={
        receiverInfo: "",
    }

    const validationSchema = Yup.object().shape({
        receiverInfo: Yup.string().max(500).required("Type in your friend's username or email")
    });

    const friendRequest = (data) => {      
        axios.get(`${APIURL}Users/findUser/${data.receiverInfo}`)
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
                axios.post(`${APIURL}Friends/friendRequest`, friendRequestData)
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