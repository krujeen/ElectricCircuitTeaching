// Lesson 2: Switch Control Interactive Script
// Global state variables
let switchState = false; // false = open, true = closed
let masterSwitchState = false;
let switch1State = false;
let switch2State = false;
let quizAnswered = [false, false, false];
let quizScore = 0;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeInteractiveElements();
    updateProgress();
});

// Initialize all interactive elements
function initializeInteractiveElements() {
    // Add click event listeners for interactive switches
    const mainSwitch = document.getElementById('mainSwitch');
    if (mainSwitch) {
        mainSwitch.addEventListener('click', toggleSwitch);
    }
    
    const masterSwitch = document.getElementById('masterSwitch');
    if (masterSwitch) {
        masterSwitch.addEventListener('click', toggleMasterSwitch);
        console.log('Master switch event listener added');
    } else {
        console.log('Master switch not found during initialization');
        // Try again after a short delay
        setTimeout(() => {
            const masterSwitchDelayed = document.getElementById('masterSwitch');
            if (masterSwitchDelayed) {
                masterSwitchDelayed.addEventListener('click', toggleMasterSwitch);
                console.log('Master switch event listener added (delayed)');
            }
        }, 100);
    }
    
    const switch1 = document.getElementById('switch1');
    if (switch1) {
        switch1.addEventListener('click', toggleSwitch1);
    }
    
    const switch2 = document.getElementById('switch2');
    if (switch2) {
        switch2.addEventListener('click', toggleSwitch2);
    }
    
    // Initialize quiz event listeners
    initializeQuiz();
}

// Main switch toggle function
function toggleSwitch() {
    switchState = !switchState;
    updateSwitchDisplay();
    updateObjectiveProgress(1); // Mark first objective as completed
}

function updateSwitchDisplay() {
    const lever = document.getElementById('switchLever');
    const status = document.getElementById('switchStatus');
    const battery = document.getElementById('switchBattery');
    const bulb = document.getElementById('switchBulb');
    const currentDot = document.getElementById('switchCurrentDot');
    const wires = document.querySelectorAll('.sim-wire');
    
    if (switchState) {
        // Switch closed - circuit complete
        lever.setAttribute('x2', '25');
        lever.setAttribute('y2', '0');
        lever.setAttribute('stroke', '#2196F3');
        status.textContent = 'สวิตช์ปิด';
        status.setAttribute('fill', '#2196F3');
        
        // Activate circuit
        battery.classList.add('active');
        bulb.classList.add('on');
        currentDot.style.opacity = '1';
        
        // Activate wires
        wires.forEach(wire => wire.classList.add('active'));
        
        // Add glow effect to bulb
        const bulbCircle = bulb.querySelector('circle');
        bulbCircle.setAttribute('fill', '#FFF9C4');
        bulbCircle.setAttribute('stroke', '#FFD700');
        bulbCircle.style.filter = 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.8))';
        
    } else {
        // Switch open - circuit incomplete
        lever.setAttribute('x2', '20');
        lever.setAttribute('y2', '-15');
        lever.setAttribute('stroke', '#ff4d4f');
        status.textContent = 'สวิตช์เปิด';
        status.setAttribute('fill', '#ff4d4f');
        
        // Deactivate circuit
        battery.classList.remove('active');
        bulb.classList.remove('on');
        currentDot.style.opacity = '0';
        
        // Deactivate wires
        wires.forEach(wire => wire.classList.remove('active'));
        
        // Remove glow effect from bulb
        const bulbCircle = bulb.querySelector('circle');
        bulbCircle.setAttribute('fill', 'white');
        bulbCircle.setAttribute('stroke', '#ccc');
        bulbCircle.style.filter = 'none';
    }
}

// Reset switch demo
function resetSwitchDemo() {
    switchState = false;
    updateSwitchDisplay();
}

// Master switch control for series circuit
function toggleMasterSwitch() {
    masterSwitchState = !masterSwitchState;
    console.log('Master switch toggled:', masterSwitchState);
    updateMasterSwitchDisplay();
    updateObjectiveProgress(2); // Mark second objective as completed
}

function updateMasterSwitchDisplay() {
    console.log('updateMasterSwitchDisplay called, state:', masterSwitchState);
    
    const lever = document.getElementById('masterSwitchLever');
    const bulb1 = document.getElementById('seriesBulb1');
    const bulb2 = document.getElementById('seriesBulb2');
    const fan = document.getElementById('seriesFan');
    const currentDot = document.getElementById('seriesCurrentDot');
    
    // Debug logging
    console.log('Elements found:', {
        lever: !!lever,
        bulb1: !!bulb1,
        bulb2: !!bulb2,
        fan: !!fan,
        currentDot: !!currentDot
    });
    
    const masterSwitchElement = document.querySelector('#masterSwitch');
    if (!masterSwitchElement) {
        console.error('Master switch element not found');
        // Try alternative approach - update based on visual feedback only
        if (masterSwitchState) {
            console.log('Attempting visual-only update for ON state');
        } else {
            console.log('Attempting visual-only update for OFF state');
        }
        return;
    }
    
    const seriesCircuitSvg = masterSwitchElement.closest('svg');
    const battery = seriesCircuitSvg ? seriesCircuitSvg.querySelector('.sim-battery') : null;
    const wires = seriesCircuitSvg ? seriesCircuitSvg.querySelectorAll('.sim-wire') : [];
    
    console.log('Circuit elements found:', {
        svg: !!seriesCircuitSvg,
        battery: !!battery,
        wiresCount: wires.length
    });
    
    if (masterSwitchState) {
        // Switch closed - all devices on
        if (lever) {
            lever.setAttribute('x2', '20');
            lever.setAttribute('y2', '0');
            lever.setAttribute('stroke', '#2196F3');
        }
        
        // Activate battery
        activateBattery(battery);
        
        // Turn on all devices
        activateDevice(bulb1);
        activateDevice(bulb2);
        activateDevice(fan);
        
        // Activate wires
        wires.forEach(wire => {
            wire.classList.add('active');
            wire.setAttribute('stroke', '#2196F3');
            wire.setAttribute('stroke-width', '4');
        });
        
        // Show current flow
        if (currentDot) {
            currentDot.style.opacity = '1';
        }
        
    } else {
        // Switch open - all devices off
        if (lever) {
            lever.setAttribute('x2', '20');
            lever.setAttribute('y2', '-12');
            lever.setAttribute('stroke', '#ff4d4f');
        }
        
        // Deactivate battery
        deactivateBattery(battery);
        
        // Turn off all devices
        deactivateDevice(bulb1);
        deactivateDevice(bulb2);
        deactivateDevice(fan);
        
        // Deactivate wires
        wires.forEach(wire => {
            wire.classList.remove('active');
            wire.setAttribute('stroke', '#666');
            wire.setAttribute('stroke-width', '3');
        });
        
        // Hide current flow
        if (currentDot) {
            currentDot.style.opacity = '0';
        }
    }
}

// Individual switch controls for parallel circuit
function toggleSwitch1() {
    switch1State = !switch1State;
    updateSwitch1Display();
    updateObjectiveProgress(3); // Mark third objective as completed
}

function toggleSwitch2() {
    switch2State = !switch2State;
    updateSwitch2Display();
    updateObjectiveProgress(3); // Mark third objective as completed
}

function toggleBothSwitches() {
    switch1State = !switch1State;
    switch2State = !switch2State;
    updateSwitch1Display();
    updateSwitch2Display();
    updateObjectiveProgress(3); // Mark third objective as completed
}

function updateSwitch1Display() {
    const lever = document.getElementById('switch1Lever');
    const bulb = document.getElementById('parallelBulb1');
    const currentDot = document.getElementById('parallelCurrentDot1');
    
    if (switch1State) {
        lever.setAttribute('x2', '15');
        lever.setAttribute('y2', '0');
        lever.setAttribute('stroke', '#2196F3');
        activateDevice(bulb);
        currentDot.style.opacity = '1';
    } else {
        lever.setAttribute('x2', '15');
        lever.setAttribute('y2', '-10');
        lever.setAttribute('stroke', '#ff4d4f');
        deactivateDevice(bulb);
        currentDot.style.opacity = '0';
    }
}

function updateSwitch2Display() {
    const lever = document.getElementById('switch2Lever');
    const fan = document.getElementById('parallelFan');
    const currentDot = document.getElementById('parallelCurrentDot2');
    
    if (switch2State) {
        lever.setAttribute('x2', '15');
        lever.setAttribute('y2', '0');
        lever.setAttribute('stroke', '#2196F3');
        activateDevice(fan);
        currentDot.style.opacity = '1';
    } else {
        lever.setAttribute('x2', '15');
        lever.setAttribute('y2', '-10');
        lever.setAttribute('stroke', '#ff4d4f');
        deactivateDevice(fan);
        currentDot.style.opacity = '0';
    }
}

// Utility functions for device activation
function activateDevice(device) {
    if (!device) return;
    
    device.classList.add('on');
    const circle = device.querySelector('circle');
    if (circle) {
        circle.setAttribute('fill', '#FFF9C4');
        circle.setAttribute('stroke', '#FFD700');
        circle.setAttribute('stroke-width', '3');
        circle.style.filter = 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.6))';
    }
    
    // Add glow animation
    const text = device.querySelector('text');
    if (text) {
        text.style.filter = 'drop-shadow(0 0 3px rgba(255, 215, 0, 0.8))';
    }
}

function deactivateDevice(device) {
    if (!device) return;
    
    device.classList.remove('on');
    const circle = device.querySelector('circle');
    if (circle) {
        circle.setAttribute('fill', 'white');
        circle.setAttribute('stroke', '#ccc');
        circle.setAttribute('stroke-width', '2');
        circle.style.filter = 'none';
    }
    
    // Remove glow
    const text = device.querySelector('text');
    if (text) {
        text.style.filter = 'none';
    }
}

// Function to activate battery
function activateBattery(battery) {
    if (!battery) return;
    
    battery.classList.add('active');
    const rect = battery.querySelector('rect');
    if (rect) {
        rect.setAttribute('fill', '#66BB6A');
        rect.style.filter = 'drop-shadow(0 0 3px rgba(102, 187, 106, 0.5))';
    }
}

function deactivateBattery(battery) {
    if (!battery) return;
    
    battery.classList.remove('active');
    const rect = battery.querySelector('rect');
    if (rect) {
        rect.setAttribute('fill', '#4CAF50');
        rect.style.filter = 'none';
    }
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
    
    // Update progress and check completion
    updateObjectiveProgress(4);
    checkQuizCompletion();
}

function getCorrectAnswerExplanation(questionNum) {
    const explanations = {
        1: 'สวิตช์ต้องต่อแบบอนุกรมกับอุปกรณ์ที่ต้องการควบคุม เมื่อสวิตช์เปิด วงจรจะไม่ครบวงจร อุปกรณ์ทั้งหมดจะหยุดทำงาน',
        2: 'สวิตช์ในบ้านต่อแบบขนาน เพื่อให้สามารถควบคุมไฟแต่ละห้องได้อย่างอิสระ โดยไม่ส่งผลกระทบต่อห้องอื่น',
        3: 'สวิตช์เปิด หมายถึงวงจรไม่ครบวงจร กระแสไฟฟ้าไหลผ่านไม่ได้ อุปกรณ์จึงไม่ทำงาน'
    };
    return explanations[questionNum] || '';
}

function checkQuizCompletion() {
    const totalAnswered = quizAnswered.filter(answered => answered).length;
    
    if (totalAnswered === 3) {
        setTimeout(() => {
            showQuizResults();
        }, 1000);
    }
}

function showQuizResults() {
    const scoreElement = document.getElementById('quizScore');
    const scoreText = document.getElementById('scoreText');
    
    const percentage = Math.round((quizScore / 3) * 100);
    
    let message = '';
    if (percentage === 100) {
        message = `🎉 ยอดเยี่ยม! คุณได้คะแนน ${quizScore}/3 (${percentage}%) \nคุณเข้าใจเรื่องสวิตช์เป็นอย่างดี!`;
    } else if (percentage >= 67) {
        message = `👍 ดีมาก! คุณได้คะแนน ${quizScore}/3 (${percentage}%) \nคุณเข้าใจแนวคิดหลักแล้ว`;
    } else {
        message = `📚 คุณได้คะแนน ${quizScore}/3 (${percentage}%) \nลองทบทวนเนื้อหาและทำแบบทดสอบใหม่นะ`;
    }
    
    scoreText.textContent = message;
    scoreElement.style.display = 'block';
    
    // Show completion modal if score is good
    if (percentage >= 67) {
        setTimeout(() => {
            showCompletionModal();
        }, 2000);
    }
}

function resetQuiz() {
    quizAnswered = [false, false, false];
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

// Animation and visual effects
function addSparkleEffect(element) {
    element.style.position = 'relative';
    
    for (let i = 0; i < 5; i++) {
        const sparkle = document.createElement('div');
        sparkle.innerHTML = '✨';
        sparkle.style.position = 'absolute';
        sparkle.style.fontSize = '12px';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.animation = `sparkle 1s ease-out ${i * 0.2}s`;
        sparkle.style.left = `${Math.random() * 100}%`;
        sparkle.style.top = `${Math.random() * 100}%`;
        
        element.appendChild(sparkle);
        
        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.parentNode.removeChild(sparkle);
            }
        }, 1000);
    }
}

// CSS Animation keyframes (injected via JavaScript)
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
    
    .objective-item {
        transition: all 0.3s ease;
    }
    
    .quiz-option {
        transition: all 0.3s ease;
    }
    
    .quiz-option:hover {
        transform: translateX(5px);
    }
    
    .interactive-switch:hover {
        transform: scale(1.1);
        transition: transform 0.2s ease;
    }
    
    .sim-wire.active {
        animation: currentFlow 2s ease-in-out infinite;
    }
    
    @keyframes currentFlow {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
    }
`;
document.head.appendChild(styleSheet);

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    switch(event.key) {
        case '1':
            if (event.ctrlKey) {
                event.preventDefault();
                toggleSwitch();
            }
            break;
        case '2':
            if (event.ctrlKey) {
                event.preventDefault();
                toggleMasterSwitch();
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
    const interactiveElements = document.querySelectorAll('.interactive-switch, .quiz-option');
    
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
window.toggleSwitch = toggleSwitch;
window.resetSwitchDemo = resetSwitchDemo;
window.toggleMasterSwitch = toggleMasterSwitch;
window.toggleSwitch1 = toggleSwitch1;
window.toggleSwitch2 = toggleSwitch2;
window.toggleBothSwitches = toggleBothSwitches;
window.resetQuiz = resetQuiz;
window.closeModal = closeModal;