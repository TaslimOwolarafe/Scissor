import React, { useEffect, useState } from "react";
import api from "../api";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';

const RedirectHandler= ()=>{
        const { pathname } = useLocation();
        const Navigate = useNavigate();
        let {link_id} = useParams();

        const [urlData, setUrlData] = useState({});
        
        useEffect(()=>{
            const getClientInformation = () => {
                const timezone_name = Intl.DateTimeFormat().resolvedOptions().timeZone;
                const timezone_offset = new Date().getTimezoneOffset();
                const timezone_id = Intl.DateTimeFormat().resolvedOptions().timeZone;
                const location_city = window?.navigator?.geolocation ? 'Not supported in this browser' : '';
                const location_postal = '';
                const location_country_name = Intl.DateTimeFormat().resolvedOptions().timeZone;
                const location_country_code = Intl.DateTimeFormat().resolvedOptions().timeZone;
                const location_continent_name = Intl.DateTimeFormat().resolvedOptions().timeZone;
                const location_continent_code = Intl.DateTimeFormat().resolvedOptions().timeZone;
                const browser_name = window.navigator.userAgent;
                const browser_version = window.navigator.appVersion;
                const os_name = window.navigator.platform;
                const os_version = window.navigator.oscpu;
              
                const clientInformation = {
                  timezone_name,
                  timezone_offset,
                  timezone_id,
                  location_city,
                  location_postal,
                  location_country_name,
                  location_country_code,
                  location_continent_name,
                  location_continent_code,
                  browser_name,
                  browser_version,
                  os_name,
                  os_version
                };
              
                return clientInformation;
              };
              
              // Usage
              const userData = getClientInformation();
            //   console.log(userData);
            const response = api.post("/links/"+link_id, userData,
            {
                headers: {"Content-Type": 'application/json'},
                withCredentials: false,
    
            }).then((response) =>{
                // console.log(response.data.target)
                const redirectUrl = response.data.target; // Replace 'redirectUrl' with the key that contains the URL in the response data
                window.location.href = redirectUrl;                
            }).catch((error)=>{
                // console.log(error.response.status)
                Navigate("/404")
            });
            console.log(response)
            
        })

        return (
            <div>
                <h1>JNojnqon</h1>
            </div>
        )
    }

export default RedirectHandler