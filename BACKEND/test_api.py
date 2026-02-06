"""
Test script for the updated backend API
"""
import requests
import json

BASE_URL = "http://localhost:5000/api"

def test_health():
    print("\n" + "="*60)
    print("Testing Health Endpoint")
    print("="*60)
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(json.dumps(response.json(), indent=2))

def test_model_info():
    print("\n" + "="*60)
    print("Testing Model Info Endpoint")
    print("="*60)
    response = requests.get(f"{BASE_URL}/model-info")
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Model Type: {data.get('model_type')}")
    print(f"Feature Count: {data.get('feature_count')}")
    print(f"Classes: {data.get('classes')}")

def test_districts():
    print("\n" + "="*60)
    print("Testing Districts Endpoint")
    print("="*60)
    response = requests.get(f"{BASE_URL}/districts")
    print(f"Status: {response.status_code}")
    data = response.json()
    districts = data.get('districts', [])
    print(f"Total Districts: {len(districts)}")
    print(f"Sample Districts: {districts[:5]}")
    return districts

def test_prediction(district):
    print("\n" + "="*60)
    print("Testing Prediction Endpoint")
    print("="*60)
    
    payload = {
        "year": 2026,
        "month": 1,
        "day": 15,
        "day_of_week": "Wednesday",
        "district": district,
        "age_0_5": 5,
        "age_5_17": 10,
        "age_18_plus": 20,
        "bio_age_5_17": 8,
        "bio_age_18_plus": 15
    }
    
    print("Request Payload:")
    print(json.dumps(payload, indent=2))
    
    response = requests.post(
        f"{BASE_URL}/predict",
        json=payload,
        headers={"Content-Type": "application/json"}
    )
    
    print(f"\nStatus: {response.status_code}")
    print("\nResponse:")
    print(json.dumps(response.json(), indent=2))

def test_statistics():
    print("\n" + "="*60)
    print("Testing Statistics Endpoint")
    print("="*60)
    response = requests.get(f"{BASE_URL}/statistics")
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Total Records: {data.get('total_records')}")
    print(f"Crowd Distribution: {data.get('crowd_distribution')}")
    print(f"Avg Biometric: {data.get('avg_biometric', 0):.2f}")
    print(f"Avg Enrollment: {data.get('avg_enrolment', 0):.2f}")

def main():
    print("\n" + "="*60)
    print("BACKEND API TEST SUITE")
    print("="*60)
    print("Make sure the backend server is running on http://localhost:5000")
    print("="*60)
    
    try:
        # Test 1: Health Check
        test_health()
        
        # Test 2: Model Info
        test_model_info()
        
        # Test 3: Districts
        districts = test_districts()
        
        # Test 4: Prediction
        if districts:
            test_prediction(districts[0])
        
        # Test 5: Statistics
        test_statistics()
        
        print("\n" + "="*60)
        print("✓ ALL TESTS COMPLETED")
        print("="*60 + "\n")
        
    except requests.exceptions.ConnectionError:
        print("\n✗ ERROR: Could not connect to backend server")
        print("Please start the server first:")
        print("  cd BACKEND && python app.py")
    except Exception as e:
        print(f"\n✗ ERROR: {e}")

if __name__ == "__main__":
    main()
