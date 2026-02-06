"""
Complete ML Pipeline for Aadhaar Trend Analysis
This script demonstrates the full workflow from data loading to prediction
"""

import pandas as pd
import lightgbm as lgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import joblib
import os

def main():
    print("\n" + "="*70)
    print(" AADHAAR TREND ANALYSIS - COMPLETE ML PIPELINE")
    print("="*70)
    
    # Step 1: Load Data
    print("\n[STEP 1] Loading datasets...")
    bio_df = pd.read_csv("data/biometric data.csv")
    enrol_df = pd.read_csv("data/enrolnment data.csv")
    print(f"✓ Biometric: {bio_df.shape[0]:,} records")
    print(f"✓ Enrollment: {enrol_df.shape[0]:,} records")
    
    # Step 2: Preprocess
    print("\n[STEP 2] Preprocessing...")
    bio_df.columns = ["date", "state", "district", "pincode", "bio_age_5_17", "bio_age_18_plus"]
    enrol_df.columns = ["date", "state", "district", "pincode", "age_0_5", "age_5_17", "age_18_plus"]
    print("✓ Column names standardized")
    
    # Step 3: Merge
    print("\n[STEP 3] Merging datasets...")
    df = pd.merge(bio_df, enrol_df, on=["date", "state", "district", "pincode"], how="outer")
    df = df.fillna(0)
    print(f"✓ Merged dataset: {df.shape[0]:,} records")
    
    # Step 4: Feature Engineering
    print("\n[STEP 4] Feature engineering...")
    df["date"] = pd.to_datetime(df["date"], format="mixed", dayfirst=True)
    df["year"] = df["date"].dt.year
    df["month"] = df["date"].dt.month
    df["day"] = df["date"].dt.day
    df["day_of_week"] = df["date"].dt.day_name()
    df["total_enrolment"] = df["age_0_5"] + df["age_5_17"] + df["age_18_plus"]
    df["total_biometric"] = df["bio_age_5_17"] + df["bio_age_18_plus"]
    df["crowd_level"] = pd.qcut(df["total_biometric"], q=3, labels=[0, 1, 2], duplicates="drop")
    df = df.dropna(subset=["crowd_level"])
    print(f"✓ Features created: {df.shape[1]} columns")
    
    # Step 5: Prepare Features
    print("\n[STEP 5] Preparing features...")
    feature_cols = ["year", "month", "day", "age_0_5", "age_5_17", "age_18_plus",
                    "bio_age_5_17", "bio_age_18_plus", "total_enrolment", "total_biometric"]
    X = df[feature_cols + ["day_of_week", "district"]].copy()
    y = df["crowd_level"].astype(int)
    X = pd.get_dummies(X, columns=["day_of_week", "district"], drop_first=True)
    print(f"✓ Feature matrix: {X.shape}")
    
    # Step 6: Train-Test Split
    print("\n[STEP 6] Splitting data...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    print(f"✓ Train: {X_train.shape[0]:,} | Test: {X_test.shape[0]:,}")
    
    # Step 7: Train Model
    print("\n[STEP 7] Training LightGBM model...")
    model = lgb.LGBMClassifier(n_estimators=300, learning_rate=0.05, max_depth=8, 
                               num_leaves=31, random_state=42, verbose=-1)
    model.fit(X_train, y_train)
    print("✓ Model trained successfully")
    
    # Step 8: Evaluate
    print("\n[STEP 8] Evaluating model...")
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"✓ Accuracy: {accuracy:.2%}")
    
    # Step 9: Save Model
    print("\n[STEP 9] Saving model...")
    os.makedirs("models", exist_ok=True)
    joblib.dump(model, "models/lightgbm_merged_model.pkl")
    joblib.dump(X.columns.tolist(), "models/feature_columns.pkl")
    print("✓ Model saved to models/")
    
    # Step 10: Demo Prediction
    print("\n[STEP 10] Demo prediction...")
    sample = X_test.iloc[0:1]
    pred = model.predict(sample)[0]
    proba = model.predict_proba(sample)[0]
    crowd_levels = ["Low", "Medium", "High"]
    print(f"✓ Prediction: {crowd_levels[pred]} (confidence: {proba[pred]:.2%})")
    
    print("\n" + "="*70)
    print(" PIPELINE COMPLETED SUCCESSFULLY!")
    print("="*70)
    print("\nNext steps:")
    print("  1. Run 'python predict.py' to test predictions")
    print("  2. Integrate model with backend API")
    print("  3. Deploy for production use")
    print("\n")

if __name__ == "__main__":
    main()
