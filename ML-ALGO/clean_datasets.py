import pandas as pd
import os

print("="*70)
print("DATA PREPROCESSING - CLEANING DUPLICATE DISTRICTS")
print("="*70)

# District name standardization mapping
district_mapping = {
    # Anantapur variations
    'Anantapur': 'Ananthapuramu',
    'Ananthapur': 'Ananthapuramu',
    
    # Rangareddy variations
    'K.V.Rangareddy': 'Rangareddy',
    'K.v. Rangareddy': 'Rangareddy',
    'Rangareddi': 'Rangareddy',
    
    # Mahabubnagar variations
    'Mahabub Nagar': 'Mahabubnagar',
    'Mahbubnagar': 'Mahabubnagar',
    
    # Karimnagar variations
    'Karim Nagar': 'Karimnagar',
    
    # YSR variations
    'Y. S. R': 'YSR',
    
    # Cuddapah (old name for YSR Kadapa)
    'Cuddapah': 'YSR Kadapa',
    
    # NTR variations
    'N. T. R': 'NTR',
    
    # Remove Telangana districts (not in Andhra Pradesh)
    'Adilabad': None,
    'Hyderabad': None,
    'Khammam': None,
    'Medak': None,
    'Nalgonda': None,
    'Nizamabad': None,
    'Warangal': None
}

def clean_dataset(file_path, output_path, dataset_name):
    """Clean a dataset by standardizing district names and removing duplicates"""
    print(f"\n{'='*70}")
    print(f"Processing: {dataset_name}")
    print(f"{'='*70}")
    
    # Load data
    df = pd.read_csv(file_path)
    print(f"Original records: {len(df):,}")
    print(f"Original districts: {df['district'].nunique()}")
    
    # Standardize district names
    df['district'] = df['district'].replace(district_mapping)
    
    # Remove Telangana districts (None values)
    before_removal = len(df)
    df = df[df['district'].notna()]
    removed = before_removal - len(df)
    if removed > 0:
        print(f"Removed {removed:,} records from Telangana districts")
    
    # Remove any remaining duplicates based on all columns
    before_dedup = len(df)
    df = df.drop_duplicates()
    dedup_removed = before_dedup - len(df)
    if dedup_removed > 0:
        print(f"Removed {dedup_removed:,} duplicate records")
    
    # Sort by date and district for consistency
    if 'date' in df.columns:
        df = df.sort_values(['date', 'district']).reset_index(drop=True)
    
    print(f"\nCleaned records: {len(df):,}")
    print(f"Cleaned districts: {df['district'].nunique()}")
    
    # Show district distribution
    print(f"\nTop 10 districts by record count:")
    district_counts = df['district'].value_counts().head(10)
    for district, count in district_counts.items():
        print(f"  {district}: {count:,}")
    
    # Save cleaned data
    df.to_csv(output_path, index=False)
    print(f"\n✓ Saved to: {output_path}")
    
    return df

# Clean biometric dataset
bio_df = clean_dataset(
    file_path="data/biometric data.csv",
    output_path="data/biometric_data_cleaned.csv",
    dataset_name="BIOMETRIC DATA"
)

# Clean enrollment dataset
enrol_df = clean_dataset(
    file_path="data/enrolnment data.csv",
    output_path="data/enrolnment_data_cleaned.csv",
    dataset_name="ENROLLMENT DATA"
)

# Create backup of original files
print(f"\n{'='*70}")
print("BACKUP ORIGINAL FILES")
print(f"{'='*70}")

if not os.path.exists("data/biometric data_original.csv"):
    os.rename("data/biometric data.csv", "data/biometric data_original.csv")
    print("✓ Backed up: biometric data.csv → biometric data_original.csv")
else:
    print("⚠ Backup already exists: biometric data_original.csv")

if not os.path.exists("data/enrolnment data_original.csv"):
    os.rename("data/enrolnment data.csv", "data/enrolnment data_original.csv")
    print("✓ Backed up: enrolnment data.csv → enrolnment data_original.csv")
else:
    print("⚠ Backup already exists: enrolnment data_original.csv")

# Rename cleaned files to original names
os.rename("data/biometric_data_cleaned.csv", "data/biometric data.csv")
os.rename("data/enrolnment_data_cleaned.csv", "data/enrolnment data.csv")

print(f"\n{'='*70}")
print("SUMMARY")
print(f"{'='*70}")
print(f"✓ Biometric data cleaned: {len(bio_df):,} records, {bio_df['district'].nunique()} districts")
print(f"✓ Enrollment data cleaned: {len(enrol_df):,} records, {enrol_df['district'].nunique()} districts")
print(f"✓ Original files backed up with '_original' suffix")
print(f"✓ Cleaned files saved as original filenames")
print(f"\n{'='*70}")
print("NEXT STEPS")
print(f"{'='*70}")
print("1. Retrain the model: python train_lightgbm_merged.py")
print("2. Restart the backend server")
print("3. Refresh the frontend")
print(f"{'='*70}")
