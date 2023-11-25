import React from "react";
import {Formik, Form, Field, ErrorMessage} from "formik";
import * as Yup from 'yup';
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom";

function ResetPassword(){
    const {token} = useParams();   
    const navigate = useNavigate();

    const initialValues  ={
        email: "",
        username: "",
        password: "",
        password2: ""
    }

    const validationSchema = Yup.object().shape({
        email: Yup.string().email("Invalid email address").required("Email is required"),
        username: Yup.string().min(3).max(15).required("Username is required"),
        password: Yup.string().min(3).max(20).required("Password is required"),
        password2: Yup.string().min(3).max(20).required("Confirm your new password"),
    });

    const onSubmit = (data) =>{
        if(data.password2 === data.password){

            const newUserData = {
                username: data.username,
                email: data.email,
                password: data.password,
            }

            axios.post(`http://localhost:3001/Users/resetPassword/${token}`, newUserData).then(async (response) =>{
                if(response.data.error){
                    alert(response.data.error);
                }else {
                    alert("Password updated successfully");
                    navigate("/Login")
                }
            }).catch(error => {
                console.error(error.response.data);
                alert(error);
            });
        }else{
            alert("Passwords must match");
        }
    };

    return(
        <div>
            <Formik initialValues={ initialValues } onSubmit={onSubmit} validationSchema={validationSchema}>
                <Form className="registrationContainer">
                    <label>Email</label>
                    <ErrorMessage name="username" component="span" />
                    <Field 
                        type="email"
                        id="input"
                        name="email"
                        placeholder="Email..."
                    />

                    <label>Username</label>
                    <ErrorMessage name="username" component="span" />
                    <Field 
                    id="input"
                    name="username"
                    placeholder="Username..." />

                    <label>Password</label>
                    <ErrorMessage name="password" component="span" />
                    <Field 
                    type ="password"
                    id="input"
                    name="password"
                    placeholder="Password..." />
                    
                    <label>Confirm password</label>
                    <ErrorMessage name="password2" component="span" />
                    <Field 
                    type ="password"
                    id="input"
                    name="password2"
                    placeholder="password2..." />
                           

                    <button type="submit">Submit</button>
                </Form>
            </Formik>
        </div>
    )
}

export default ResetPassword;