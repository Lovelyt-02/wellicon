import requests
payload = {'site_name': 'Test', 'site_title': 'Test Title'}
resp = requests.put('http://127.0.0.1:8000/api/settings', json=payload)
print(resp.status_code)
print(resp.text)
