import React, { useState } from "react";
import api from "../api";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBCardImage,
    MDBInput,
    MDBIcon,
}
    from 'mdb-react-ui-kit';

function App() {
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState("");
    const [err, setErr] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        setErr(false);
        setUserDetails({
          ...userDetails, [e.target.name] : e.target.value
        })
      }

      const submitHandler = async (e) =>{
        e.preventDefault();
        console.log(userDetails);
        if (!userDetails.confirm) {
            setErrorMessage('fill all fields.');
            return
        }
        try {
          const response = await api.post("/users/signup", JSON.stringify(userDetails),
          {
            headers: {"Content-Type": 'application/json'},
            withCredentials: false,
  
          });
          console.log(response);
          const user_email = response?.data?.data?.email;
          const message = response?.data?.message

          localStorage.setItem('userId', user_email);

          if(response.status === 201){
            localStorage.setItem("user", true);
          }
          setErrorMessage(message)
          navigate('/login');
    
        } catch (error) {
          setErr(true);
          console.log(error)
          if (!error?.response){
            setErrorMessage("No server response");
          }else if (error.response?.status === 400){
            setErrorMessage(error.response.data.message);
          }else{
            setErrorMessage(error.response.data.message);
          }
        }
      }
    
    return (
        <div>

            <Header />
            <MDBContainer fluid>

                <MDBCard className='text-black m-5' style={{ borderRadius: '25px' }}>
                    <MDBCardBody>
                        <MDBRow>
                            <MDBCol md='10' lg='6' className='order-2 order-lg-1 d-flex flex-column align-items-center'>

                                <p classNAme="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Sign up</p>
                                <h5 style={{ color:'red'}}>{errorMessage}</h5>
                                <div className="d-flex flex-row align-items-center mb-4">
                                    <MDBIcon fas icon="envelope me-3" size='lg' />
                                    <MDBInput label='Your Email' required id='email' type='email' name='email' onChange={handleChange} />
                                </div>

                                <div className="d-flex flex-row align-items-center mb-4">
                                    <MDBIcon fas icon="lock me-3" size='lg' />
                                    <MDBInput label='Password' id='password' name='password' required type='password' onChange={handleChange}/>
                                </div>

                                <div className="d-flex flex-row align-items-center mb-4">
                                    <MDBIcon fas icon="key me-3" size='lg' />
                                    <MDBInput label='Repeat your password' required name='confirm' id='confirm' type='password' onChange={handleChange}/>
                                </div>

                                <MDBBtn className='mb-4' size='lg' onClick={submitHandler}>Register</MDBBtn>

                            </MDBCol>

                            <MDBCol md='10' lg='6' className='order-1 order-lg-2 d-flex align-items-center'>
                                <MDBCardImage src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp' fluid />
                            </MDBCol>

                        </MDBRow>
                    </MDBCardBody>
                </MDBCard>

            </MDBContainer>
        </div>
    );
}

export default App;