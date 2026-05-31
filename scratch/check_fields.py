import os
import json
import requests
import msal

CLIENT_ID = "51f81489-12ee-4a9e-aaae-a2591f45987d"
AUTHORITY = "https://login.microsoftonline.com/common"
ENV_URL = "https://orgcaf78765.crm5.dynamics.com/"

def get_token():
    scopes = [f"{ENV_URL.rstrip('/')}/.default"]
    app = msal.PublicClientApplication(CLIENT_ID, authority=AUTHORITY)
    accounts = app.get_accounts()
    if accounts:
        result = app.acquire_token_silent(scopes, account=accounts[0])
        if result and "access_token" in result:
            return result["access_token"]
    raise Exception("No cached token found. Run with interactive auth or verify login.")

def main():
    try:
        token = get_token()
    except Exception as e:
        print(f"Auth error: {e}")
        return

    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/json",
        "OData-MaxVersion": "4.0",
        "OData-Version": "4.0"
    }

    url = f"{ENV_URL.rstrip('/')}/api/data/v9.2/cr5db_jobpositions?$select=cr5db_positionname,cr5db_headcountquota,cr5db_currentheadcount,new_actualheadcount"
    res = requests.get(url, headers=headers)
    if res.status_code == 200:
        data = res.json()
        print(json.dumps(data.get("value", []), indent=2, ensure_ascii=False))
    else:
        print(f"Error {res.status_code}: {res.text}")

if __name__ == "__main__":
    main()
