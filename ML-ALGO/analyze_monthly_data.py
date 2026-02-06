import pandas as pd

# Load both datasets
bio_df = pd.read_csv("data/biometric data.csv")
enrol_df = pd.read_csv("data/enrolnment data.csv")

bio_df.columns = ["date", "state", "district", "pincode", "bio_age_5_17", "bio_age_18_plus"]
enrol_df.columns = ["date", "state", "district", "pincode", "age_0_5", "age_5_17", "age_18_plus"]

# Merge
df = pd.merge(bio_df, enrol_df, on=["date", "state", "district", "pincode"], how="outer")
df = df.fillna(0)

# Convert date
df["date"] = pd.to_datetime(df["date"], format="mixed", dayfirst=True)
df["year"] = df["date"].dt.year
df["month"] = df["date"].dt.month
df["year_month"] = df["date"].dt.to_period('M').astype(str)

# Calculate totals
df["total_enrolment"] = df["age_0_5"] + df["age_5_17"] + df["age_18_plus"]
df["total_biometric"] = df["bio_age_5_17"] + df["bio_age_18_plus"]

print("="*80)
print("MONTHLY DATA ANALYSIS")
print("="*80)

# Group by month
monthly = df.groupby(['year', 'month', 'year_month']).agg({
    'total_biometric': ['mean', 'sum', 'count'],
    'total_enrolment': ['mean', 'sum', 'count']
}).reset_index()

print("\nMonthly Statistics:")
print("-"*80)
for _, row in monthly.iterrows():
    year_month = row[('year_month', '')]
    bio_mean = row[('total_biometric', 'mean')]
    bio_sum = row[('total_biometric', 'sum')]
    bio_count = row[('total_biometric', 'count')]
    enrol_mean = row[('total_enrolment', 'mean')]
    enrol_sum = row[('total_enrolment', 'sum')]
    
    print(f"\n{year_month}:")
    print(f"  Records: {bio_count:,}")
    print(f"  Biometric - Mean: {bio_mean:.2f}, Total: {bio_sum:,.0f}")
    print(f"  Enrolment - Mean: {enrol_mean:.2f}, Total: {enrol_sum:,.0f}")

print("\n" + "="*80)
print("RECOMMENDATION:")
print("="*80)
print("\nThe API should return:")
print("  - TOTAL (sum) values for better visualization")
print("  - Not MEAN (average) values which are very small")
