import React, { useEffect } from "react";
import {Formik, Form, Field, ErrorMessage} from "formik";
import * as Yup from 'yup';
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateJournalEntry() {

    let navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        const campaignId = sessionStorage.getItem("campaignId");

        if(!accessToken || !campaignId) {
            navigate("/");
        }
    })

    const initialValues  ={
        journalBody: "",
    }

    const validationSchema = Yup.object().shape({
        journalBody: Yup.string().max(500).required("At least type something in!")
    });

    const writeEntry = (data) => {
        data.userId = localStorage.getItem("userId");
        data.campaignId = sessionStorage.getItem("campaignId");
        axios.post("http://localhost:3001/JournalEntries",
        data,
        {
            headers: {
                accessToken: localStorage.getItem("accessToken")            
            }
        }).then((response) =>{
            if(response.data.error){
                alert(response.data.error);
            }else{
                navigate("/CampaignJournal")
            }
        });
    }

    return(
        <div className="writeEntryPage">
            <Formik initialValues={ initialValues } onSubmit={ writeEntry } validationSchema={validationSchema}>
                <Form className="writeEntryContainer">
                    <label className="journalLabel">Journal Entry</label>
                    <ErrorMessage name="journalBody" component="span" />
                    <Field 
                    as="textarea"
                    id="inputJournalEntry"
                    name="journalBody"
                    placeholder="Write your journal entry here" />
                    <button type="submit">Submit Journal Entry</button>
                </Form>
            </Formik>
        </div>
    );
}
export default CreateJournalEntry