import pandas as pd
import lightgbm as lgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import joblib
import os

print("=" * 60)
print("LightGBM Training with Merged Datasets")
print("=" * 60)

# ---------------------------------
# Load both datasets
# ---------------------------------
print("\n[1/7] Loading datasets...")
bio_df = pd.read_csv("data/biometric data.csv")
enrol_df = pd.read_csv("data/enrolnment data.csv")

print(f"Biometric data shape: {bio_df.shape}")
print(f"Enrollment data shape: {enrol_df.shape}")

# ---------------------------------
# Standardize column names
# ---------------------------------
print("\n[2/7] Preprocessing datasets...")

# Rename biometric columns
bio_df.columns = ["date", "state", "district", "pincode", "bio_age_5_17", "bio_age_18_plus"]

# Rename enrollment columns  
enrol_df.columns = ["date", "state", "district", "pincode", "age_0_5", "age_5_17", "age_18_plus"]

# ---------------------------------
# Merge datasets on common keys
# ---------------------------------
print("\n[3/7] Merging datasets...")
df = pd.merge(
    bio_df,
    enrol_df,
    on=["date", "state", "district", "pincode"],
    how="outer"
)

# Fill missing values with 0
df = df.fillna(0)

print(f"Merged dataset shape: {df.shape}")
print(f"\nSample data:")
print(df.head())

# ---------------------------------
# Feature Engineering
# ---------------------------------
print("\n[4/7] Feature engineering...")

# Convert date to datetime
df["date"] = pd.to_datetime(df["date"], format="mixed", dayfirst=True)

# Extract date features
df["year"] = df["date"].dt.year
df["month"] = df["date"].dt.month
df["day"] = df["date"].dt.day
df["day_of_week"] = df["date"].dt.day_name()

# Total enrollment
df["total_enrolment"] = df["age_0_5"] + df["age_5_17"] + df["age_18_plus"]

# Total biometric updates
df["total_biometric"] = df["bio_age_5_17"] + df["bio_age_18_plus"]

# Create target variable: Crowd Level (Low, Medium, High)
df["crowd_level"] = pd.qcut(
    df["total_biometric"],
    q=3,
    labels=[0, 1, 2],  # 0=Low, 1=Medium, 2=High
    duplicates="drop"
)

# Remove rows with missing target
df = df.dropna(subset=["crowd_level"])

print(f"Dataset after feature engineering: {df.shape}")
print(f"\nCrowd level distribution:")
print(df["crowd_level"].value_counts().sort_index())

# ---------------------------------
# Prepare features for training
# ---------------------------------
print("\n[5/7] Preparing features...")

feature_cols = [
    "year", "month", "day",
    "age_0_5", "age_5_17", "age_18_plus",
    "bio_age_5_17", "bio_age_18_plus",
    "total_enrolment", "total_biometric"
]

X = df[feature_cols + ["day_of_week", "district"]].copy()
y = df["crowd_level"].astype(int)

# One-hot encode categorical features
X = pd.get_dummies(X, columns=["day_of_week", "district"], drop_first=True)

print(f"Feature matrix shape: {X.shape}")
print(f"Target shape: {y.shape}")

# ---------------------------------
# Train-test split
# ---------------------------------
print("\n[6/7] Splitting data...")
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

print(f"Training samples: {X_train.shape[0]}")
print(f"Testing samples: {X_test.shape[0]}")

# ---------------------------------
# Train LightGBM Model
# ---------------------------------
print("\n[7/7] Training LightGBM model...")

model = lgb.LGBMClassifier(
    n_estimators=300,
    learning_rate=0.05,
    max_depth=8,
    num_leaves=31,
    random_state=42,
    verbose=-1
)

model.fit(X_train, y_train)

# ---------------------------------
# Model Evaluation
# ---------------------------------
print("\n" + "=" * 60)
print("MODEL EVALUATION")
print("=" * 60)

y_pred = model.predict(X_test)

print("\nAccuracy Score:", accuracy_score(y_test, y_pred))

print("\nClassification Report:")
print(classification_report(y_test, y_pred, target_names=["Low", "Medium", "High"]))

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))

# ---------------------------------
# Feature Importance
# ---------------------------------
print("\n" + "=" * 60)
print("TOP 10 FEATURE IMPORTANCE")
print("=" * 60)

feature_importance = pd.DataFrame({
    "feature": X.columns,
    "importance": model.feature_importances_
}).sort_values("importance", ascending=False)

print(feature_importance.head(10).to_string(index=False))

# ---------------------------------
# Save the trained model
# ---------------------------------
os.makedirs("models", exist_ok=True)
joblib.dump(model, "models/lightgbm_merged_model.pkl")

# Save feature columns for prediction
joblib.dump(X.columns.tolist(), "models/feature_columns.pkl")

print("\n" + "=" * 60)
print("MODEL SAVED SUCCESSFULLY")
print("=" * 60)
print("Model: models/lightgbm_merged_model.pkl")
print("Features: models/feature_columns.pkl")
