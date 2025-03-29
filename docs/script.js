// Global variables
let currentSlideIndex = 0;
let currentQuizIndex = 0;
let slidesData = [
    { url: "https://view.genially.com/67de49ded67908621a726b03", description: "1. Introduction to the Beating Heart project", type: "iframe" },
    { url: "https://view.genially.com/67de49e4ab31ac746b27c48b", description: "2. Setting up your Micro:bit environment", type: "iframe" },
    { url: "https://clearinghouse.starnetlibraries.org/images/525/microbit-heart.jpg", description: "3. Programming the Beating Heart animation", type: "image" },
    { url: "", description: "", type: "iframe" },
    { url: "", description: "", type: "iframe" },
    { url: "", description: "", type: "iframe" },
    { url: "", description: "", type: "iframe" },
    { url: "", description: "", type: "iframe" },
    { url: "", description: "", type: "iframe" },
    { url: "", description: "", type: "iframe" }
];

let challengesData = [
    { title: "Make it faster or slower", description: "Change the pause times to make the heart beat faster or slower" },
    { title: "Create a blinking smiley", description: "Use the same technique but with smiley faces instead of hearts" },
    { title: "Add a button control", description: "Make the heart only beat when you press button A" },
    { title: "Add sound effects", description: "Use the Micro:bit's speaker to add heartbeat sounds" },
    { title: "Create a heartbeat monitor", description: "Use the accelerometer to detect movement and sync the heart to it" },
    { title: "", description: "" },
    { title: "", description: "" },
    { title: "", description: "" },
    { title: "", description: "" },
    { title: "", description: "" }
];

let quizData = [
    {
        question: "What is the correct order of blocks to make a heart beat animation?",
        correctAnswer: "show icon → pause → show smaller icon → pause",
        incorrectAnswers: [
            "pause → show icon → pause → show smaller icon",
            "show icon → show smaller icon → pause → pause"
        ]
    },
    {
        question: "How many LEDs are there on the Micro:bit's display?",
        correctAnswer: "25 (5x5)",
        incorrectAnswers: [
            "15 (3x5)",
            "30 (5x6)"
        ]
    },
    {
        question: "What does the 'forever' block do?",
        correctAnswer: "Keeps repeating the code inside it over and over",
        incorrectAnswers: [
            "Runs the code inside it once when the Micro:bit starts",
            "Makes the Micro:bit run forever without stopping"
        ]
    },
    {
        question: "",
        correctAnswer: "",
        incorrectAnswers: ["", ""]
    },
    {
        question: "",
        correctAnswer: "",
        incorrectAnswers: ["", ""]
    }
];

// Tab functionality
function openTab(tabName, event) {
    // Prevent default if event exists
    if (event) event.preventDefault();
    
    const tabs = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('active');
    }
    
    const tabButtons = document.getElementsByClassName('tab');
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove('active');
    }
    
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to clicked tab button
    if (event) {
        event.currentTarget.classList.add('active');
    } else {
        // Find the corresponding tab button and activate it
        for (let i = 0; i < tabButtons.length; i++) {
            if (tabButtons[i].getAttribute('onclick').includes(tabName)) {
                tabButtons[i].classList.add('active');
                break;
            }
        }
    }
    
    updateProgressBar(tabName);
    
    if (tabName === 'video') {
        pauseVideoOnTabSwitch();
    }
    
    if (tabName !== 'quiz') {
        resetQuiz();
    }
}

function pauseVideoOnTabSwitch() {
    const videoIframe = document.getElementById('mainVideo');
    if (videoIframe) {
        videoIframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
    }
}

function resetQuiz() {
    const allFeedbacks = document.querySelectorAll('.quiz-feedback');
    allFeedbacks.forEach(feedback => {
        feedback.style.display = 'none';
        feedback.classList.remove('correct', 'incorrect');
    });
    
    const quizOptions = document.querySelectorAll('.quiz-option');
    quizOptions.forEach(option => option.classList.remove('selected', 'correct', 'incorrect'));
    
    const resultMessage = document.getElementById('quizResultMessage');
    if (resultMessage) resultMessage.style.display = 'none';
    
    const partyPopperContainer = document.getElementById('partyPopperContainer');
    if (partyPopperContainer) partyPopperContainer.style.display = 'none';
}

// Slideshow functionality
function showSlide(n) {
    const slides = document.querySelectorAll('#slideshowContainer .slide');
    if (slides.length === 0) return;
    
    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove('active');
    }
    
    currentSlideIndex = (n + slides.length) % slides.length;
    slides[currentSlideIndex].classList.add('active');
}

function nextSlide() {
    showSlide(currentSlideIndex + 1);
}

function prevSlide() {
    showSlide(currentSlideIndex - 1);
}

// Quiz functionality
function selectOption(option) {
    const quizQuestion = option.closest('.quiz-question');
    if (!quizQuestion) return;

    const options = quizQuestion.getElementsByClassName('quiz-option');
    for (let i = 0; i < options.length; i++) {
        options[i].classList.remove('selected');
    }
    option.classList.add('selected');
    
    const feedback = quizQuestion.querySelector('.quiz-feedback');
    if (feedback) {
        feedback.style.display = 'none';
    }
}

function updateQuiz() {
    const container = document.getElementById('quizContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    quizData.forEach((quiz, index) => {
        if(!quiz.question) return;
        
        const quizDiv = document.createElement('div');
        quizDiv.className = 'quiz-question';
        
        // Combine all answers and shuffle them
        const allAnswers = [
            quiz.correctAnswer,
            ...quiz.incorrectAnswers
        ].sort(() => Math.random() - 0.5);
        
        // Generate options with A, B, C labels
        const optionsHtml = allAnswers.map((answer, i) => {
            const label = String.fromCharCode(65 + i); // A, B, C
            return `<div class="quiz-option" onclick="selectOption(this)">${label}) ${answer}</div>`;
        }).join('');
        
        quizDiv.innerHTML = `
            <p>${index + 1}. ${quiz.question}</p>
            <div class="quiz-options">
                ${optionsHtml}
            </div>
            <div class="quiz-feedback correct">
                Correct!
            </div>
            <div class="quiz-feedback incorrect">
                The correct answer is: ${quiz.correctAnswer}
            </div>
        `;
        
        container.appendChild(quizDiv);
    });
}

function submitQuiz() {
    const quizQuestions = document.querySelectorAll('.quiz-question');
    let score = 0;
    let totalQuestions = 0;
    
    quizData.forEach((quiz, index) => {
        if (!quiz.question) return;
        totalQuestions++;
        
        const questionDiv = quizQuestions[index];
        if (!questionDiv) return;
        
        const selectedOption = questionDiv.querySelector('.quiz-option.selected');
        const feedback = questionDiv.querySelector('.quiz-feedback');
        
        if (selectedOption && feedback) {
            // Get the actual answer text without the A/B/C label
            const selectedAnswerText = selectedOption.textContent.replace(/^[A-Z]\)\s*/, '');
            const isCorrect = selectedAnswerText === quiz.correctAnswer;
            
            if (isCorrect) {
                score++;
                feedback.classList.add('correct');
                feedback.classList.remove('incorrect');
                feedback.textContent = 'Correct!';
            } else {
                feedback.classList.add('incorrect');
                feedback.classList.remove('correct');
                feedback.textContent = `Incorrect! The correct answer is: ${quiz.correctAnswer}`;
            }
            feedback.style.display = 'block';
        }
    });
    
    const resultMessage = document.getElementById('quizResultMessage');
    const partyPopperContainer = document.getElementById('partyPopperContainer');
    
    if (resultMessage) {
        if (score === totalQuestions) {
            resultMessage.textContent = `🎉 Perfect! You got ${score} out of ${totalQuestions} correct!`;
            if (partyPopperContainer) {
                partyPopperContainer.style.display = 'flex';
                setTimeout(() => {
                    if (partyPopperContainer) partyPopperContainer.style.display = 'none';
                }, 3000);
            }
        } else {
            resultMessage.textContent = `You got ${score} out of ${totalQuestions} correct. Keep trying!`;
        }
        resultMessage.style.display = 'block';
        resultMessage.scrollIntoView({ behavior: 'smooth' });
    }
}

// Progress bar
function updateProgressBar(tab) {
    const progressBar = document.getElementById('progressBar');
    if (!progressBar) return;
    
    let progress = 20;
    if (tab === 'video') progress = 40;
    else if (tab === 'slides') progress = 60;
    else if (tab === 'challenges') progress = 80;
    else if (tab === 'quiz') progress = 100;
    
    progressBar.style.width = progress + '%';
}

// Edit modal functionality
function openEditModal() {
    document.getElementById('editProjectTitle').value = document.getElementById('projectTitle').textContent;
    document.getElementById('editProjectSubtitle').value = document.getElementById('projectSubtitle').textContent;
    document.getElementById('projectImageUrl').value = document.getElementById('projectImage').src;
    document.getElementById('editOverviewText').value = document.getElementById('overviewText').textContent;
    
    document.getElementById('learnTitle1Input').value = document.getElementById('learnTitle1').textContent;
    document.getElementById('learnDesc1Input').value = document.getElementById('learnDesc1').textContent;
    document.getElementById('learnTitle2Input').value = document.getElementById('learnTitle2').textContent;
    document.getElementById('learnDesc2Input').value = document.getElementById('learnDesc2').textContent;
    document.getElementById('learnTitle3Input').value = document.getElementById('learnTitle3').textContent;
    document.getElementById('learnDesc3Input').value = document.getElementById('learnDesc3').textContent;
    document.getElementById('learnTitle4Input').value = document.getElementById('learnTitle4').textContent;
    document.getElementById('learnDesc4Input').value = document.getElementById('learnDesc4').textContent;
    
    document.getElementById('editVideoIntroText').value = document.getElementById('videoIntroText').textContent;
    document.getElementById('editVideoTitle').value = document.getElementById('videoTitle').textContent;
    document.getElementById('editMainVideoUrl').value = document.getElementById('mainVideo').src;
    
    const keyPointsItems = document.querySelectorAll('#videoKeyPoints li');
    const keyPointsText = Array.from(keyPointsItems).map(li => li.textContent).join('\n');
    document.getElementById('editVideoKeyPoints').value = keyPointsText;
    
    loadSlidesEditFields();
    loadChallengesEditFields();
    loadQuizEditFields();
    
    document.getElementById('editModal').style.display = 'block';
}

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

function showEditSection() {
    const sections = document.querySelectorAll('.edit-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    const selectedSection = document.getElementById('editSection').value + 'Edit';
    document.getElementById(selectedSection).style.display = 'block';
}

function selectColor(type, color) {
    const colorOptions = document.querySelectorAll(`#styleEdit .color-option`);
    colorOptions.forEach(option => {
        option.classList.remove('selected');
        if (option.style.backgroundColor === color) {
            option.classList.add('selected');
        }
    });
    
    if (type === 'primary') {
        document.getElementById('primaryColorPicker').value = color;
    } else if (type === 'secondary') {
        document.getElementById('secondaryColorPicker').value = color;
    } else if (type === 'accent') {
        document.getElementById('accentColorPicker').value = color;
    }
    
    document.documentElement.style.setProperty(`--${type}`, color);
}

function customColorSelected(type, color) {
    selectColor(type, color);
}

function selectFont(font) {
    const fontOptions = document.querySelectorAll('.font-option');
    fontOptions.forEach(option => {
        option.classList.remove('selected');
        if (option.style.fontFamily === font) {
            option.classList.add('selected');
        }
    });
    
    document.body.style.fontFamily = font;
}

function selectSize(size) {
    const sizeOptions = document.querySelectorAll('.size-option');
    sizeOptions.forEach(option => {
        option.classList.remove('selected');
        if (option.textContent.toLowerCase() === size) {
            option.classList.add('selected');
        }
    });
    
    let fontSize;
    if (size === 'small') {
        fontSize = '14px';
    } else if (size === 'medium') {
        fontSize = '16px';
    } else if (size === 'large') {
        fontSize = '18px';
    }
    
    document.body.style.fontSize = fontSize;
}

function loadSlidesEditFields() {
    const container = document.getElementById('slidesEditContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    slidesData.forEach((slide, index) => {
        if (index >= 10) return;
        
        const slideDiv = document.createElement('div');
        slideDiv.style.marginBottom = '20px';
        slideDiv.style.padding = '10px';
        slideDiv.style.border = '1px solid #ddd';
        slideDiv.style.borderRadius = '5px';
        
        slideDiv.innerHTML = `
            <label>Slide ${index + 1} URL:</label>
            <input type="text" class="slide-url" value="${slide.url}" data-index="${index}">
            
            <label>Slide ${index + 1} Description:</label>
            <input type="text" class="slide-desc" value="${slide.description}" data-index="${index}">
            
            <label>Slide ${index + 1} Type:</label>
            <select class="slide-type" data-index="${index}">
                <option value="iframe" ${slide.type === 'iframe' ? 'selected' : ''}>Presentation/Video</option>
                <option value="image" ${slide.type === 'image' ? 'selected' : ''}>Image</option>
            </select>
            
            <button type="button" onclick="removeSlideEditField(${index})" style="margin-top: 5px;">Remove</button>
        `;
        
        container.appendChild(slideDiv);
    });
}

function addSlideEditField() {
    if (slidesData.length >= 10) {
        alert("Maximum of 10 slides allowed");
        return;
    }
    
    const newIndex = slidesData.length;
    slidesData.push({ url: "", description: `New Slide ${newIndex + 1}`, type: "iframe" });
    loadSlidesEditFields();
}

function removeSlideEditField(index) {
    if (slidesData.length <= 1) {
        alert("You must have at least one slide");
        return;
    }
    
    slidesData.splice(index, 1);
    loadSlidesEditFields();
}

function loadChallengesEditFields() {
    const container = document.getElementById('challengesEditContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    challengesData.forEach((challenge, index) => {
        if (index >= 10) return;
        
        const challengeDiv = document.createElement('div');
        challengeDiv.style.marginBottom = '20px';
        challengeDiv.style.padding = '10px';
        challengeDiv.style.border = '1px solid #ddd';
        challengeDiv.style.borderRadius = '5px';
        
        challengeDiv.innerHTML = `
            <label>Challenge ${index + 1} Title:</label>
            <input type="text" class="challenge-title" value="${challenge.title}" data-index="${index}">
            
            <label>Challenge ${index + 1} Description:</label>
            <textarea class="challenge-desc" rows="2" data-index="${index}">${challenge.description}</textarea>
            
            <button type="button" onclick="removeChallengeEditField(${index})" style="margin-top: 5px;">Remove</button>
        `;
        
        container.appendChild(challengeDiv);
    });
}

function addChallengeEditField() {
    if (challengesData.length >= 10) {
        alert("Maximum of 10 challenges allowed");
        return;
    }
    
    const newIndex = challengesData.length;
    challengesData.push({ title: `New Challenge ${newIndex + 1}`, description: "" });
    loadChallengesEditFields();
}

function removeChallengeEditField(index) {
    if (challengesData.length <= 1) {
        alert("You must have at least one challenge");
        return;
    }
    
    challengesData.splice(index, 1);
    loadChallengesEditFields();
}

function loadQuizEditFields() {
    const container = document.getElementById('quizEditContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    quizData.forEach((quiz, index) => {
        if (index >= 5) return;
        
        const quizDiv = document.createElement('div');
        quizDiv.style.marginBottom = '20px';
        quizDiv.style.padding = '10px';
        quizDiv.style.border = '1px solid #ddd';
        quizDiv.style.borderRadius = '5px';
        
        quizDiv.innerHTML = `
            <label>Question ${index + 1}:</label>
            <input type="text" class="quiz-question-input" value="${quiz.question || ''}" data-index="${index}">
            
            <label>Correct Answer:</label>
            <input type="text" class="quiz-correct-answer-input" value="${quiz.correctAnswer || ''}" data-index="${index}">
            
            <label>Incorrect Answers (One per line):</label>
            <textarea class="quiz-incorrect-answer-input" rows="2" data-index="${index}">${quiz.incorrectAnswers.join('\n')}</textarea>
            
            <button type="button" onclick="removeQuizQuestionField(${index})" style="margin-top: 5px;">Remove</button>
        `;
        
        container.appendChild(quizDiv);
    });
}

function addQuizQuestionField() {
    if (quizData.length >= 5) {
        alert("Maximum of 5 quiz questions allowed");
        return;
    }
    
    const newIndex = quizData.length;
    quizData.push({ question: "", correctAnswer: "", incorrectAnswers: ["", ""] });
    loadQuizEditFields();
}

function removeQuizQuestionField(index) {
    if (quizData.length <= 1) {
        alert("You must have at least one quiz question");
        return;
    }
    
    quizData.splice(index, 1);
    loadQuizEditFields();
}

function saveChanges() {
    document.getElementById('projectTitle').textContent = document.getElementById('editProjectTitle').value;
    document.getElementById('projectSubtitle').textContent = document.getElementById('editProjectSubtitle').value;
    document.getElementById('projectImage').src = document.getElementById('projectImageUrl').value;
    
    document.getElementById('overviewText').textContent = document.getElementById('editOverviewText').value;
    
    document.getElementById('learnTitle1').textContent = document.getElementById('learnTitle1Input').value;
    document.getElementById('learnDesc1').textContent = document.getElementById('learnDesc1Input').value;
    document.getElementById('learnTitle2').textContent = document.getElementById('learnTitle2Input').value;
    document.getElementById('learnDesc2').textContent = document.getElementById('learnDesc2Input').value;
    document.getElementById('learnTitle3').textContent = document.getElementById('learnTitle3Input').value;
    document.getElementById('learnDesc3').textContent = document.getElementById('learnDesc3Input').value;
    document.getElementById('learnTitle4').textContent = document.getElementById('learnTitle4Input').value;
    document.getElementById('learnDesc4').textContent = document.getElementById('learnDesc4Input').value;
    
    document.getElementById('videoIntroText').textContent = document.getElementById('editVideoIntroText').value;
    document.getElementById('videoTitle').textContent = document.getElementById('editVideoTitle').value;
    document.getElementById('mainVideo').src = document.getElementById('editMainVideoUrl').value;
    
    const keyPointsText = document.getElementById('editVideoKeyPoints').value;
    const keyPointsList = keyPointsText.split('\n').filter(point => point.trim() !== '');
    const keyPointsContainer = document.getElementById('videoKeyPoints');
    keyPointsContainer.innerHTML = '';
    keyPointsList.forEach(point => {
        const li = document.createElement('li');
        li.textContent = point;
        keyPointsContainer.appendChild(li);
    });
    
    const slideUrlInputs = document.querySelectorAll('.slide-url');
    const slideDescInputs = document.querySelectorAll('.slide-desc');
    const slideTypeSelects = document.querySelectorAll('.slide-type');
    
    slidesData = [];
    slideUrlInputs.forEach((input, index) => {
        slidesData.push({
            url: input.value,
            description: slideDescInputs[index].value,
            type: slideTypeSelects[index].value
        });
    });
    
    const challengeTitleInputs = document.querySelectorAll('.challenge-title');
    const challengeDescInputs = document.querySelectorAll('.challenge-desc');
    
    challengesData = [];
    challengeTitleInputs.forEach((input, index) => {
        challengesData.push({
            title: input.value,
            description: challengeDescInputs[index].value
        });
    });
    
    const quizQuestionInputs = document.querySelectorAll('.quiz-question-input');
    const quizCorrectAnswerInputs = document.querySelectorAll('.quiz-correct-answer-input');
    const quizIncorrectAnswerInputs = document.querySelectorAll('.quiz-incorrect-answer-input');
    
    quizData = [];
    quizQuestionInputs.forEach((input, index) => {
        quizData.push({
            question: input.value,
            correctAnswer: quizCorrectAnswerInputs[index].value,
            incorrectAnswers: quizIncorrectAnswerInputs[index].value.split('\n').filter(answer => answer.trim() !== '')
        });
    });
    
    updateSlideshow();
    updateChallenges();
    updateQuiz();
    
    alert('Changes saved successfully!');
    closeEditModal();
}

function updateSlideshow() {
    const container = document.getElementById('slideshowContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    slidesData.forEach((slide, index) => {
        if (!slide.url) return;
        
        const slideDiv = document.createElement('div');
        slideDiv.className = 'slide';
        if (index === 0) slideDiv.classList.add('active');
        
        const slideContentWrapper = document.createElement('div');
        slideContentWrapper.className = 'slide-content-wrapper';

        if (slide.type === 'iframe') {
            slideContentWrapper.innerHTML = `<iframe src="${slide.url}" frameborder="0" allowfullscreen></iframe>`;
        } else if (slide.type === 'image') {
            slideContentWrapper.innerHTML = `<img src="${slide.url}" alt="${slide.description}">`;
        }
        
        slideDiv.appendChild(slideContentWrapper);
        slideDiv.innerHTML += `<p>${slide.description}</p>`;
        container.appendChild(slideDiv);
    });
    
    currentSlideIndex = 0;
}

function updateChallenges() {
    const container = document.getElementById('challengesContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    challengesData.forEach((challenge, index) => {
        if (!challenge.title && !challenge.description) return;
        
        const challengeDiv = document.createElement('div');
        challengeDiv.className = 'step';
        
        challengeDiv.innerHTML = `
            <div class="step-number">★</div>
            <div class="step-content">
                <strong>${challenge.title || 'Challenge ' + (index + 1)}</strong>
                <p>${challenge.description || ''}</p>
            </div>
        `;
        
        container.appendChild(challengeDiv);
    });
}

function exportHTML() {
    // Create a clone of the document to modify for export
    const exportDoc = document.cloneNode(true);
    
    // Remove edit and export buttons from the exported version
    const exportEditBtn = exportDoc.querySelector('.edit-btn');
    if (exportEditBtn) exportEditBtn.remove();
    const exportExportBtn = exportDoc.querySelector('.export-btn');
    if (exportExportBtn) exportExportBtn.remove();
    
    // Remove the edit modal completely
    const exportModal = exportDoc.getElementById('editModal');
    if (exportModal) exportModal.remove();
    
    // Remove all script elements (keeping only basic functionality)
    const scripts = exportDoc.querySelectorAll('script');
    scripts.forEach(script => script.remove());
    
    // Prepare quiz data for the exported version
    const exportQuizData = JSON.stringify(quizData.filter(q => q.question).map(q => {
        return {
            question: q.question,
            correctAnswer: q.correctAnswer,
            incorrectAnswers: q.incorrectAnswers
        };
    }));
    
    // Add minimal script for basic functionality
    const newScript = exportDoc.createElement('script');
    newScript.textContent = `
        // Global variable for exported quiz data
        const exportedQuizData = ${exportQuizData};
        
        // Tab functionality
        function openTab(tabName, event) {
            if (event) event.preventDefault();
            
            const tabs = document.getElementsByClassName('tab-content');
            for (let i = 0; i < tabs.length; i++) {
                tabs[i].classList.remove('active');
            }
            
            const tabButtons = document.getElementsByClassName('tab');
            for (let i = 0; i < tabButtons.length; i++) {
                tabButtons[i].classList.remove('active');
            }
            
            const tabContent = document.getElementById(tabName);
            if (tabContent) tabContent.classList.add('active');
            
            if (event) {
                event.currentTarget.classList.add('active');
            } else {
                for (let i = 0; i < tabButtons.length; i++) {
                    if (tabButtons[i].getAttribute('onclick') && 
                        tabButtons[i].getAttribute('onclick').includes(tabName)) {
                        tabButtons[i].classList.add('active');
                        break;
                    }
                }
            }
            
            // Update progress bar
            const progressBar = document.getElementById('progressBar');
            if (progressBar) {
                let progress = 20;
                if (tabName === 'video') progress = 40;
                else if (tabName === 'slides') progress = 60;
                else if (tabName === 'challenges') progress = 80;
                else if (tabName === 'quiz') progress = 100;
                progressBar.style.width = progress + '%';
            }
        }
        
        // Slideshow functionality
        let currentSlideIndex = 0;
        function showSlide(n) {
            const slides = document.querySelectorAll('#slideshowContainer .slide');
            if (slides.length === 0) return;
            
            for (let i = 0; i < slides.length; i++) {
                slides[i].classList.remove('active');
            }
            
            currentSlideIndex = (n + slides.length) % slides.length;
            slides[currentSlideIndex].classList.add('active');
        }
        
        function nextSlide() {
            showSlide(currentSlideIndex + 1);
        }
        
        function prevSlide() {
            showSlide(currentSlideIndex - 1);
        }
        
        // Quiz functionality
        function selectOption(option) {
            const quizQuestion = option.closest('.quiz-question');
            if (!quizQuestion) return;

            const options = quizQuestion.getElementsByClassName('quiz-option');
            for (let i = 0; i < options.length; i++) {
                options[i].classList.remove('selected');
            }
            option.classList.add('selected');
            
            const feedback = quizQuestion.querySelector('.quiz-feedback');
            if (feedback) {
                feedback.style.display = 'none';
            }
        }
        
        function submitQuiz() {
            const quizQuestions = document.querySelectorAll('.quiz-question');
            let score = 0;
            let totalQuestions = 0;
            
            quizQuestions.forEach((questionDiv, index) => {
                if (!exportedQuizData[index]) return;
                totalQuestions++;
                
                const selectedOption = questionDiv.querySelector('.quiz-option.selected');
                const feedback = questionDiv.querySelector('.quiz-feedback');
                
                if (selectedOption && feedback) {
                    // Get the actual answer text without the A/B/C label
                    const selectedAnswerText = selectedOption.textContent.replace(/^[A-Z]\)\s*/, '');
                    const isCorrect = selectedAnswerText === exportedQuizData[index].correctAnswer;
                    
                    if (isCorrect) {
                        score++;
                        feedback.classList.add('correct');
                        feedback.classList.remove('incorrect');
                        feedback.textContent = 'Correct!';
                    } else {
                        feedback.classList.add('incorrect');
                        feedback.classList.remove('correct');
                        feedback.textContent = 'Incorrect! The correct answer is: ' + exportedQuizData[index].correctAnswer;
                    }
                    feedback.style.display = 'block';
                }
            });
            
            const resultMessage = document.getElementById('quizResultMessage');
            const partyPopperContainer = document.getElementById('partyPopperContainer');
            
            if (resultMessage) {
                if (score === totalQuestions) {
                    resultMessage.textContent = '🎉 Perfect! You got ' + score + ' out of ' + totalQuestions + ' correct!';
                    if (partyPopperContainer) {
                        partyPopperContainer.style.display = 'flex';
                        setTimeout(() => {
                            if (partyPopperContainer) partyPopperContainer.style.display = 'none';
                        }, 3000);
                    }
                } else {
                    resultMessage.textContent = 'You got ' + score + ' out of ' + totalQuestions + ' correct. Try again!';
                }
                resultMessage.style.display = 'block';
                resultMessage.scrollIntoView({ behavior: 'smooth' });
            }
        }
        
        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            // Set up tab click handlers
            const tabs = document.querySelectorAll('.tab');
            tabs.forEach(tab => {
                tab.addEventListener('click', function(event) {
                    const tabName = this.getAttribute('onclick').match(/'([^']+)'/)[1];
                    openTab(tabName, event);
                });
            });
            
            // Activate first tab and first slide by default
            if (tabs.length > 0) {
                const firstTabName = tabs[0].getAttribute('onclick').match(/'([^']+)'/)[1];
                openTab(firstTabName);
            }
            
            // Initialize first slide if exists
            const firstSlide = document.querySelector('#slideshowContainer .slide');
            if (firstSlide) {
                firstSlide.classList.add('active');
            }
        });
    `;
    
    exportDoc.body.appendChild(newScript);
    
    // Create HTML string
    const htmlContent = '<!DOCTYPE html>\n' + exportDoc.documentElement.outerHTML;
    
    // Create download link
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'microbit-project.html';
    a.style.display = 'none';
    
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    updateProgressBar('overview');
    updateSlideshow();
    updateChallenges();
    updateQuiz();
    
    // Set up tab click handlers
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function(event) {
            const tabName = this.getAttribute('onclick').match(/'(.*?)'/)[1];
            openTab(tabName, event);
        });
    });
    
    // Activate first tab by default
    if (tabs.length > 0) {
        const firstTabName = tabs[0].getAttribute('onclick').match(/'(.*?)'/)[1];
        openTab(firstTabName);
    }
});
