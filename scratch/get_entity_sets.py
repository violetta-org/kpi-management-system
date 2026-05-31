import requests
import json
import os

ENV_URL = "https://orgcaf78765.crm5.dynamics.com"
API_URL = f"{ENV_URL}/api/data/v9.2"
cache_path = "scratch/token_cache.json"

if not os.path.exists(cache_path):
    print("No token cache found!")
    exit(1)

# Read cached token
from msal import SerializableTokenCache, PublicClientApplication
cache = SerializableTokenCache()
cache.deserialize(open(cache_path, "r").read())
app = PublicClientApplication("51f81489-12ee-4a9e-aaae-a2591f45987d", authority="https://login.microsoftonline.com/organizations", token_cache=cache)
accounts = app.get_accounts()
token = app.acquire_token_silent([f"{ENV_URL}/.default"], account=accounts[0])["access_token"]

headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json",
    "Accept": "application/json"
}

for name in ["cr5db_approvalroutes", "cr5db_changerequests"]:
    url = f"{API_URL}/EntityDefinitions(LogicalName='{name}')?$select=LogicalName,EntitySetName"
    r = requests.get(url, headers=headers)
    if r.status_code == 200:
        print(f"Success for {name}:")
        print(json.dumps(r.json(), indent=2))
    else:
        print(f"Failed for {name}: {r.status_code} - {r.text[:200]}")
