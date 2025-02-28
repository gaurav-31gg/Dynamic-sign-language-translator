# Dynamic-sign-language-translator
# **Sign Language Recognition System** ✋🔤  

## **Overview**  
This project is a **real-time sign language recognition system** that enables seamless communication for individuals using sign language. The system utilizes a **CNN-based model** to recognize hand gestures via a webcam and translates them into meaningful outputs.  

Built using **TensorFlow.js, MobileNet, and KNN**, this browser-based application processes live video feed, extracts hand gesture features, and classifies them accurately. The project aims to bridge the communication gap between the hearing-impaired and others through innovative machine learning techniques.  

---

## **✨ Features**  
✅ **Real-time hand gesture recognition** using a webcam  
✅ **Fully browser-based** (no additional software installation required)  
✅ **Uses MobileNet for efficient feature extraction**  
✅ **K-Nearest Neighbors (KNN) for gesture classification**  
✅ **Lightweight and optimized for smooth performance**  
✅ **User-friendly UI with seamless interaction**  

---

## **🛠️ Technologies Used**  
### **Frontend:**  
- **HTML, CSS, JavaScript** for building the UI  
- **OpenCV.js** for image processing and hand tracking  

### **Machine Learning & Gesture Recognition:**  
- **TensorFlow.js** for deep learning in the browser  
- **MobileNet** for extracting hand gesture features  
- **K-Nearest Neighbors (KNN)** for gesture classification  

---

## **📖 How It Works**  
The system follows a structured pipeline for gesture recognition:  

### **1️⃣ Webcam Activation & Hand Tracking** 🎥  
- The application **captures a live video feed** using the webcam.  
- OpenCV.js processes the frames and **removes the background** using the **HSV color space** for better gesture isolation.  

### **2️⃣ Feature Extraction Using MobileNet** 🧠  
- MobileNet, a **lightweight deep learning model**, extracts key features from the captured hand image.  
- It converts the image into a compact representation that highlights important characteristics while reducing unnecessary details.  

### **3️⃣ Gesture Classification with KNN** 🔍  
- The **K-Nearest Neighbors (KNN) algorithm** classifies the gesture by comparing it with previously labeled samples.  
- It finds the closest match and assigns the recognized gesture.  

### **4️⃣ Displaying Recognized Gesture** ✅  
- The recognized sign is **displayed as text** in the frontend UI.  
- The system provides a real-time, smooth recognition experience.  

---

## **🚀 How to Run the Project**  
Follow these steps to set up and run the project on your local machine:  

### **1️⃣ Open the Project in a Browser** 
Since this is a browser-based application, simply open the index.html file in Google Chrome or any modern browser.
### **2️⃣ Allow Camera Access**
-The website will request webcam permissions to capture real-time hand gestures.
-Ensure that your camera is properly connected and allowed in browser settings.

### **🛠️ Future Improvements**
This project can be expanded and improved with the following features:

-**Increase dataset coverage: Add more signs for better recognition.**
-**Improve accuracy: Use advanced deep learning models for better gesture classification.**
-**Voice Output: Convert recognized text into speech to enhance communication.**
-**Support for multiple languages: Extend support for different sign languages (ASL, BSL, ISL, etc.).**
-**Mobile Compatibility: Optimize the system for mobile browsers.**


