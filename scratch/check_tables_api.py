import sys
import requests
from msal import PublicClientApplication

ENV_URL = "https://orgcaf78765.crm5.dynamics.com"
API_URL = f"{ENV_URL}/api/data/v9.2"
CLIENT_ID = "51f81489-12ee-4a9e-aaae-a2591f45987d"
AUTHORITY = "https://login.microsoftonline.com/organizations"
SCOPES = [f"{ENV_URL}/.default"]

def get_token_silent():
    app = PublicClientApplication(CLIENT_ID, authority=AUTHORITY)
    accounts = app.get_accounts()
    if accounts:
        result = app.acquire_token_silent(SCOPES, account=accounts[0])
        if result and "access_token" in result:
            return result["access_token"]
    return None

def main():
    token = get_token_silent()
    if not token:
        print("FAIL: No cached MSAL token available. Interactive login required.")
        return

    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/json",
        "OData-MaxVersion": "4.0",
        "OData-Version": "4.0"
    }

    url = f"{API_URL}/EntityDefinitions?$select=LogicalName,DisplayName,SchemaName&$filter=contains(LogicalName,'attend') or contains(LogicalName,'task') or contains(LogicalName,'timesheet') or contains(LogicalName,'kpi')"
    r = requests.get(url, headers=headers)
    if r.status_code == 200:
        data = r.json()
        print("=== Custom Tables found matching search criteria ===")
        for item in data.get("value", []):
            print(f"  - LogicalName: {item.get('LogicalName')}, SchemaName: {item.get('SchemaName')}")
    else:
        print(f"Failed to query Web API ({r.status_code}): {r.text}")

if __name__ == "__main__":
    main()
