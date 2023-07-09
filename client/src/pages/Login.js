import React, { useEffect, useState } from "react";
// import { useNavigate } from 'react-router-dom';
import api from "../api";
import useAuth from '../hooks/UseAuth';
import { useNavigate } from 'react-router-dom';

import {
    MDBContainer,
    MDBCol,
    MDBRow,
    MDBBtn,
    MDBIcon,
    MDBInput,
    MDBCheckbox
  }
  from 'mdb-react-ui-kit';

  function Login() {
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    // const location = useLocation();
    // const from = location.state?.from?.pathname || "/";
    const [userDetails, setUserDetails] = useState("");
    const [err, setErr] = useState(false);
    const [errorMessage, setErrorMessage] = useState("Enter your login credentials");
    const normal_notification = "text-base text-custom-brown font-medium";
    const error_notification = "text-base text-red-700 font-medium";
  
    const handleChange = (e) => {
      setErr(false);
      setUserDetails({
        ...userDetails, [e.target.name] : e.target.value
      })
    }
  
    const submitHandler = async (e) =>{
      e.preventDefault();
      console.log(userDetails);
      try {
        const response = await api.post("/users/login", JSON.stringify(userDetails),
        {
          headers: {"Content-Type": 'application/json'},
          withCredentials: false, //Prevents from sending cookies 

        });
        console.log(response);
        const access_token = response?.data?.access_token;
        const refresh_token = response?.data?.refresh_token;
        const user_id = response?.data?.user_id;
        const message = response?.data?.message
        setAuth({userDetails, user_id, access_token, refresh_token, message});
        localStorage.setItem('accessToken', access_token);
        localStorage.setItem('refreshToken', refresh_token);
        localStorage.setItem('userId', user_id);
        // console.log(role, token);
        if(response.status === 200){
          localStorage.setItem("userLoginStatus", true);
        }
        navigate('/');
  
      } catch (error) {
        setErr(true);
        console.log(error)
        if (!error?.response){
          setErrorMessage("No server response");
        }else if (error.response?.status === 400){
          setErrorMessage("Incorrect Username or Password");
        }else{
          setErrorMessage(error.response.data.message);
        }
      }
    }
    // const userLoginStatus = localStorage.getItem("userLoginStatus");
    // if (userLoginStatus === "true"){
    //   window.location = '/'
    // }
  
    useEffect(() => {
      setErrorMessage("Enter your login credentials")
    }, [userDetails])

    return (
        <MDBContainer fluid className="p-3 my-5">
    
          <MDBRow>
    
            <MDBCol col='10' md='6'>
              <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg" class="img-fluid" alt="Phone" />
            </MDBCol>
    
            <MDBCol col='4' md='6'>
            <h3 className={err ? error_notification : normal_notification}>{errorMessage}</h3>
              <MDBInput wrapperClass='mb-4' label='Email address' name="email" id='formControlLg' type='email' required onChange={handleChange} size="lg"/>
              <MDBInput wrapperClass='mb-4' label='Password' name="password" id='formControlLg' type='password' required onChange={handleChange} size="lg"/>
    
    
            {/* {loginError && <p>{loginError}</p>}
            {accessToken && <p>Access Token: {accessToken}</p>}
            {refreshToken && <p>Refresh Token: {refreshToken}</p>}
            {userId && <p>User ID: {userId}</p>}
            {message && <p>Message: {message}</p>} */}
    
              <MDBBtn className="mb-4 w-100" size="lg" onClick={submitHandler}>Sign in</MDBBtn>
    
            </MDBCol>
    
          </MDBRow>
    
        </MDBContainer>
      );
    }
    
export default Login;

