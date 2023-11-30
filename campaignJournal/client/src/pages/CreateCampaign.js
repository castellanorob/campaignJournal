import React, { useEffect } from "react";
import {Formik, Form, Field, ErrorMessage} from "formik";
import * as Yup from 'yup';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FormikControl from "../components/FormikControl";
import { APIURL } from "../helpers/APIURL";

function CreateCampaign() {

    let navigate = useNavigate();
    const headers = {
        accessToken: localStorage.getItem("accessToken")
      }

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");

        if(!accessToken) {
            navigate("/");
        }
    }, [])

    const initialValues  ={
        title: "",
        selectOption: "",
        role: ""
    }

    const validationSchema = Yup.object().shape({
        title: Yup.string().max(50).required(),
        selectOption: Yup.string().required('Player Selection is Required')
    });

    const dropdownOptions = [
        { key: 'Select player type', value: ''},
        { key: 'Game Master', value: 'gameMaster'},
        { key: 'Player', value: 'player'}
    ]

    const onSubmit = (data) => {
        const userId = localStorage.getItem("userId");
        const role = data.selectOption === 'gameMaster' ? 'gameMaster' : 'player';

        axios.post(`${APIURL}/Campaign/${userId}`, data, {headers})
          .then((response) =>{
            if(response.data.error){
                alert(response.data.error);
            } else {
                const campaignPlayer = {
                    campaignId: response.data.id,
                    userId: userId,
                    role: role
                }
                axios.post(`${APIURL}/CampaignPlayers`, campaignPlayer);
                navigate("/");
            }
        });
    }

    return(
        <div className="createCampaignPage">
            <Formik initialValues={ initialValues } onSubmit={ onSubmit } validationSchema={ validationSchema }>
                <Form className="formContainer">
                    <label>Campaign</label>
                    <ErrorMessage name="title" component="span" />
                    <Field 
                        as="textarea"
                        id="inputCreatePost"
                        name="title"
                        placeholder="Enter Campaign Name"
                    />

                    <FormikControl
                        control='select'
                        label=''
                        name='selectOption'
                        options={dropdownOptions}
                    />

                    <button type="submit">Create New Campaign</button>
                </Form>
            </Formik>
        </div>
    );
}
export default CreateCampaign