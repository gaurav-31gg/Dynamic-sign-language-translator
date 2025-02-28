let speakingEnabled = false;
let currentSpokenText = "";
var identity = 0;
var classes = [];
var uploadedModel = false;
var classData = {};

console.log("Training Page: For training your custom sign language model");

const start = async () => {
    const trainingCards = document.getElementById("training-cards");
    const predictions = document.getElementById("predictions");
    const confidence = document.getElementById("confidence");
    const webcamElement = document.getElementById('webcam');
    const speakButton = document.getElementById('btnSpeak');

    speakButton.addEventListener('click', () => {
        speakingEnabled = !speakingEnabled;
        speakButton.innerHTML = speakingEnabled ? 
            'Mute <i class="fas fa-volume-mute"></i>' : 
            'Speak <i class="fas fa-microphone"></i>';
        
        if (!speakingEnabled) {
            window.speechSynthesis.cancel();
            currentSpokenText = "";
        }
    });

    const mobilenetModel = await mobilenet.load();
    const knnClassifierModel = await knnClassifier.create();
    const webcamInput = await tf.data.webcam(webcamElement);

    function preLoader() {
        document.getElementById("loading").style.display = 'none';
    }
    preLoader();

    const predictionHistory = [];
    const HISTORY_LENGTH = 15;
    const CONFIDENCE_THRESHOLD = 0.90;
    const CONSECUTIVE_FRAMES = 8;
    const CONFIDENCE_DIFFERENCE_THRESHOLD = 0.15;

    const getMostCommonPrediction = (history) => {
        if (history.length === 0) return null;
        
        const counts = history.reduce((acc, pred) => {
            acc[pred] = (acc[pred] || 0) + 1;
            return acc;
        }, {});

        const sortedPredictions = Object.entries(counts)
            .sort((a, b) => b[1] - a[1]);

        const mostCommon = sortedPredictions[0];
        const secondMostCommon = sortedPredictions[1];

        if (mostCommon && (!secondMostCommon || 
            (mostCommon[1] >= CONSECUTIVE_FRAMES && 
             mostCommon[1] > secondMostCommon[1] * 1.5))) {
            return mostCommon[0];
        }
        
        return null;
    };

    const addClass = () => {
        const inputClassName = document.getElementById("inputClassName").value.trim();
        if (!inputClassName) return;

        const found = classes.some(el => el.name === inputClassName);
        if (!found) {
            identity++;
            classes.push({ id: identity, name: inputClassName, count: 0 });
            classData[identity] = [];

            const newClassDiv = document.createElement("div");
            newClassDiv.classList.add("newshifter");
            newClassDiv.setAttribute("id", `class-container-${identity}`);
            newClassDiv.innerHTML = `
                <div class="text-center">
                    <h3>Class Name: <span>${inputClassName}</span></h3>
                    <h3>Images: <span id="images-${identity}">0</span></h3>
                    <div class="image-container" id="image-box-${identity}"></div>
                </div>
                <div class="button-container">
                    <button class="dark btn-spread btn-shadow add-image-btn" data-classid="${identity}">Add New Images</button>
                    <button class="remove-class" data-classid="${identity}">Remove</button>
                </div>
            `;
            trainingCards.appendChild(newClassDiv);

            document.querySelector(`.add-image-btn[data-classid="${identity}"]`).addEventListener('click', (event) => {
                addDatasetClass(event.target.getAttribute("data-classid"));
            });

            document.querySelector(`.remove-class[data-classid="${identity}"]`).addEventListener('click', (event) => {
                removeClass(event.target.getAttribute("data-classid"));
            });

            document.getElementById("inputClassName").value = "";
        }
    };

    const addDatasetClass = async (classId) => {
        classId = parseInt(classId);
        const img = await webcamInput.capture();
        const activation = mobilenetModel.infer(img, 'conv_preds');
        knnClassifierModel.addExample(activation, classId);

        let classIndex = classes.findIndex(el => el.id === classId);
        if (classIndex !== -1) {
            classes[classIndex].count++;
            document.getElementById(`images-${classId}`).innerText = classes[classIndex].count;

            const canvas = document.createElement("canvas");
            canvas.width = 100;
            canvas.height = 100;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(webcamElement, 0, 0, 100, 100);

            const imageBox = document.getElementById(`image-box-${classId}`);
            imageBox.innerHTML = "";
            imageBox.appendChild(canvas);

            img.dispose();
        }
    };

    const removeClass = (classId) => {
        classId = parseInt(classId);
        classes = classes.filter(el => el.id !== classId);
        document.getElementById(`class-container-${classId}`).remove();
        delete classData[classId];
        predictionHistory.length = 0;
    };

    const uploadModel = async (classifierModel, event) => {
        let inputModel = event.target.files[0];
        if (!inputModel) return;

        let fr = new FileReader();
        fr.onload = async () => {
            try {
                var dataset = JSON.parse(fr.result);
                classes = [];
                identity = 0;
                
                // Reset the classifier
                await classifierModel.clearAllClasses();
                
                // Process each class in the dataset
                for (let className in dataset) {
                    identity++;
                    classes.push({ id: identity, name: className, count: dataset[className].length / 1024 });
                    
                    // Create tensor and add to classifier
                    const tensors = tf.tensor(dataset[className], [dataset[className].length / 1024, 1024]);
                    for (let i = 0; i < tensors.shape[0]; i++) {
                        const example = tensors.slice([i, 0], [1, tensors.shape[1]]);
                        classifierModel.addExample(example, identity);
                    }
                }

                // Clear existing UI and rebuild
                trainingCards.innerHTML = '';
                classes.forEach(classInfo => {
                    const newClassDiv = document.createElement("div");
                    newClassDiv.classList.add("newshifter");
                    newClassDiv.setAttribute("id", `class-container-${classInfo.id}`);
                    newClassDiv.innerHTML = `
                        <div class="text-center">
                            <h3>Class Name: <span>${classInfo.name}</span></h3>
                            <h3>Images: <span id="images-${classInfo.id}">${classInfo.count}</span></h3>
                            <div class="image-container" id="image-box-${classInfo.id}"></div>
                        </div>
                        <div class="button-container">
                            <button class="dark btn-spread btn-shadow add-image-btn" data-classid="${classInfo.id}">Add New Images</button>
                            <button class="remove-class" data-classid="${classInfo.id}">Remove</button>
                        </div>
                    `;
                    trainingCards.appendChild(newClassDiv);

                    document.querySelector(`.add-image-btn[data-classid="${classInfo.id}"]`).addEventListener('click', (event) => {
                        addDatasetClass(event.target.getAttribute("data-classid"));
                    });

                    document.querySelector(`.remove-class[data-classid="${classInfo.id}"]`).addEventListener('click', (event) => {
                        removeClass(event.target.getAttribute("data-classid"));
                    });
                });

                console.log("Model loaded successfully");
            } catch (error) {
                console.error("Error loading model:", error);
            }
        };
        fr.readAsText(inputModel);
    };

    const downloadModel = async () => {
        let datasetObject = {};
        const classifierDataset = knnClassifierModel.getClassifierDataset();
        
        Object.keys(classifierDataset).forEach((key) => {
            const findClass = classes.find(c => c.id == key);
            if (findClass) {
                datasetObject[findClass.name] = Array.from(classifierDataset[key].dataSync());
            }
        });

        let jsonModel = JSON.stringify(datasetObject);
        let downloader = document.createElement('a');
        downloader.download = "model.json";
        downloader.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(jsonModel);
        document.body.appendChild(downloader);
        downloader.click();
        document.body.removeChild(downloader);
    };

    const imageClassificationWithTransferLearningOnWebcam = async () => {
        let lastStablePrediction = "No Gesture";
        let stablePredictionCount = 0;
        const STABILITY_THRESHOLD = 3;

        while (true) {
            if (knnClassifierModel.getNumClasses() > 0) {
                const img = await webcamInput.capture();
                const activation = mobilenetModel.infer(img, "conv_preds");
                
                try {
                    const result = await knnClassifierModel.predictClass(activation);
                    const confidences = Object.values(result.confidences);
                    const maxConfidence = Math.max(...confidences);
                    
                    const sortedConfidences = [...confidences].sort((a, b) => b - a);
                    const confidenceDifference = sortedConfidences[0] - (sortedConfidences[1] || 0);

                    let currentPrediction = "No Gesture";

                    if (maxConfidence > CONFIDENCE_THRESHOLD && 
                        confidenceDifference > CONFIDENCE_DIFFERENCE_THRESHOLD) {
                        const classEntry = classes.find(c => c.id == result.label);
                        if (classEntry) {
                            currentPrediction = classEntry.name;
                        }
                    }

                    predictionHistory.push(currentPrediction);
                    if (predictionHistory.length > HISTORY_LENGTH) {
                        predictionHistory.shift();
                    }

                    const stablePrediction = getMostCommonPrediction(predictionHistory);
                    let predictedText = "No Gesture";
                    let confidenceValue = 0;

                    if (stablePrediction === lastStablePrediction) {
                        stablePredictionCount++;
                    } else {
                        stablePredictionCount = 0;
                    }

                    if (stablePrediction && stablePredictionCount >= STABILITY_THRESHOLD) {
                        predictedText = stablePrediction;
                        confidenceValue = Math.floor(maxConfidence * 100);
                    }

                    lastStablePrediction = stablePrediction;

                    predictions.innerHTML = predictedText;
                    confidence.innerHTML = confidenceValue;

                    if (speakingEnabled && 
                        currentSpokenText !== predictedText && 
                        predictedText !== "No Gesture" && 
                        stablePredictionCount >= STABILITY_THRESHOLD) {
                        currentSpokenText = predictedText;
                        let msg = new SpeechSynthesisUtterance(predictedText);
                        msg.rate = 1;
                        msg.volume = 1;
                        window.speechSynthesis.cancel();
                        window.speechSynthesis.speak(msg);
                    }
                } catch (error) {
                    console.error("Prediction error:", error);
                }

                img.dispose();
            }
            await tf.nextFrame();
        }
    };

    document.getElementById('add-button').addEventListener('click', addClass);
    document.getElementById('load_button').addEventListener('change', (event) => uploadModel(knnClassifierModel, event));
    document.getElementById('save_button').addEventListener('click', downloadModel);

    imageClassificationWithTransferLearningOnWebcam();
};

window.onload = start;