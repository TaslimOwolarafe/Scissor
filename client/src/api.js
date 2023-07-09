import axios from 'axios';

var baseUrl = process.env.REACT_APP_BASE_URL
const api = axios.create({
    baseURL: (baseUrl === undefined)?"http://localhost:5000/":baseUrl,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
      },
})

export default api;