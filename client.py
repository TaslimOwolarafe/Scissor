import requests

headers = {
    "Content-Type":'application/json',
}
response = requests.post("http://localhost:5000/users/login", headers=headers, json={
    'email':'owolarafetaslimgmail.com',
    'password':'taslim'
})

print(response.text)