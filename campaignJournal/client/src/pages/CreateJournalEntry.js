import React, { useEffect } from "react";
import {Formik, Form, Field, ErrorMessage} from "formik";
import * as Yup from 'yup';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FormikControl from "../components/FormikControl";

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
        selectOption: "",
        private:""
    }

    const validationSchema = Yup.object().shape({
        journalBody: Yup.string().max(500).required("At least type something in!"),
        selectOption: Yup.string().required('Privacy Selection is Required')
    });

    const dropdownOptions = [
        { key: 'Select Privacy type', value: ''},
        { key: 'Public', value: 'public'},
        { key: 'Private', value: 'private'}
    ]

    const writeEntry = (data) => {

        const selection = {
            userId: localStorage.getItem("userId"),
            campaignId: sessionStorage.getItem("campaignId"),
            journalBody: data.journalBody
        }

        if (data.selectOption == "private") {
            selection.privateEntry = true;
        } else {
            selection.privateEntry = false;
        }

        axios.post("http://localhost:3001/JournalEntries",
        selection,
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
            <Formik initialValues={ initialValues } onSubmit={ writeEntry } validationSchema={ validationSchema }>
                <Form className="writeEntryContainer">
                    <label className="journalLabel">Journal Entry</label>
                    <ErrorMessage name="journalBody" component="span" />
                    <Field 
                    as="textarea"
                    id="inputJournalEntry"
                    name="journalBody"
                    placeholder="Write your journal entry here" />

                    <button type="submit">Record Journal Entry</button>

                    <FormikControl
                        control='select'
                        label=''
                        name='selectOption'
                        options={dropdownOptions}
                    />

                    <button type="submit">Submit Journal Entry</button>
                </Form>
            </Formik>
        </div>
    );
}
export default CreateJournalEntry