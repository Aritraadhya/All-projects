import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score
import joblib
import streamlit as st

# Load and preprocess the dataset
data = pd.read_csv('Salary_Data.csv')
data = data.dropna()  # Handle missing values

# Independent and dependent variables
X = data[['Years of Experience']]
y = data['Salary']

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the Linear Regression model
model = LinearRegression()
model.fit(X_train, y_train)

# Save the trained model
joblib.dump(model, 'salary_model.pkl')

# Coefficient and intercept
coefficient = model.coef_[0]
intercept = model.intercept_

# Predictions on training and testing data
y_train_pred = model.predict(X_train)
y_test_pred = model.predict(X_test)

# Accuracy scores
train_score = r2_score(y_train, y_train_pred)
test_score = r2_score(y_test, y_test_pred)

# Visualization
plt.figure(figsize=(12, 6))

# Training data plot
plt.subplot(1, 2, 1)
plt.scatter(X_train, y_train, color='blue', label='Actual')
plt.plot(X_train, y_train_pred, color='red', label='Prediction')
plt.title('Training Data')
plt.xlabel('Years of Experience')
plt.ylabel('Salary')
plt.legend()

# Testing data plot
plt.subplot(1, 2, 2)
plt.scatter(X_test, y_test, color='green', label='Actual')
plt.plot(X_test, y_test_pred, color='orange', label='Prediction')
plt.title('Testing Data')
plt.xlabel('Years of Experience')
plt.ylabel('Salary')
plt.legend()

plt.tight_layout()
plt.savefig('regression_plots.png')
plt.close()

# Streamlit Application
st.title("Salary Prediction App")

st.write("This app predicts the salary based on the years of experience using a Linear Regression model.")

# Display model details
st.write(f"### Model Details")
st.write(f"Coefficient (Slope): {coefficient}")
st.write(f"Intercept: {intercept}")
st.write(f"Training Accuracy (R^2 Score): {train_score:.2f}")
st.write(f"Testing Accuracy (R^2 Score): {test_score:.2f}")

# Input
years_experience = st.number_input("Enter Years of Experience:", min_value=0.0, step=0.1)

# Predict
if st.button("Predict Salary"):
    try:
        prediction = model.predict(np.array([[years_experience]]))
        st.write(f"### Predicted Salary: ${prediction[0]:.2f}")
    except Exception as e:
        st.write(f"Error: {e}")

# Display regression plots
st.write("### Training and Testing Data Visualization")
st.image('regression_plots.png')

st.write("Note: Ensure the dataset (Salary_Data.csv) is in the same directory as this script.")

