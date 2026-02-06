import pandas as pd

# Load biometric data
bio_df = pd.read_csv("data/biometric data.csv")
bio_df.columns = ["date", "state", "district", "pincode", "bio_age_5_17", "bio_age_18_plus"]

# Get unique districts
districts = sorted(bio_df['district'].unique())

print("="*60)
print("DISTRICTS IN DATASET")
print("="*60)
print(f"\nTotal Districts: {len(districts)}")
print("\nDistrict List:")
for i, district in enumerate(districts, 1):
    print(f"{i:2d}. {district}")
