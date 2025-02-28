# Dynamic-sign-language-translator
A real-time sign language recognition system that uses a CNN-based model for recognizing hand gestures via a webcam. Built using TensorFlow.js, MobileNet, and KNN, this project helps bridge the communication gap for people using sign language.

🛠️ Features
✅ Real-time hand gesture recognition using a webcam
✅ Runs in the browser (no additional installation required)
✅ Uses MobileNet for efficient feature extraction
✅ K-Nearest Neighbors (KNN) for gesture classification
✅ Interactive and user-friendly UI

📌 Technologies Used
Frontend: HTML, CSS, JavaScript
Machine Learning: TensorFlow.js, MobileNet, KNN
Image Processing: OpenCV.js, HSV color space
📖 How It Works
Webcam Activation 🎥

The system captures live images of hand gestures using OpenCV.js.
The background is removed using the HSV color space for better detection.
Feature Extraction 🧠

MobileNet, a lightweight deep learning model, extracts important features from the hand gesture.
Gesture Classification 🔍

The K-Nearest Neighbors (KNN) algorithm classifies the hand gesture by comparing it with stored samples.
Display Recognized Gesture ✅

The recognized gesture is displayed as text in the frontend UI.
🚀 How to Run the Project
1️⃣ Clone the Repository
bash
Copy
Edit
git clone https://github.com/your-username/sign-language-recognition.git
cd sign-language-recognition
2️⃣ Open the Project in a Browser
Simply open index.html in a browser (Chrome recommended).

3️⃣ Allow Camera Access
The website will request webcam permissions for real-time gesture recognition.

🛠️ Future Improvements
🚀 Expand Gesture Dataset to support more signs
📱 Develop a Mobile App for better accessibility
🔠 Integrate Text-to-Speech for real-time audio output



