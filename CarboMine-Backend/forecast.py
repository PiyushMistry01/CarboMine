import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, IsolationForest
from sklearn.preprocessing import StandardScaler

def process_and_predict(file_path):

    df = pd.read_csv(file_path)
    df.columns = df.columns.str.strip()

    df["Date"] = pd.to_datetime(df["Date"], errors="coerce", dayfirst=True)
    df = df.dropna(subset=["Date"])
    df = df.sort_values("Date")

    # ==============================
# AUTO CALCULATE EMISSIONS IF MISSING
# ==============================

    if "Total_Emissions (tCO2e)" not in df.columns:

        print("Emission column missing. Calculating using emission factors...")

        # Example emission factors (you can justify these in viva)
        EF_coal = 0.0025
        EF_diesel = 0.0027
        EF_electricity = 0.0008
        EF_explosives = 0.0012
        EF_vam = 0.015

        df["Total_Emissions (tCO2e)"] = (
            df["Coal_Production (Tonnes)"] * EF_coal +
            df["Fuel_Diesel (Litres)"] * EF_diesel +
            df["Electricity_Grid (kWh)"] * EF_electricity +
            df["Explosives (kg)"] * EF_explosives +
            df["VAM_Concentration%"] * EF_vam
        )

    # Time features
    df["month"] = df["Date"].dt.month
    df["day"] = df["Date"].dt.day
    df["day_of_week"] = df["Date"].dt.dayofweek

    # Lag features
    df["lag1"] = df["Total_Emissions (tCO2e)"].shift(1)
    df["lag7"] = df["Total_Emissions (tCO2e)"].shift(7)
    df["lag30"] = df["Total_Emissions (tCO2e)"].shift(30)

    df = df.dropna()

    X = df.drop(["Date", "Total_Emissions (tCO2e)"], axis=1)
    y = df["Total_Emissions (tCO2e)"]

    # Random Forest
    model = RandomForestRegressor(n_estimators=200)
    model.fit(X, y)

    # Anomaly detection
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    iso = IsolationForest(contamination=0.03)
    iso.fit(X_scaled)

    df["Anomaly"] = iso.predict(X_scaled)
    anomalies = df[df["Anomaly"] == -1]

# -----------------------------
# EXPLAIN ANOMALIES (SCALED)
# -----------------------------

    X_scaled_df = pd.DataFrame(X_scaled, columns=X.columns, index=X.index)

    anomaly_causes = []

    for idx in anomalies.index:

        row = X_scaled_df.loc[idx]

        deviation = abs(row - X_scaled_df.mean())

        cause = deviation.idxmax()

        anomaly_causes.append(cause)

    anomalies = anomalies.copy()
    anomalies["Cause"] = anomaly_causes
    # -----------------------------
# FUTURE PREDICTION (365 DAYS)
# -----------------------------

    future = []

    last_row = df.iloc[-1].copy()

# Historical averages
    avg_values = df.mean(numeric_only=True)

    for i in range(365):

        next_date = last_row["Date"] + pd.Timedelta(days=1)

        new_row = last_row.copy()
        new_row["Date"] = next_date

        # Time features
        new_row["month"] = next_date.month
        new_row["day"] = next_date.day
        new_row["day_of_week"] = next_date.dayofweek

        # 🔥 Simulate realistic mining operations
        new_row["Coal_Production (Tonnes)"] = avg_values["Coal_Production (Tonnes)"] * np.random.uniform(0.9, 1.1)
        new_row["Fuel_Diesel (Litres)"] = avg_values["Fuel_Diesel (Litres)"] * np.random.uniform(0.9, 1.1)
        new_row["Electricity_Grid (kWh)"] = avg_values["Electricity_Grid (kWh)"] * np.random.uniform(0.9, 1.1)
        new_row["Explosives (kg)"] = avg_values["Explosives (kg)"] * np.random.uniform(0.9, 1.1)
        new_row["VAM_Concentration%"] = avg_values["VAM_Concentration%"] * np.random.uniform(0.9, 1.1)
        new_row["Fire_Risk_Index (0-10)"] = avg_values["Fire_Risk_Index (0-10)"] * np.random.uniform(0.9, 1.1)

        # Prediction
        X_input = new_row[X.columns]        
        pred = model.predict([X_input])[0]

        new_row["Total_Emissions (tCO2e)"] = pred

        # Update lag features
        new_row["lag1"] = pred
        new_row["lag7"] = last_row["lag1"]
        new_row["lag30"] = last_row["lag7"]

        future.append(new_row)
        last_row = new_row

    future_df = pd.DataFrame(future)
    future_df["Total_Emissions (tCO2e)"] = (
    future_df["Total_Emissions (tCO2e)"]
    .rolling(window=7, min_periods=1)
    .mean()
    )
    print("Future rows:", len(future_df))
    print("Anomaly rows:", len(anomalies))

    return future_df, anomalies




