import React, { useEffect } from "react";
import {Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateCharacter() {

    let navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        const campaignId = sessionStorage.getItem("campaignId");

        if(!accessToken || !campaignId) {
            navigate("/");
        }
    })

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
        axios.post("http://localhost:3001/Characters",
        data,
        {
            headers: {
                accessToken: localStorage.getItem("accessToken")            
            }
        }).then((response) =>{
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