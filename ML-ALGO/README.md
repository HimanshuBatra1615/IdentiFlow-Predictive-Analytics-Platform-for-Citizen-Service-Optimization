# Aadhaar Trend Analysis - Machine Learning Module

This module contains the machine learning pipeline for predicting crowd levels at Aadhaar enrollment centers using LightGBM.

## 📁 Project Structure

```
ML-ALGO/
├── data/
│   ├── biometric data.csv      # Biometric update records
│   └── enrolnment data.csv     # Enrollment records
├── models/
│   ├── lightgbm_merged_model.pkl   # Trained LightGBM model
│   └── feature_columns.pkl         # Feature column names
├── train_lightgbm_merged.py    # Main training script
├── predict.py                  # Prediction script
├── eda.py                      # Exploratory Data Analysis
├── feature_engineering.py      # Feature engineering utilities
├── evaluate_model.py           # Model evaluation
└── requirements.txt            # Python dependencies
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Train the Model

```bash
python train_lightgbm_merged.py
```

This script will:
- Load both biometric and enrollment datasets
- Merge them on common keys (date, state, district, pincode)
- Perform feature engineering
- Train a LightGBM classifier
- Save the trained model to `models/`

### 3. Make Predictions

```bash
python predict.py
```

## 📊 Dataset Information

### Biometric Data
- **Columns**: date, state, district, pincode, bio_age_5_17, bio_age_18_plus
- **Records**: 531,734 rows
- **Description**: Biometric update records by age group

### Enrollment Data
- **Columns**: date, state, district, pincode, age_0_5, age_5_17, age_18_plus
- **Records**: 80,374 rows
- **Description**: New Aadhaar enrollment records by age group

### Merged Dataset
- **Records**: 555,402 rows
- **Features**: 62 (after one-hot encoding)

## 🎯 Model Details

### Algorithm
**LightGBM Classifier** - Gradient boosting framework that uses tree-based learning

### Hyperparameters
- `n_estimators`: 300
- `learning_rate`: 0.05
- `max_depth`: 8
- `num_leaves`: 31
- `random_state`: 42

### Target Variable
**Crowd Level** - Categorized into 3 classes:
- **Low (0)**: Low biometric update activity
- **Medium (1)**: Moderate biometric update activity
- **High (2)**: High biometric update activity

### Features Used
1. **Temporal Features**: year, month, day, day_of_week
2. **Enrollment Features**: age_0_5, age_5_17, age_18_plus
3. **Biometric Features**: bio_age_5_17, bio_age_18_plus
4. **Derived Features**: total_enrolment, total_biometric
5. **Location Features**: district (one-hot encoded)

## 📈 Model Performance

```
Accuracy: 100%

Classification Report:
              precision    recall  f1-score   support
         Low       1.00      1.00      1.00     47838
      Medium       1.00      1.00      1.00     29900
        High       1.00      1.00      1.00     33343
```

### Top 10 Important Features
1. total_biometric (1796)
2. day (1051)
3. month (858)
4. bio_age_5_17 (839)
5. age_0_5 (572)
6. bio_age_18_plus (250)
7. year (185)
8. total_enrolment (184)
9. age_5_17 (88)
10. age_18_plus (23)

## 🔧 Usage Example

```python
import pandas as pd
import joblib

# Load model
model = joblib.load("models/lightgbm_merged_model.pkl")
feature_columns = joblib.load("models/feature_columns.pkl")

# Prepare input data
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

# Convert to DataFrame and encode
input_df = pd.DataFrame([sample_data])
input_encoded = pd.get_dummies(input_df, columns=["day_of_week", "district"], drop_first=True)

# Align features
for col in feature_columns:
    if col not in input_encoded.columns:
        input_encoded[col] = 0
input_encoded = input_encoded[feature_columns]

# Predict
prediction = model.predict(input_encoded)[0]
crowd_levels = ["Low", "Medium", "High"]
print(f"Predicted Crowd Level: {crowd_levels[prediction]}")
```

## 📝 Notes

- The model achieves 100% accuracy on the test set, which might indicate overfitting or highly separable data
- Consider cross-validation and testing on new unseen data for production deployment
- The model is trained specifically on Andhra Pradesh data
- Date formats are handled with mixed format parsing (supports both DD-MM-YYYY and DD/MM/YYYY)

## 🛠️ Future Improvements

1. Add cross-validation for better generalization assessment
2. Implement hyperparameter tuning (GridSearch/RandomSearch)
3. Add model explainability (SHAP values)
4. Create API endpoint for real-time predictions
5. Add data validation and error handling
6. Implement model versioning and monitoring

## 📧 Support

For issues or questions, please refer to the main project README.
