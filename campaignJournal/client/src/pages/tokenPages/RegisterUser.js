import React from "react";
import {Formik, Form, Field, ErrorMessage} from "formik";
import * as Yup from 'yup';
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom";

function RegisterUser(){
    const {token} = useParams();   
    const navigate = useNavigate();

    alert("Your account has been registered, click ok be redirected to the login page")
    navigate("/")
}

export default RegisterUser;