import pandas as pd

# Load biometric data
bio_df = pd.read_csv("data/biometric data.csv")
bio_df.columns = ["date", "state", "district", "pincode", "bio_age_5_17", "bio_age_18_plus"]

# Convert date
bio_df["date"] = pd.to_datetime(bio_df["date"], format="mixed", dayfirst=True)

print("="*60)
print("DATA ANALYSIS - MONTHS PRESENT")
print("="*60)

print(f"\nTotal Records: {len(bio_df):,}")
print(f"\nDate Range:")
print(f"  Min: {bio_df['date'].min()}")
print(f"  Max: {bio_df['date'].max()}")

print(f"\nMonths Present:")
months = bio_df['date'].dt.to_period('M').value_counts().sort_index()
for month, count in months.items():
    print(f"  {month}: {count:,} records")

print(f"\nTotal Unique Months: {len(months)}")

# Check year distribution
print(f"\nYear Distribution:")
years = bio_df['date'].dt.year.value_counts().sort_index()
for year, count in years.items():
    print(f"  {year}: {count:,} records")
