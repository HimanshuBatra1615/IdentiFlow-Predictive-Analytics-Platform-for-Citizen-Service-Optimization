import pandas as pd
import joblib
import numpy as np

print("=" * 60)
print("LightGBM Crowd Level Prediction")
print("=" * 60)

# Load the trained model and feature columns
print("\nLoading model...")
model = joblib.load("models/lightgbm_merged_model.pkl")
feature_columns = joblib.load("models/feature_columns.pkl")

print("Model loaded successfully!")
print(f"Number of features: {len(feature_columns)}")

# ---------------------------------
# Example prediction
# ---------------------------------
print("\n" + "=" * 60)
print("EXAMPLE PREDICTION")
print("=" * 60)

# Create sample input data
sample_data = {
    "year": 2026,
    "month": 1,
    "day": 15,
    "age_0_5": 5,
    "age_5_17": 10,
    "age_18_plus": 20,
    "bio_age_5_17": 8,
    "bio_age_18_plus": 15,
    "total_enrolment": 35,
    "total_biometric": 23,
    "day_of_week": "Wednesday",
    "district": "Guntur"
}

print("\nInput Data:")
for key, value in sample_data.items():
    print(f"  {key}: {value}")

# Convert to DataFrame
input_df = pd.DataFrame([sample_data])

# One-hot encode categorical features
input_encoded = pd.get_dummies(input_df, columns=["day_of_week", "district"], drop_first=True)

# Align with training features
for col in feature_columns:
    if col not in input_encoded.columns:
        input_encoded[col] = 0

input_encoded = input_encoded[feature_columns]

# Make prediction
prediction = model.predict(input_encoded)[0]
prediction_proba = model.predict_proba(input_encoded)[0]

crowd_levels = ["Low", "Medium", "High"]

print("\n" + "-" * 60)
print("PREDICTION RESULT")
print("-" * 60)
print(f"Predicted Crowd Level: {crowd_levels[prediction]}")
print(f"\nProbabilities:")
for i, level in enumerate(crowd_levels):
    print(f"  {level}: {prediction_proba[i]:.2%}")

print("\n" + "=" * 60)
print("Prediction completed successfully!")
print("=" * 60)
