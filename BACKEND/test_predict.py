import requests
import json

# Test the prediction endpoint
url = "http://localhost:5000/api/predict"

test_data = {
    "year": 2026,
    "month": 1,
    "day": 15,
    "day_of_week": "Thursday",
    "district": "Visakhapatnam",
    "age_0_5": 3,
    "age_5_17": 8,
    "age_18_plus": 15,
    "bio_age_5_17": 5,
    "bio_age_18_plus": 10
}

print("="*60)
print("TESTING PREDICTION ENDPOINT")
print("="*60)
print(f"\nRequest URL: {url}")
print(f"Request Data:")
print(json.dumps(test_data, indent=2))

try:
    response = requests.post(url, json=test_data)
    print(f"\nResponse Status: {response.status_code}")
    print(f"Response Data:")
    print(json.dumps(response.json(), indent=2))
    
    if response.status_code == 200:
        result = response.json()
        if result.get('success'):
            print("\n✓ Prediction successful!")
            print(f"  Crowd Level: {result['prediction']}")
            print(f"  Confidence: {result['confidence']:.2%}")
        else:
            print(f"\n✗ Prediction failed: {result.get('error')}")
    else:
        print(f"\n✗ HTTP Error: {response.status_code}")
        
except Exception as e:
    print(f"\n✗ Error: {e}")

print("="*60)
