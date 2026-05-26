import requests
from create_schema_via_api import get_access_token, get_headers, API_URL

def main():
    token = get_access_token()
    r = requests.get(API_URL, headers=get_headers(token))
    data = r.json()
    
    print("\n🔍 Checking available cr5db_ Entity Sets:")
    for item in data.get("value", []):
        name = item.get("name")
        if "cr5db" in name.lower():
            print(f"  - Name: {name} -> URL: {item.get('url')}")

if __name__ == "__main__":
    main()
