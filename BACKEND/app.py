from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import pandas as pd
import joblib
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Load model and feature columns
MODEL_PATH = "../ML-ALGO/models/lightgbm_merged_model.pkl"
FEATURES_PATH = "../ML-ALGO/models/feature_columns.pkl"
BIO_DATA_PATH = "../ML-ALGO/data/biometric data.csv"
ENROL_DATA_PATH = "../ML-ALGO/data/enrolnment data.csv"

model = None
feature_columns = None
merged_data = None

def load_model():
    global model, feature_columns, merged_data
    try:
        model = joblib.load(MODEL_PATH)
        feature_columns = joblib.load(FEATURES_PATH)
        print("✓ Model loaded successfully!")
        print(f"✓ Features: {len(feature_columns)}")
        
        # Load and merge data for statistics
        try:
            bio_df = pd.read_csv(BIO_DATA_PATH)
            enrol_df = pd.read_csv(ENROL_DATA_PATH)
            
            bio_df.columns = ["date", "state", "district", "pincode", "bio_age_5_17", "bio_age_18_plus"]
            enrol_df.columns = ["date", "state", "district", "pincode", "age_0_5", "age_5_17", "age_18_plus"]
            
            # Data is already cleaned - no need for district mapping
            
            merged_data = pd.merge(bio_df, enrol_df, on=["date", "state", "district", "pincode"], how="outer")
            merged_data = merged_data.fillna(0)
            
            merged_data["date"] = pd.to_datetime(merged_data["date"], format="mixed", dayfirst=True)
            merged_data["total_enrolment"] = merged_data["age_0_5"] + merged_data["age_5_17"] + merged_data["age_18_plus"]
            merged_data["total_biometric"] = merged_data["bio_age_5_17"] + merged_data["bio_age_18_plus"]
            
            unique_districts = len(merged_data['district'].unique())
            print(f"✓ Data loaded: {len(merged_data)} records")
            print(f"✓ Unique districts: {unique_districts}")
        except Exception as e:
            print(f"⚠ Warning: Could not load data for statistics: {e}")
            
    except Exception as e:
        print(f"✗ Error loading model: {e}")

load_model()

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "model_loaded": model is not None,
        "feature_columns_loaded": feature_columns is not None,
        "feature_count": len(feature_columns) if feature_columns is not None else 0,
        "data_loaded": merged_data is not None,
        "data_records": len(merged_data) if merged_data is not None else 0
    })

@app.route('/api/model-info', methods=['GET'])
def model_info():
    """Get information about the loaded model"""
    try:
        if model is None:
            return jsonify({
                "success": False,
                "error": "Model not loaded"
            }), 500
        
        return jsonify({
            "success": True,
            "model_type": str(type(model).__name__),
            "features": feature_columns if feature_columns else [],
            "feature_count": len(feature_columns) if feature_columns else 0,
            "classes": ["Low", "Medium", "High"],
            "model_path": MODEL_PATH,
            "model_exists": os.path.exists(MODEL_PATH)
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/predict', methods=['POST'])
def predict_crowd():
    try:
        data = request.json
        
        # Check if model is loaded
        if model is None or feature_columns is None:
            return jsonify({
                "success": False,
                "error": "Model not loaded. Please check model files."
            }), 500
        
        # Validate required fields
        required_fields = ['month', 'day', 'day_of_week', 'district']
        missing_fields = [field for field in required_fields if field not in data]
        
        if missing_fields:
            return jsonify({
                "success": False,
                "error": f"Missing required fields: {', '.join(missing_fields)}",
                "required_fields": required_fields
            }), 400
        
        # Calculate totals
        age_0_5 = float(data.get('age_0_5', 0))
        age_5_17 = float(data.get('age_5_17', 0))
        age_18_plus = float(data.get('age_18_plus', 0))
        bio_age_5_17 = float(data.get('bio_age_5_17', 0))
        bio_age_18_plus = float(data.get('bio_age_18_plus', 0))
        
        total_enrolment = age_0_5 + age_5_17 + age_18_plus
        total_biometric = bio_age_5_17 + bio_age_18_plus
        
        # Create input dataframe
        input_data = pd.DataFrame([{
            'year': int(data.get('year', 2026)),
            'month': int(data['month']),
            'day': int(data['day']),
            'age_0_5': age_0_5,
            'age_5_17': age_5_17,
            'age_18_plus': age_18_plus,
            'bio_age_5_17': bio_age_5_17,
            'bio_age_18_plus': bio_age_18_plus,
            'total_enrolment': total_enrolment,
            'total_biometric': total_biometric,
            'day_of_week': str(data['day_of_week']),
            'district': str(data['district'])
        }])
        
        # Encode categorical features
        input_encoded = pd.get_dummies(
            input_data,
            columns=["day_of_week", "district"],
            drop_first=True
        )
        
        # Align with training features
        for col in feature_columns:
            if col not in input_encoded.columns:
                input_encoded[col] = 0
        
        input_encoded = input_encoded[feature_columns]
        
        # Predict
        prediction = model.predict(input_encoded)[0]
        probabilities = model.predict_proba(input_encoded)[0]
        
        crowd_levels = ["Low", "Medium", "High"]
        crowd_level = crowd_levels[prediction]
        
        # Check if district was in training data
        district_in_training = any(col.startswith(f"district_{data['district']}") for col in feature_columns)
        
        return jsonify({
            "success": True,
            "prediction": crowd_level,
            "probabilities": {
                "Low": float(probabilities[0]),
                "Medium": float(probabilities[1]),
                "High": float(probabilities[2])
            },
            "confidence": float(max(probabilities)),
            "input_summary": {
                "total_enrolment": int(total_enrolment),
                "total_biometric": int(total_biometric),
                "district": data['district'],
                "date": f"{data['month']}/{data['day']}"
            },
            "district_in_training": district_in_training,
            "warning": None if district_in_training else "District not in training data - using general patterns"
        })
    
    except KeyError as e:
        return jsonify({
            "success": False,
            "error": f"Missing or invalid field: {str(e)}"
        }), 400
    except ValueError as e:
        return jsonify({
            "success": False,
            "error": f"Invalid data type: {str(e)}"
        }), 400
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Prediction error: {str(e)}"
        }), 500

@app.route('/api/statistics', methods=['GET'])
def get_statistics():
    try:
        # Check if data is loaded
        if merged_data is None:
            return jsonify({
                "error": "Data not loaded",
                "total_records": 0,
                "crowd_distribution": {},
                "avg_biometric": 0,
                "avg_enrolment": 0,
                "districts": []
            }), 200
        
        # Get optional district filter from query params
        district_filter = request.args.get('district', None)
        
        df = merged_data.copy()
        
        # Apply district filter if provided
        if district_filter and district_filter != 'All':
            df = df[df['district'] == district_filter]
            if len(df) == 0:
                return jsonify({"error": f"No data found for district: {district_filter}"}), 404
        
        # Calculate crowd levels for statistics
        df["crowd_level"] = pd.qcut(
            df["total_biometric"],
            q=3,
            labels=["Low", "Medium", "High"],
            duplicates="drop"
        )
        
        # Calculate statistics
        crowd_dist = df['crowd_level'].value_counts().to_dict()
        
        stats = {
            "total_records": int(len(df)),
            "crowd_distribution": {str(k): int(v) for k, v in crowd_dist.items()},
            "avg_biometric": float(df['total_biometric'].mean()),
            "avg_enrolment": float(df['total_enrolment'].mean()),
            "districts": sorted(df['district'].unique().tolist()),
            "date_range": {
                "start": str(df['date'].min().date()),
                "end": str(df['date'].max().date())
            },
            "total_biometric": int(df['total_biometric'].sum()),
            "total_enrolment": int(df['total_enrolment'].sum()),
            "district": district_filter or "All"
        }
        
        return jsonify(stats)
    
    except Exception as e:
        print(f"Error in statistics: {e}")
        return jsonify({
            "error": str(e),
            "total_records": 0,
            "crowd_distribution": {},
            "avg_biometric": 0,
            "avg_enrolment": 0,
            "districts": []
        }), 200

@app.route('/api/trends', methods=['GET'])
def get_trends():
    try:
        if merged_data is None:
            return jsonify({"error": "Data not loaded"}), 500
        
        # Get optional district filter from query params
        district_filter = request.args.get('district', None)
        
        df = merged_data.copy()
        
        # Apply district filter if provided
        if district_filter and district_filter != 'All':
            df = df[df['district'] == district_filter]
            if len(df) == 0:
                return jsonify({"error": f"No data found for district: {district_filter}"}), 404
        
        df["year"] = df["date"].dt.year
        df["month"] = df["date"].dt.month
        df["year_month"] = df["date"].dt.to_period('M').astype(str)
        df["day_of_week"] = df["date"].dt.day_name()
        
        # Monthly trends - use SUM instead of MEAN for better visualization
        monthly_data = df.groupby(['year', 'month', 'year_month']).agg({
            'total_biometric': 'sum',  # Changed from 'mean' to 'sum'
            'total_enrolment': 'sum'   # Changed from 'mean' to 'sum'
        }).reset_index()
        
        # Sort by year and month
        monthly_data = monthly_data.sort_values(['year', 'month'])
        
        # Format for frontend
        monthly_formatted = []
        for _, row in monthly_data.iterrows():
            monthly_formatted.append({
                'month': int(row['month']),
                'year': int(row['year']),
                'year_month': row['year_month'],
                'total_biometric': float(row['total_biometric']),
                'total_enrolment': float(row['total_enrolment'])
            })
        
        trends = {
            "monthly": monthly_formatted,
            "by_day": df.groupby('day_of_week')['total_biometric'].sum().to_dict(),  # Changed to sum
            "district": district_filter or "All",
            "total_records": len(df)
        }
        
        return jsonify(trends)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/districts', methods=['GET'])
def get_districts():
    try:
        if merged_data is None:
            return jsonify({"districts": []}), 200
            
        districts = sorted(merged_data['district'].unique().tolist())
        return jsonify({"districts": districts})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/district-averages/<district>', methods=['GET'])
def get_district_averages(district):
    """Get historical averages for a specific district by day of week"""
    try:
        if merged_data is None:
            return jsonify({"error": "Data not loaded"}), 500
        
        df = merged_data.copy()
        
        # Filter by district
        if district and district != 'All':
            df = df[df['district'] == district]
            if len(df) == 0:
                # Return default averages if no data for district
                return jsonify({
                    "district": district,
                    "averages": {
                        "Monday": {"age_0_5": 1, "age_5_17": 3, "age_18_plus": 8, "bio_age_5_17": 5, "bio_age_18_plus": 12},
                        "Tuesday": {"age_0_5": 2, "age_5_17": 4, "age_18_plus": 10, "bio_age_5_17": 6, "bio_age_18_plus": 14},
                        "Wednesday": {"age_0_5": 1, "age_5_17": 2, "age_18_plus": 6, "bio_age_5_17": 4, "bio_age_18_plus": 9},
                        "Thursday": {"age_0_5": 2, "age_5_17": 5, "age_18_plus": 12, "bio_age_5_17": 8, "bio_age_18_plus": 16},
                        "Friday": {"age_0_5": 2, "age_5_17": 4, "age_18_plus": 11, "bio_age_5_17": 7, "bio_age_18_plus": 15},
                        "Saturday": {"age_0_5": 2, "age_5_17": 5, "age_18_plus": 13, "bio_age_5_17": 9, "bio_age_18_plus": 17},
                        "Sunday": {"age_0_5": 0, "age_5_17": 1, "age_18_plus": 3, "bio_age_5_17": 2, "bio_age_18_plus": 5}
                    },
                    "data_available": False
                })
        
        df["day_of_week"] = df["date"].dt.day_name()
        
        # Calculate averages by day of week
        day_averages = df.groupby('day_of_week').agg({
            'age_0_5': 'mean',
            'age_5_17': 'mean',
            'age_18_plus': 'mean',
            'bio_age_5_17': 'mean',
            'bio_age_18_plus': 'mean'
        }).round(0).astype(int)
        
        # Convert to dict with proper structure
        averages_dict = {}
        for day in ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']:
            if day in day_averages.index:
                averages_dict[day] = {
                    'age_0_5': int(day_averages.loc[day, 'age_0_5']),
                    'age_5_17': int(day_averages.loc[day, 'age_5_17']),
                    'age_18_plus': int(day_averages.loc[day, 'age_18_plus']),
                    'bio_age_5_17': int(day_averages.loc[day, 'bio_age_5_17']),
                    'bio_age_18_plus': int(day_averages.loc[day, 'bio_age_18_plus'])
                }
            else:
                # Default values if no data for this day
                averages_dict[day] = {
                    'age_0_5': 1,
                    'age_5_17': 3,
                    'age_18_plus': 8,
                    'bio_age_5_17': 5,
                    'bio_age_18_plus': 12
                }
        
        return jsonify({
            "district": district,
            "averages": averages_dict,
            "data_available": True,
            "records_analyzed": len(df)
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    try:
        if merged_data is None:
            return jsonify({"error": "Data not loaded"}), 500
        
        # Get optional district filter from query params
        district_filter = request.args.get('district', None)
        
        df = merged_data.copy()
        
        # Apply district filter if provided
        if district_filter and district_filter != 'All':
            df = df[df['district'] == district_filter]
            if len(df) == 0:
                return jsonify({"error": f"No data found for district: {district_filter}"}), 404
        
        df["month"] = df["date"].dt.month
        df["day_of_week"] = df["date"].dt.day_name()
        
        # Calculate crowd levels
        df["crowd_level"] = pd.qcut(
            df["total_biometric"],
            q=3,
            labels=["Low", "Medium", "High"],
            duplicates="drop"
        )
        
        # District-wise statistics
        district_stats = df.groupby('district').agg({
            'total_enrolment': 'sum',
            'total_biometric': 'sum'
        }).reset_index()
        
        # Day of week analysis
        day_analysis = df.groupby('day_of_week').agg({
            'total_enrolment': 'mean',
            'total_biometric': 'mean'
        }).to_dict('index')
        
        # Monthly trends with crowd levels
        monthly_crowd = df.groupby(['month', 'crowd_level']).size().reset_index(name='count')
        
        analytics = {
            "district_stats": district_stats.to_dict('records')[:10],  # Top 10
            "day_analysis": day_analysis,
            "monthly_crowd": monthly_crowd.to_dict('records'),
            "total_enrolment": int(df['total_enrolment'].sum()),
            "total_biometric": int(df['total_biometric'].sum()),
            "peak_month": int(df.groupby('month')['total_enrolment'].sum().idxmax()),
            "peak_day": df['day_of_week'].value_counts().idxmax(),
            "district": district_filter or "All"
        }
        
        return jsonify(analytics)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("="*60)
    print("AADHAAR ANALYTICS BACKEND SERVER")
    print("="*60)
    print(f"Model Path: {MODEL_PATH}")
    print(f"Model Exists: {os.path.exists(MODEL_PATH)}")
    print(f"Features Path: {FEATURES_PATH}")
    print(f"Features Exist: {os.path.exists(FEATURES_PATH)}")
    print(f"Model Loaded: {model is not None}")
    print(f"Feature Columns Loaded: {feature_columns is not None}")
    print(f"Data Loaded: {merged_data is not None}")
    
    if model is None:
        print("\n⚠️  WARNING: Model not loaded!")
        print("Please train the model first:")
        print("  cd ML-ALGO && python train_lightgbm_merged.py")
    
    if merged_data is None:
        print("\n⚠️  WARNING: Data not loaded!")
        print("Check data files:")
        print(f"  {BIO_DATA_PATH}")
        print(f"  {ENROL_DATA_PATH}")
    
    print("\n" + "="*60)
    print("Starting server on http://localhost:5000")
    print("="*60 + "\n")
    
    app.run(debug=True, port=5000, host='0.0.0.0')
