import requests
from create_schema_via_api import get_access_token, get_headers, API_URL

def main():
    token = get_access_token()
    headers = get_headers(token)
    
    position_set = "cr5db_jobpositions"
    query_url = f"{API_URL}/{position_set}?$filter=cr5db_positionname eq 'Director of R&D'&$select=cr5db_jobpositionid"
    
    r = requests.get(query_url, headers=headers)
    print(f"Status Code: {r.status_code}")
    print("Response JSON:")
    print(r.json())

if __name__ == "__main__":
    main()
