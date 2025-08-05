// Lesson 3: LED Interactive Script
// Global state variables
let ledPolarity = false; // false = reverse bias (wrong), true = forward bias (correct)
let colorSwitchState = false; // false = off, true = on
let quizAnswered = [false, false, false, false];
let quizScore = 0;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeInteractiveElements();
    updateProgress();
    initializeLEDDemo();
});

// Initialize all interactive elements
function initializeInteractiveElements() {
    // Add click event listeners for interactive elements
    const testLED = document.getElementById('testLED');
    if (testLED) {
        testLED.addEventListener('click', toggleLEDPolarity);
    }
    
    const colorSwitch = document.getElementById('colorSwitch');
    if (colorSwitch) {
        colorSwitch.addEventListener('click', toggleColorSwitch);
    }
    
    // Initialize quiz event listeners
    initializeQuiz();
    
    // Initialize LED color demonstrations
    initializeLEDColors();
}

// Initialize LED demo with correct starting state
function initializeLEDDemo() {
    // Start with wrong polarity to demonstrate the concept
    ledPolarity = false;
    updateLEDDisplay();
}

// LED Polarity Toggle Function
function toggleLEDPolarity() {
    ledPolarity = !ledPolarity;
    updateLEDDisplay();
    updateObjectiveProgress(2); // Mark polarity objective as completed
    
    // Add visual feedback
    const testLED = document.getElementById('testLED');
    addClickEffect(testLED);
}

function updateLEDDisplay() {
    const ledBody = document.getElementById('ledBody');
    const ledSymbol = document.getElementById('ledSymbol');
    const ledCathode = document.getElementById('ledCathode');
    const lightRays = document.getElementById('lightRays');
    const ledStatus = document.getElementById('ledStatus');
    const ledPolarity = document.getElementById('ledPolarity');
    const currentDot = document.getElementById('testCurrentDot');
    const wires = document.querySelectorAll('.test-wire');
    
    if (ledPolarity) {
        // Forward bias - LED works
        ledBody.setAttribute('fill', '#FFF9C4');
        ledBody.setAttribute('stroke', '#FFD700');
        ledBody.setAttribute('stroke-width', '4');
        ledBody.style.filter = 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.8))';
        
        // Update LED symbol to show correct orientation
        ledSymbol.setAttribute('fill', '#FFD700');
        ledSymbol.setAttribute('stroke', '#FF8F00');
        ledCathode.setAttribute('stroke', '#FF8F00');
        
        // Show light rays
        lightRays.style.opacity = '1';
        
        // Update status
        ledStatus.textContent = 'LED สว่าง (ขั้วถูกต้อง)';
        ledStatus.setAttribute('fill', '#52c41a');
        ledPolarity.textContent = 'ขั้วบวก → ขั้วลบ';
        ledPolarity.setAttribute('fill', '#52c41a');
        
        // Activate wires and current flow
        wires.forEach(wire => {
            wire.setAttribute('stroke', '#2196F3');
            wire.classList.add('active');
        });
        
        currentDot.style.opacity = '1';
        
        updateObjectiveProgress(3); // Mark connection objective as completed
        
    } else {
        // Reverse bias - LED doesn't work
        ledBody.setAttribute('fill', 'white');
        ledBody.setAttribute('stroke', '#ccc');
        ledBody.setAttribute('stroke-width', '3');
        ledBody.style.filter = 'none';
        
        // Update LED symbol to show reverse orientation
        ledSymbol.setAttribute('fill', '#ccc');
        ledSymbol.setAttribute('stroke', '#666');
        ledCathode.setAttribute('stroke', '#666');
        
        // Hide light rays
        lightRays.style.opacity = '0';
        
        // Update status
        ledStatus.textContent = 'LED ดับ (ขั้วผิด)';
        ledStatus.setAttribute('fill', '#ff4d4f');
        ledPolarity.textContent = 'ขั้วลบ → ขั้วบวก';
        ledPolarity.setAttribute('fill', '#ff4d4f');
        
        // Deactivate wires and current flow
        wires.forEach(wire => {
            wire.setAttribute('stroke', '#666');
            wire.classList.remove('active');
        });
        
        currentDot.style.opacity = '0';
    }
}

// Reset LED test
function resetLEDTest() {
    ledPolarity = false;
    updateLEDDisplay();
}

// Color Switch Control
function toggleColorSwitch() {
    colorSwitchState = !colorSwitchState;
    updateColorSwitchDisplay();
    updateObjectiveProgress(1); // Mark LED understanding objective as completed
}

function updateColorSwitchDisplay() {
    const lever = document.getElementById('colorSwitchLever');
    const allLEDs = document.querySelectorAll('.demo-led');
    const allWires = document.querySelectorAll('.color-wire');
    
    if (colorSwitchState) {
        // Switch closed - LEDs on
        lever.setAttribute('x2', '25');
        lever.setAttribute('y2', '0');
        lever.setAttribute('stroke', '#2196F3');
        
        // Activate all wires
        allWires.forEach(wire => {
            wire.setAttribute('stroke', '#2196F3');
            wire.classList.add('active');
        });
        
        // Turn on LEDs with their respective colors
        setTimeout(() => activateLED(document.querySelector('.red-demo'), '#ff4d4f'), 100);
        setTimeout(() => activateLED(document.querySelector('.yellow-demo'), '#ffa500'), 200);
        setTimeout(() => activateLED(document.querySelector('.green-demo'), '#52c41a'), 300);
        setTimeout(() => activateLED(document.querySelector('.blue-demo'), '#1890ff'), 400);
        
    } else {
        // Switch open - LEDs off
        lever.setAttribute('x2', '25');
        lever.setAttribute('y2', '-18');
        lever.setAttribute('stroke', '#ff4d4f');
        
        // Deactivate all wires
        allWires.forEach(wire => {
            wire.setAttribute('stroke', '#666');
            wire.classList.remove('active');
        });
        
        // Turn off all LEDs
        allLEDs.forEach(led => deactivateLED(led));
    }
}

// LED Color Functions
function activateLED(led, color) {
    if (!led) return;
    
    led.setAttribute('fill', color);
    led.setAttribute('stroke', color);
    led.setAttribute('stroke-width', '3');
    led.style.filter = `drop-shadow(0 0 8px ${color})`;
    led.classList.add('on');
}

function deactivateLED(led) {
    if (!led) return;
    
    led.setAttribute('fill', 'white');
    led.setAttribute('stroke', '#ccc');
    led.setAttribute('stroke-width', '2');
    led.style.filter = 'none';
    led.classList.remove('on');
}

// Initialize LED Color demonstrations
function initializeLEDColors() {
    const colorItems = document.querySelectorAll('.color-item');
    
    colorItems.forEach((item, index) => {
        // Add hover effects
        item.addEventListener('mouseenter', function() {
            const led = this.querySelector('.led-visual');
            led.style.transform = 'scale(1.1)';
            led.style.transition = 'transform 0.3s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            const led = this.querySelector('.led-visual');
            led.style.transform = 'scale(1)';
        });
        
        // Add click effect to demonstrate LED
        item.addEventListener('click', function() {
            demonstrateLEDColor(this);
        });
    });
}

function demonstrateLEDColor(colorItem) {
    const led = colorItem.querySelector('.led-visual');
    const color = colorItem.dataset.color;
    
    // Flash effect
    led.style.boxShadow = `0 0 20px var(--${color}-color)`;
    led.style.transform = 'scale(1.2)';
    
    setTimeout(() => {
        led.style.boxShadow = 'none';
        led.style.transform = 'scale(1)';
    }, 500);
    
    updateObjectiveProgress(4); // Mark resistor importance objective
}

// Quiz functionality
function initializeQuiz() {
    const options = document.querySelectorAll('.quiz-option input[type="radio"]');
    options.forEach(option => {
        option.addEventListener('change', handleQuizAnswer);
    });
}

function handleQuizAnswer(event) {
    const questionNum = parseInt(event.target.name.replace('quiz', ''));
    const questionElement = document.getElementById(`quizQuestion${questionNum}`);
    const feedbackElement = document.getElementById(`quizFeedback${questionNum}`);
    const correctOption = questionElement.querySelector('.quiz-option[data-correct="true"]');
    const selectedOption = event.target.closest('.quiz-option');
    
    // Remove previous styling
    const allOptions = questionElement.querySelectorAll('.quiz-option');
    allOptions.forEach(opt => {
        opt.classList.remove('correct', 'incorrect');
    });
    
    // Mark correct answer
    correctOption.classList.add('correct');
    
    // Check if selected answer is correct
    const isCorrect = selectedOption === correctOption;
    
    if (!isCorrect) {
        selectedOption.classList.add('incorrect');
    }
    
    // Show feedback
    feedbackElement.style.display = 'block';
    feedbackElement.className = `quiz-feedback show ${isCorrect ? 'correct' : 'incorrect'}`;
    
    if (isCorrect) {
        feedbackElement.innerHTML = `
            <strong>✅ ถูกต้อง!</strong> 
            ${getCorrectAnswerExplanation(questionNum)}
        `;
        if (!quizAnswered[questionNum - 1]) {
            quizScore++;
            quizAnswered[questionNum - 1] = true;
        }
    } else {
        feedbackElement.innerHTML = `
            <strong>❌ ไม่ถูกต้อง</strong> 
            ${getCorrectAnswerExplanation(questionNum)}
        `;
    }
    
    // Check completion
    checkQuizCompletion();
}

function getCorrectAnswerExplanation(questionNum) {
    const explanations = {
        1: 'ขาที่ยาวกว่าของ LED เป็นขั้วบวก (+) และขาที่สั้นกว่าเป็นขั้วลบ (-) นี่เป็นมาตรฐานสากล',
        2: 'ตัวต้านทานจำกัดกระแสไฟฟ้าที่ไหลผ่าน LED ป้องกันไม่ให้ LED ได้รับกระแสสูงเกินไปและเสียหาย',
        3: 'LED สีน้ำเงินต้องการแรงดันไฟฟ้าสูงสุด (2.5-3.7V) เพราะพลังงานของแสงสีน้ำเงินสูงกว่าสีอื่นๆ',
        4: 'LED เป็นไดโอดที่นำไฟฟ้าทิศทางเดียว หากต่อขั้วผิด กระแสไฟฟ้าจะไหลผ่านไม่ได้ LED จึงไม่ส่องสว่าง'
    };
    return explanations[questionNum] || '';
}

function checkQuizCompletion() {
    const totalAnswered = quizAnswered.filter(answered => answered).length;
    
    if (totalAnswered === 4) {
        setTimeout(() => {
            showQuizResults();
        }, 1000);
    }
}

function showQuizResults() {
    const scoreElement = document.getElementById('quizScore');
    const scoreText = document.getElementById('scoreText');
    
    const percentage = Math.round((quizScore / 4) * 100);
    
    let message = '';
    if (percentage === 100) {
        message = `🎉 ยอดเยี่ยม! คุณได้คะแนน ${quizScore}/4 (${percentage}%) \nคุณเข้าใจเรื่อง LED เป็นอย่างดี!`;
    } else if (percentage >= 75) {
        message = `👍 ดีมาก! คุณได้คะแนน ${quizScore}/4 (${percentage}%) \nคุณเข้าใจแนวคิดหลักแล้ว`;
    } else if (percentage >= 50) {
        message = `📖 พอใช้ คุณได้คะแนน ${quizScore}/4 (${percentage}%) \nควรทบทวนเนื้อหาเพิ่มเติม`;
    } else {
        message = `📚 คุณได้คะแนน ${quizScore}/4 (${percentage}%) \nลองทบทวนเนื้อหาและทำแบบทดสอบใหม่นะ`;
    }
    
    scoreText.textContent = message;
    scoreElement.style.display = 'block';
    
    // Show completion modal if score is good
    if (percentage >= 75) {
        setTimeout(() => {
            showCompletionModal();
        }, 2000);
    }
}

function resetQuiz() {
    quizAnswered = [false, false, false, false];
    quizScore = 0;
    
    // Reset all quiz elements
    const options = document.querySelectorAll('.quiz-option');
    options.forEach(option => {
        option.classList.remove('correct', 'incorrect');
    });
    
    const radios = document.querySelectorAll('.quiz-option input[type="radio"]');
    radios.forEach(radio => {
        radio.checked = false;
    });
    
    const feedbacks = document.querySelectorAll('.quiz-feedback');
    feedbacks.forEach(feedback => {
        feedback.style.display = 'none';
        feedback.classList.remove('show', 'correct', 'incorrect');
    });
    
    document.getElementById('quizScore').style.display = 'none';
}

// Progress tracking
function updateProgress() {
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.nav-progress span');
    
    let completedObjectives = 0;
    const objectives = document.querySelectorAll('.objective-item');
    
    objectives.forEach(objective => {
        if (objective.classList.contains('completed')) {
            completedObjectives++;
        }
    });
    
    const progress = Math.round((completedObjectives / 4) * 100);
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `${progress}%`;
}

function updateObjectiveProgress(objectiveNum) {
    const objective = document.querySelector(`.objective-item:nth-child(${objectiveNum})`);
    if (objective && !objective.classList.contains('completed')) {
        objective.classList.add('completed');
        
        // Update icon
        const icon = objective.querySelector('.objective-status i');
        icon.className = 'fas fa-check-circle';
        
        updateProgress();
        
        // Add completion animation
        objective.style.transform = 'scale(1.05)';
        setTimeout(() => {
            objective.style.transform = 'scale(1)';
        }, 300);
        
        // Add sparkle effect
        addSparkleEffect(objective);
    }
}

// Modal functionality
function showCompletionModal() {
    const modal = document.getElementById('completionModal');
    modal.classList.add('show');
}

function closeModal() {
    const modal = document.getElementById('completionModal');
    modal.classList.remove('show');
}

// Visual effects
function addClickEffect(element) {
    element.style.transform = 'scale(0.95)';
    setTimeout(() => {
        element.style.transform = 'scale(1)';
    }, 150);
}

function addSparkleEffect(element) {
    element.style.position = 'relative';
    
    for (let i = 0; i < 3; i++) {
        const sparkle = document.createElement('div');
        sparkle.innerHTML = '✨';
        sparkle.style.position = 'absolute';
        sparkle.style.fontSize = '12px';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.animation = `sparkle 1s ease-out ${i * 0.2}s`;
        sparkle.style.left = `${Math.random() * 100}%`;
        sparkle.style.top = `${Math.random() * 100}%`;
        sparkle.style.zIndex = '1000';
        
        element.appendChild(sparkle);
        
        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.parentNode.removeChild(sparkle);
            }
        }, 1000);
    }
}

// CSS Animation keyframes and additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes sparkle {
        0% { 
            opacity: 1; 
            transform: scale(0) rotate(0deg); 
        }
        50% { 
            opacity: 1; 
            transform: scale(1) rotate(180deg); 
        }
        100% { 
            opacity: 0; 
            transform: scale(0) rotate(360deg); 
        }
    }
    
    .led-visual {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        margin: 0 auto 1rem;
        transition: all 0.3s ease;
        border: 3px solid;
    }
    
    .red-led {
        background: linear-gradient(135deg, #ff4d4f, #ff7875);
        border-color: #ff4d4f;
    }
    
    .yellow-led {
        background: linear-gradient(135deg, #ffa500, #ffc069);
        border-color: #ffa500;
    }
    
    .green-led {
        background: linear-gradient(135deg, #52c41a, #73d13d);
        border-color: #52c41a;
    }
    
    .blue-led {
        background: linear-gradient(135deg, #1890ff, #40a9ff);
        border-color: #1890ff;
    }
    
    .color-item {
        transition: all 0.3s ease;
        cursor: pointer;
    }
    
    .color-item:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    }
    
    .interactive-led:hover {
        transform: scale(1.05);
        transition: transform 0.2s ease;
    }
    
    .test-wire.active {
        animation: currentPulse 2s ease-in-out infinite;
    }
    
    @keyframes currentPulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
    }
    
    .comparison-item.danger {
        border: 2px solid #ff4d4f;
        background: #fff2f0;
    }
    
    .comparison-item.safe {
        border: 2px solid #52c41a;
        background: #f6ffed;
    }
    
    .explanation {
        margin-top: 1rem;
        padding: 1rem;
        border-radius: 8px;
        background: rgba(255,255,255,0.8);
    }
    
    .color-comparison {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 2rem;
        margin-bottom: 3rem;
    }
    
    .color-specs {
        margin-top: 1rem;
    }
    
    .spec-item {
        display: flex;
        justify-content: space-between;
        margin: 0.5rem 0;
        padding: 0.5rem;
        background: rgba(255,255,255,0.5);
        border-radius: 4px;
    }
    
    .spec-label {
        font-weight: 600;
        color: #666;
    }
    
    .spec-value {
        font-weight: 500;
        color: #333;
    }
    
    .resistor-comparison {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        margin-top: 2rem;
    }
    
    @media (max-width: 768px) {
        .resistor-comparison {
            grid-template-columns: 1fr;
        }
        
        .color-comparison {
            grid-template-columns: 1fr 1fr;
        }
    }
`;
document.head.appendChild(styleSheet);

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    switch(event.key) {
        case '1':
            if (event.ctrlKey) {
                event.preventDefault();
                toggleLEDPolarity();
            }
            break;
        case '2':
            if (event.ctrlKey) {
                event.preventDefault();
                toggleColorSwitch();
            }
            break;
        case 'r':
            if (event.ctrlKey) {
                event.preventDefault();
                resetQuiz();
            }
            break;
    }
});

// Touch device support
function addTouchSupport() {
    const interactiveElements = document.querySelectorAll('.interactive-led, .interactive-switch, .color-item');
    
    interactiveElements.forEach(element => {
        element.addEventListener('touchstart', function(e) {
            e.target.style.transform = 'scale(0.95)';
        });
        
        element.addEventListener('touchend', function(e) {
            e.target.style.transform = 'scale(1)';
        });
    });
}

// Initialize touch support on load
document.addEventListener('DOMContentLoaded', addTouchSupport);

// Export functions for global access
window.toggleLEDPolarity = toggleLEDPolarity;
window.resetLEDTest = resetLEDTest;
window.toggleColorSwitch = toggleColorSwitch;
window.resetQuiz = resetQuiz;
window.closeModal = closeModal;