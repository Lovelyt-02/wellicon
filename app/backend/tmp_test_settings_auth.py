import requests
payload = {'site_name': 'Test', 'site_title': 'Test Title'}
login_payload = {'email': 'admin@wellicon.com', 'password': 'Admin@123'}
login = requests.post('http://127.0.0.1:8000/api/auth/login', json=login_payload)
print('login', login.status_code)
print(login.text)

token = login.json().get('token')
headers = {'Authorization': f'Bearer {token}'}
resp = requests.put('http://127.0.0.1:8000/api/settings', json=payload, headers=headers)
print('update', resp.status_code)
print(resp.text)
