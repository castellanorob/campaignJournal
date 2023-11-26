import React from "react";
import {Formik, Form, Field, ErrorMessage} from "formik";
import * as Yup from 'yup';
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom";

function RegisterUser(){
    const {token} = useParams();   
    const navigate = useNavigate();

    //TODO create back end router for verifying email and setting verification date. Check if token exits > if exists and not expired update verification date and return success else return error
    //TODO front end. If reponse is success, display success message in page and have link for front page "/"
    //TODO if response is token expired, display a message saying link expired > "click here to resend verification email > prompt for username and password > send another verification email"
    //TODO if resopnse is token does not exist, display a message saying invalid verification link and offer link to registration page
}

export default RegisterUser;