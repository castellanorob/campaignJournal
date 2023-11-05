import React from "react";
import {Formik, Form, Field, ErrorMessage} from "formik";
import * as Yup from 'yup';
import axios from "axios"
import FormikControl from "../components/FormikControl";

function Registration(){
    const initialValues  ={
        username: "",
        password: "",
        email: "",
        selectOption: ''
    }

    const validationSchema = Yup.object().shape({
        username: Yup.string().min(3).max(15).required("Username is required"),
        password: Yup.string().min(3).max(20).required("Password is required"),
        email: Yup.string().email("Invalid email address").required("Email is required"),
        selectOption: Yup.string().required('Player Selection is Required')
    });

    const dropdownOptions = [
        { key: 'Select player type', value: ''},
        { key: 'Game Master', value: 'gameMaster'},
        { key: 'Player', value: 'player'}
    ]

    const onSubmit = (data) =>{
        axios.post("http://localhost:3001/Users/register", data).then((response) =>{
            console.log(response.data)
        }).catch(error => {
            console.error(error.response.data);
        });
    };

    return(
        <div>
            <Formik initialValues={ initialValues } onSubmit={onSubmit} validationSchema={validationSchema}>
                <Form className="registrationContainer">
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
                    
                    <label>Email</label>
                    <Field 
                        type="email"
                        id="input"
                        name="email"
                        placeholder="Email..."
                    />

                    <FormikControl
                        control='select'
                        label=''
                        name='selectOption'
                        options={dropdownOptions}
                    />

                    <button type="submit">Register</button>
                </Form>
            </Formik>
        </div>
    )
}

export default Registration;