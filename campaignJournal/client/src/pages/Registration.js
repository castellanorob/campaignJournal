import React from "react";
import {Formik, Form, Field, ErrorMessage} from "formik";
import * as Yup from 'yup';
import axios from "axios"

function Registration(){
    const initialValues  ={
        username: "",
        password: "",
    }

    const validationSchema = Yup.object().shape({
        username: Yup.string().min(3).max(15).required("Username is required"),
        password: Yup.string().min(3).max(20).required("Password is required"),
    });

    const onSubmit = (data) =>{
        axios.post("http://localhost:3001/Users/register", data).then(() =>{
            console.log(data)
        });
    };

    return(
        <div>
            <Formik initialValues={initialValues } onSubmit={onSubmit} validationSchema={validationSchema}>
                <Form className="formContainer">
                    <label>Username</label>
                    <ErrorMessage name="username" component="span" />
                    <Field 
                    id="inputCreatePost"
                    name="username"
                    placeholder="username" />

                    <label>Password</label>
                    <ErrorMessage name="password" component="span" />
                    <Field 
                    type ="password"
                    id="inputCreatePost"
                    name="password"
                    placeholder="password" />
                    <button type="submit">Register</button>
                </Form>
            </Formik>
        </div>
    )
}

export default Registration;