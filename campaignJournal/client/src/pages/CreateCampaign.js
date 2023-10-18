import React, { useEffect } from "react";
import {Formik, Form, Field, ErrorMessage} from "formik";
import * as Yup from 'yup';
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateCampaign() {

    let navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");

        if(!accessToken) {
            navigate("/");
        }
    }, [])

    const initialValues  ={
        title: "",
    }

    const validationSchema = Yup.object().shape({
        title: Yup.string().max(50).required()
    });

    const onSubmit = (data) => {
        const userId = localStorage.getItem("userId");
        axios.post(`http://localhost:3001/Campaign/${userId}`,
        data,
        {
            headers: {
                accessToken: localStorage.getItem("accessToken")            
            }
        }).then((response) =>{
            if(response.data.error){
                alert(response.data.error);
            } else {
                const campaignPlayer = {
                    campaignId: response.data.id,
                    userId: userId,
                }
                axios.post('http://localhost:3001/CampaignPlayers', campaignPlayer);
                navigate("/");
            }
        });
    }

    return(
        <div className="createPostPage">
            <Formik initialValues={initialValues } onSubmit={onSubmit} validationSchema={validationSchema}>
                <Form className="formContainer">
                    <label>Campaign</label>
                    <ErrorMessage name="title" component="span" />
                    <Field 
                    as="textarea"
                    id="inputCreatePost"
                    name="title"
                    placeholder="Enter Campaign Name" />
                    <button type="submit">Create New Campaign</button>
                </Form>
            </Formik>
        </div>
    );
}
export default CreateCampaign