import React, { useEffect, useContext } from "react";
import {Formik, Form, Field, ErrorMessage} from "formik";
import * as Yup from 'yup';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FormikControl from "../components/FormikControl";
import { APIURL } from "../helpers/APIURL";
import { AuthContext } from "../helpers/AuthContext";
import quill_white from "../resources/quill_white.png";

function CreateJournalEntry() {

    let navigate = useNavigate();
    const { authState, isAuthCheckComplete } = useContext(AuthContext);

    useEffect(() => {

        const campaignId = sessionStorage.getItem("campaignId");

        if(!isAuthCheckComplete){
            return
        }

        if(!authState.status || !campaignId) {
            navigate("/");
        }


    },[navigate, isAuthCheckComplete, authState])

    const initialValues  ={
        journalBody: "",
        selectOption: "",
        private:""
    }

    const validationSchema = Yup.object().shape({
        journalBody: Yup.string().max(5000).required("At least type something in!"),
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

        if (data.selectOption === "private") {
            selection.privateEntry = true;
        } else {
            selection.privateEntry = false;
        }

        axios.post(`${APIURL}JournalEntries`,
        selection)
          .then((response) =>{
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

                    <FormikControl
                        control='select'
                        label=''
                        name='selectOption'
                        options={dropdownOptions}
                    />

                    <button type="submit">
                        <img src={quill_white}
                            className='profileButtonIcon'
                            alt="quill" 
                            style={{ marginRight: '5px'}}
                        />
                        <span style={{ position: 'relative', top: '-7px', color: "white"}}>Write Entry</span>
                    </button>
                </Form>
            </Formik>
        </div>
    );
}
export default CreateJournalEntry