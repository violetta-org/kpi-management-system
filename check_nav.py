import msal, requests, json
CLIENT_ID = '51f81489-12ee-4a9e-aaae-a2591f45987d'
AUTHORITY = 'https://login.microsoftonline.com/common'
app = msal.PublicClientApplication(CLIENT_ID, authority=AUTHORITY)
accounts = app.get_accounts()
if not accounts:
    print('No accounts in cache')
else:
    token = app.acquire_token_silent(['https://orgcaf78765.crm5.dynamics.com//.default'], account=accounts[0])['access_token']
    headers = {'Authorization': 'Bearer ' + token, 'Accept': 'application/json'}
    
    tables = ['cr5db_department', 'cr5db_jobposition', 'cr5db_user']
    
    for t in tables:
        url = f'https://orgcaf78765.crm5.dynamics.com/api/data/v9.2/EntityDefinitions(LogicalName=\'{t}\')?$expand=ManyToOneRelationships'
        res = requests.get(url, headers=headers)
        if res.status_code == 200:
            data = res.json()
            print(f'\n--- {t} ---')
            for rel in data.get('ManyToOneRelationships', []):
                print(f"Column: {rel.get('ReferencingAttribute')} -> NavProp: {rel.get('ReferencingEntityNavigationPropertyName')}")
        else:
            print(f'Failed to fetch {t}: {res.status_code}')
