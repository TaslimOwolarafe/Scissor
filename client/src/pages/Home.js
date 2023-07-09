import React, { useState } from "react";
import api from "../api";
import Header from "../components/Header";

import { CopyToClipboard } from "react-copy-to-clipboard"
// import useAuth from "../hooks/UseAuth";
import saveas from 'file-saver'

import {
    MDBInput,
    MDBContainer,
    MDBBtn,
    MDBCol,
    MDBIcon
} from "mdb-react-ui-kit";

function Home() {
    // const { auth } = useAuth();
    const token = localStorage.getItem('accessToken')
    const refresh = localStorage.getItem('refreshToken')
    // console.log(token, refresh)
    const [errorMessage, setErrorMessage] = useState(
        "Enter a valid URL"
    );
    const [urlDetails, setUrlDetails] = useState("");
    const [qrCodeSrc, setQRCodeSrc] = useState(process.env.PUBLIC_URL+"Solid_white.svg.webp");
    const [shortLink, setShortLink] = useState("")

    const [isCopied, setIsCopied] = useState(false);
    const [copyDetail, setCopyDetail] = useState("copy");
    const qrEndpoint = 'https://api.qrserver.com/v1/create-qr-code/';
    const size = '100x100';
        
    const onCopyText = () => {
        setIsCopied(true);
        setCopyDetail('Copied!');
        setTimeout(() => {
        setIsCopied(false);
        setCopyDetail('Copy');
        }, 5000);
        
    };

    const handleChange = (e) => {
        setUrlDetails({
            ...urlDetails,
            [e.target.name]: e.target.value,
        });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        // console.log(urlDetails);
        try {
            const response = await api.post(
                "/links/create",
                JSON.stringify(urlDetails),
                {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    }
                },
            );
            const res = response.data;
            setShortLink(window.location.href+res.url_id)
            setErrorMessage("Copy URL and download QR Code.");

            const endpoint = 'https://api.qrserver.com/v1/create-qr-code/';
            const data = shortLink;

            const url = `${endpoint}?data=${encodeURIComponent(data)}&size=${size}`;
                setQRCodeSrc(url)
                // console.log(qrCodeSrc)


        } catch (error) {
            // Handle error
            if (error.response && error.response.status === 404) {
              setErrorMessage('404 Not Found');
            } else if (error.response && error.response.status === 400){
              setErrorMessage(error.response.data.message);
            //   console.log(error)
            }
            // console.log(error);
          }

        };

    

    return (
        <div style={{ height: "100%" }}>
            <Header />
            <MDBContainer
                className="gy-5 d-flex justify-content-center"
                style={{
                    // height: "75%",
                    width: "700px",
                    margin: "50px auto",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <MDBContainer className="gy-1" style={{ height: "fit-content" }}>
                    <h3 style={{ padding: "10px 0"}}>Shorten your long URLs..</h3>
                    <MDBCol>
                        <MDBInput
                            label="Title"
                            className="title mb-1 p-2"
                            id="formControlLg"
                            required
                            name="title"
                            type="text"
                            size="md"
                            onChange={handleChange}
                        />
                    </MDBCol>
                    <MDBCol>
                        <MDBInput
                            label="URL"
                            className="mb-2 p-2"
                            id="target"
                            required
                            name="target"
                            type="url"
                            onChange={handleChange}
                        />
                    </MDBCol>
                    {errorMessage && <p>{errorMessage}</p>}
                    <MDBBtn size="md" height="15px" onClick={ submitHandler }>
                        Generate
                    </MDBBtn>
                </MDBContainer>
                <MDBContainer style={{margin: "50px 0", display: "flex", justifyContent:"space-between", alignItems:'center'}}>
                    <figure className="figure">
                        <img
                            height={'120px'} width={'120px'}
                            src={(qrCodeSrc != null||shortLink != null)?qrCodeSrc:process.env.PUBLIC_URL+"Solid_white.svg.webp"}
                            className="figure-img img-fluid rounded shadow-3 mb-1"
                            alt="..."
                        />
                        <figcaption className="figure-caption">
                            QR Code
                        </figcaption>
                        <MDBIcon onClick={()=>{setQRCodeSrc(`${qrEndpoint}?data=${encodeURIComponent(shortLink)}&size=${size}`)}} fas icon="redo" />
                        <a style={{ margin: "auto 10px" }} id="download_image_1" href={qrCodeSrc} download>Download</a>
                    </figure>
                    <div style={{height:'fit-content'}}>
                    <MDBInput className="mb-1" label='Link goes here..' value={shortLink} id='form1' type='text' />
                        {/* <p>{shortLink}</p> */}
                        <CopyToClipboard text={shortLink} onCopy={onCopyText}>
                            <div className="copy-area">
                                <MDBBtn color='info btn-sm' className={`copy-feedback ${isCopied ? "active" : ""}`}>
                                    {copyDetail}
                                </MDBBtn>
                            </div>
                        </CopyToClipboard>
                    </div>
                </MDBContainer>
            </MDBContainer>
        </div>
    );
}



export default Home;
