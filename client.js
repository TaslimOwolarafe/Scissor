async function loginUser() {
    const url = 'http://localhost:5000/users/login';
    const headers = {
      'Content-Type': 'application/json'
    };
    const data = {
      email: 'owolarafetaslimgmail.com',
      password: 'taslim'
    };
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
      });
  
      const responseData = await response.json();
      console.log(responseData);
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  loginUser();