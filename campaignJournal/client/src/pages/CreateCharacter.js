import React, { useEffect, useContext } from "react";
import {Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { APIURL } from "../helpers/APIURL";
import { AuthContext } from "../helpers/AuthContext";

function CreateCharacter() {

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

    }, [navigate, isAuthCheckComplete, authState])

    const initialValues  ={
        characterName: "",
        type: "",
        description: "",
        status: "",
    }

    const validationSchema = Yup.object().shape({
        name: Yup.string().max(500).required("At least type something in!"),
        description: Yup.string().max(5000).required("At least type something in!"),
        status: Yup.string().max(500).required("At least type something in!")
    });

    const newCharacter = (data) => {
        console.log("It's being called")
        data.campaignId = sessionStorage.getItem("campaignId");
        axios.post(`${APIURL}Characters`, data)
        .then((response) =>{
            if(response.data.error){
                alert(response.data.error);
            }else{
                navigate("/Characters")
            }
        });
    }

    return(
        <div className="createCharacterPage">
            <Formik initialValues={ initialValues } onSubmit={ newCharacter } validationSchema={validationSchema}>
                <Form className="createCharacterContainer">
                    <label className="characterLabel">Character Name</label>
                    <ErrorMessage name="characterName" component="span" />
                    <Field as="textarea" id="inputCharacterName" name="name" placeholder="Name this character..." />

                    <label className="characterLabel">Character Description</label>
                    <ErrorMessage name="characterDescription" component="span" />
                    <Field as="textarea" id="inputCharacterDescription" name="description" placeholder="What's the deal with this guy?" />

                    <label className="characterLabel">Character Status</label>
                    <ErrorMessage name="characterStatus" component="span" />
                    <Field as="textarea" id="inputCharacterStatus" name="status" placeholder="How are they doing? Still tickin'?" />

                    <Field as="select" name="type">
                        <option value="playerCharacter">Player Character</option>
                        <option value="nonPlayerCharacter">Non-Player Character</option>
                    </Field>
                    <button type="submit">Submit Character</button>
                </Form>
            </Formik>
        </div>
    );
}
export default CreateCharacter;