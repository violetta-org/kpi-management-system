#!/usr/bin/env python3
import os
import json
import sys
from urllib.parse import urljoin
import msal
import requests

CLIENT_ID = "51f81489-12ee-4a9e-aaae-a2591f45987d"
AUTHORITY = "https://login.microsoftonline.com/common"
ENV_URL = "https://orgcaf78765.crm5.dynamics.com/"

def main():
    scopes = [f"{ENV_URL.rstrip('/')}/.default"]
    app = msal.PublicClientApplication(CLIENT_ID, authority=AUTHORITY)
    
    print("🌐 Opening browser for authentication...")
    try:
        result = app.acquire_token_interactive(scopes)
    except Exception as e:
        print(f"⚠️ Interactive login failed, using device flow: {e}")
        flow = app.initiate_device_flow(scopes=scopes)
        print(flow["message"])
        result = app.acquire_token_by_device_flow(flow)
        
    if not result or "access_token" not in result:
        print("❌ Auth Failed")
        sys.exit(1)
        
    token = result["access_token"]
    api_base = urljoin(ENV_URL.rstrip("/") + "/", "api/data/v9.2/")
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/json",
        "OData-MaxVersion": "4.0",
        "OData-Version": "4.0"
    }
    
    options = ["new_holidays", "new_holidaies", "new_holiday"]
    for opt in options:
        url = urljoin(api_base, opt)
        res = requests.get(url + "?$top=1", headers=headers)
        print(f"👉 Querying '{opt}': Status Code {res.status_code}")
        if res.status_code == 200:
            print(f"✨ Found correct OData endpoint: '{opt}'!")
            break

if __name__ == "__main__":
    main()
