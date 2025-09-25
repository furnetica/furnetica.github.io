const creatorOptions = {
    autoSaveEnabled: true
};

// URL to load the survey JSON from GitHub
const surveyJsonUrl = 'https://raw.githubusercontent.com/furnetica/furnetica.github.io/main/survey.json';

const defaultJson = {
    pages: [{
        name: "Name",
        elements: [{
            name: "FirstName",
            title: "Enter your first name:",
            type: "text"
        }, {
            name: "LastName",
            title: "Enter your last name:",
            type: "text"
        }]
    }]
};

// Function to load survey JSON from URL
async function loadSurveyFromUrl(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const surveyJson = await response.json();
        return surveyJson;
    } catch (error) {
        console.error('Failed to load survey from URL:', error);
        console.log('Using fallback default survey');
        return defaultJson;
    }
}

// Initialize the survey creator
async function initializeSurveyCreator() {
    const creator = new SurveyCreator.SurveyCreator(creatorOptions);
    
    // Try to load from localStorage first, then from URL, then use default
    let surveyText = window.localStorage.getItem("survey-json");
    
    if (!surveyText) {
        console.log('No survey found in localStorage, loading from URL...');
        const loadedSurvey = await loadSurveyFromUrl(surveyJsonUrl);
        surveyText = JSON.stringify(loadedSurvey);
    }
    
    creator.text = surveyText;
    
    creator.saveSurveyFunc = (saveNo, callback) => { 
        window.localStorage.setItem("survey-json", creator.text);
        callback(saveNo, true);
        // saveSurveyJson(
        //     "https://your-web-service.com/",
        //     creator.JSON,
        //     saveNo,
        //     callback
        // );
    };

    // creator.onUploadFile.add((_, options) => {
    //     const formData = new FormData();
    //     options.files.forEach(file => {
    //         formData.append(file.name, file);
    //     });
    //     fetch("https://example.com/uploadFiles", {
    //         method: "post",
    //         body: formData
    //     }).then(response => response.json())
    //         .then(result => {
    //             options.callback(
    //                 "success",
    //                 // A link to the uploaded file
    //                 "https://example.com/files?name=" + result[options.files[0].name]
    //             );
    //         })
    //         .catch(error => {
    //             options.callback('error');
    //         });
    // });

    creator.render(document.getElementById("surveyCreator"));
}

document.addEventListener("DOMContentLoaded", function() {
    initializeSurveyCreator();
});

// function saveSurveyJson(url, json, saveNo, callback) {
//   fetch(url, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json;charset=UTF-8'
//     },
//     body: JSON.stringify(json)
//   })
//   .then(response => {
//     if (response.ok) {
//       callback(saveNo, true);
//     } else {
//       callback(saveNo, false);
//     }
//   })
//   .catch(error => {
//     callback(saveNo, false);
//   });
// }