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
    },[navigate, authState, isAuthCheckComplete, authState])

    const initialValues  ={
        receiverInfo: "",
    }

    const validationSchema = Yup.object().shape({
        receiverInfo: Yup.string().max(500).required("Type in your friend's username or email")
    });

    const friendRequest = (data) => {
        console.log(`inside friend request. Data: ${JSON.stringify(data)}`)
        data.senderId = localStorage.getItem("userId");
        data.senderEmail = localStorage.getItem("email")
        axios.post(`${APIURL}Friends/friendRequest`, data)
        .then((response) => {
            alert(JSON.stringify(response.data))
        })
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