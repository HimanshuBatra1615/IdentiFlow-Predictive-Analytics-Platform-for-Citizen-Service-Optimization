import requests
import json

try:
    response = requests.get("http://localhost:5000/api/trends")
    data = response.json()
    
    print("="*60)
    print("API RESPONSE TEST")
    print("="*60)
    
    if 'monthly' in data:
        print(f"\nTotal months returned: {len(data['monthly'])}")
        print("\nMonths:")
        for item in data['monthly']:
            print(f"  {item}")
    else:
        print("Error:", data)
        
except Exception as e:
    print(f"Error: {e}")
    print("\nMake sure backend is running: python app.py")
