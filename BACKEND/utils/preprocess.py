import pandas as pd

def preprocess_input(data: dict) -> pd.DataFrame:
    """
    Convert incoming JSON data into model-ready DataFrame
    """

    df = pd.DataFrame([{
        "year": data["year"],
        "month": data["month"],
        "day": data["day"],
        "age_0_5": data["age_0_5"],
        "age_5_17_enrol": data["age_5_17_enrol"],
        "age_18_plus_enrol": data["age_18_plus_enrol"],
        "total_enrolment": (
            data["age_0_5"]
            + data["age_5_17_enrol"]
            + data["age_18_plus_enrol"]
        )
    }])

    # Day-of-week encoding (same as training)
    day_map = {
        "Monday": 0,
        "Tuesday": 1,
        "Wednesday": 2,
        "Thursday": 3,
        "Friday": 4,
        "Saturday": 5,
        "Sunday": 6
    }

    if "day_of_week" in data:
        df["day_of_week"] = day_map.get(data["day_of_week"], 0)
    else:
        df["day_of_week"] = 0

    return df
