"""
Test the trends endpoint to verify all months are returned
"""
import requests
import json

BASE_URL = "http://localhost:5000/api"

def test_trends():
    print("\n" + "="*60)
    print("Testing Trends Endpoint")
    print("="*60)
    
    response = requests.get(f"{BASE_URL}/trends")
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        
        print(f"\nMonthly Data:")
        print(f"Total Months: {len(data.get('monthly', []))}")
        
        print(f"\nMonth-by-Month Breakdown:")
        for item in data.get('monthly', []):
            print(f"  {item.get('year_month', 'N/A')}: "
                  f"Bio={item.get('total_biometric', 0):.2f}, "
                  f"Enrol={item.get('total_enrolment', 0):.2f}")
        
        print(f"\nDay of Week Data:")
        for day, value in data.get('by_day', {}).items():
            print(f"  {day}: {value:.2f}")
    else:
        print(f"Error: {response.text}")

if __name__ == "__main__":
    try:
        test_trends()
    except requests.exceptions.ConnectionError:
        print("\n✗ ERROR: Could not connect to backend server")
        print("Please start the server first:")
        print("  cd BACKEND && python app.py")
    except Exception as e:
        print(f"\n✗ ERROR: {e}")
