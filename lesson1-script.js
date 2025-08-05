// Global Variables
let progress = {
    objectives: [false, false, false, false],
    completedActivities: 0,
    totalActivities: 8
};

let quizScores = {
    questions: 0,
    quiz: 0,
    total: 0
};

let circuitStates = {
    demo1: { switch: false, bulb1: false, bulb2: false, removed: false },
    demo2: { switch: false, bulb1: false, bulb2: false, removed: false },
    series: { switch: false, bulb1: true, bulb2: true, removed: false },
    parallel: { switch: false, bulb1: true, bulb2: true, removed: false }
};

let draggedElement = null;
let circuitBuilds = {
    series: { battery: false, switch: false, bulb1: false, bulb2: false },
    parallel: { battery: false, switch: false, bulb1: false, bulb2: false }
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    updateProgress();
    setupDragAndDrop();
    resetAllCircuits();
    console.log('🔌 Lesson 1: Simple Electric Circuits - Interactive Learning Module Loaded!');
});

// Event Listeners
function initializeEventListeners() {
    // Question event listeners
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', handleQuestionAnswer);
    });

    // Quiz event listeners
    const quizRadios = document.querySelectorAll('.quiz-question input[type="radio"]');
    quizRadios.forEach(radio => {
        radio.addEventListener('change', handleQuizAnswer);
    });
}

// Progress Tracking
function updateProgress() {
    const completedObjectives = progress.objectives.filter(obj => obj).length;
    const progressPercentage = (completedObjectives / progress.objectives.length) * 100;
    
    // Update progress bar
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (progressFill && progressText) {
        progressFill.style.width = progressPercentage + '%';
        progressText.textContent = Math.round(progressPercentage) + '%';
    }
    
    // Update objective indicators
    progress.objectives.forEach((completed, index) => {
        const objectiveItem = document.querySelector(`[data-objective="${index + 1}"]`);
        if (objectiveItem) {
            if (completed) {
                objectiveItem.classList.add('completed');
                objectiveItem.querySelector('.objective-status i').className = 'fas fa-check-circle';
            } else {
                objectiveItem.classList.remove('completed');
                objectiveItem.querySelector('.objective-status i').className = 'fas fa-circle';
            }
        }
    });
    
    // Check if all objectives are completed
    if (completedObjectives === progress.objectives.length) {
        showCompletionModal();
    }
}

function markObjectiveCompleted(objectiveIndex) {
    if (!progress.objectives[objectiveIndex - 1]) {
        progress.objectives[objectiveIndex - 1] = true;
        updateProgress();
        
        // Show achievement modal
        const modal = document.getElementById('progressModal');
        const achievedSpan = document.getElementById('achievedObjective');
        if (modal && achievedSpan) {
            achievedSpan.textContent = objectiveIndex;
            modal.classList.add('show');
        }
    }
}

// Demo Circuit Functions
function toggleDemo(demoNumber) {
    const state = circuitStates[`demo${demoNumber}`];
    state.switch = !state.switch;
    
    if (demoNumber === 1) {
        // Series circuit - both bulbs together
        if (state.switch && !state.removed) {
            state.bulb1 = true;
            state.bulb2 = true;
        } else {
            state.bulb1 = false;
            state.bulb2 = false;
        }
    } else {
        // Parallel circuit - independent bulbs
        if (state.switch) {
            if (!state.removed) {
                state.bulb1 = true;
                state.bulb2 = true;
            } else {
                state.bulb1 = false; // Removed bulb
                state.bulb2 = true;  // Other bulb still works
            }
        } else {
            state.bulb1 = false;
            state.bulb2 = false;
        }
    }
    
    updateDemoVisuals(demoNumber);
    
    // Mark objective 1 as completed after first demo interaction
    if (!progress.objectives[0]) {
        markObjectiveCompleted(1);
    }
}

function removeBulb(demoNumber) {
    const state = circuitStates[`demo${demoNumber}`];
    state.removed = !state.removed;
    
    if (demoNumber === 1) {
        // Series circuit - if one bulb removed, both are off
        if (state.removed) {
            state.bulb1 = false;
            state.bulb2 = false;
        } else if (state.switch) {
            state.bulb1 = true;
            state.bulb2 = true;
        }
    } else {
        // Parallel circuit - only removed bulb is off
        if (state.removed) {
            state.bulb1 = false; // Removed bulb
            state.bulb2 = state.switch; // Other bulb depends on switch
        } else if (state.switch) {
            state.bulb1 = true;
            state.bulb2 = true;
        }
    }
    
    updateDemoVisuals(demoNumber);
    
    // Mark objective 2 and 3 as completed after bulb removal
    if (!progress.objectives[1]) {
        markObjectiveCompleted(2);
    }
    if (!progress.objectives[2]) {
        markObjectiveCompleted(3);
    }
}

function updateDemoVisuals(demoNumber) {
    const state = circuitStates[`demo${demoNumber}`];
    const demoBox = document.querySelector(`#demoBox${demoNumber}`);
    
    if (!demoBox) return;
    
    // Update SVG elements
    const battery = demoBox.querySelector('.demo-battery');
    const switchEl = demoBox.querySelector('.demo-switch');
    const bulb1 = demoBox.querySelector('.demo-bulb-1');
    const bulb2 = demoBox.querySelector('.demo-bulb-2');
    const wires = demoBox.querySelectorAll('.demo-wire');
    const currentFlow = demoBox.querySelector('.current-flow, .current-flow-1, .current-flow-2');
    
    // Update battery
    if (battery) {
        battery.classList.toggle('active', state.switch);
    }
    
    // Update switch
    if (switchEl) {
        switchEl.classList.toggle('on', state.switch);
    }
    
    // Update bulb 1
    if (bulb1) {
        bulb1.classList.toggle('on', state.bulb1);
        bulb1.classList.toggle('removed', state.removed);
    }
    
    // Update bulb 2
    if (bulb2) {
        bulb2.classList.toggle('on', state.bulb2);
    }
    
    // Update wires
    wires.forEach(wire => {
        const isActive = state.switch && (demoNumber === 2 || !state.removed);
        wire.classList.toggle('active', isActive);
    });
    
    // Update current flow animation
    if (currentFlow) {
        const showCurrent = state.switch && (demoNumber === 2 || !state.removed);
        currentFlow.classList.toggle('active', showCurrent);
    }
}

function resetDemo(demoNumber) {
    circuitStates[`demo${demoNumber}`] = { switch: false, bulb1: false, bulb2: false, removed: false };
    updateDemoVisuals(demoNumber);
}

// Circuit Simulator Functions
function toggleSeriesCircuit() {
    const state = circuitStates.series;
    state.switch = !state.switch;
    
    if (state.switch && state.bulb1 && state.bulb2) {
        // Both bulbs on
        updateSeriesVisuals(true, true, true);
    } else {
        // Circuit off
        updateSeriesVisuals(false, false, false);
    }
}

function removeSeriesBulb() {
    const state = circuitStates.series;
    state.removed = !state.removed;
    
    if (state.removed) {
        state.bulb1 = false;
        updateSeriesVisuals(state.switch, false, false);
    } else {
        state.bulb1 = true;
        if (state.switch) {
            updateSeriesVisuals(true, true, true);
        }
    }
}

function resetSeriesCircuit() {
    circuitStates.series = { switch: false, bulb1: true, bulb2: true, removed: false };
    updateSeriesVisuals(false, false, false);
}

function updateSeriesVisuals(switchOn, bulb1On, bulb2On) {
    const battery = document.getElementById('simSeriesBattery');
    const switchEl = document.getElementById('simSeriesSwitch');
    const bulb1El = document.getElementById('simSeriesBulb1');
    const bulb2El = document.getElementById('simSeriesBulb2');
    const wires = document.querySelectorAll('.circuit-svg .sim-wire');
    const currentDot = document.querySelector('.current-dot');
    const voltageIndicators = document.querySelectorAll('.voltage-indicator');
    
    // Update battery
    if (battery) {
        battery.classList.toggle('active', switchOn);
    }
    
    // Update switch
    if (switchEl) {
        switchEl.classList.toggle('on', switchOn);
    }
    
    // Update bulb 1
    if (bulb1El) {
        bulb1El.classList.toggle('on', bulb1On && !circuitStates.series.removed);
        bulb1El.classList.toggle('removed', circuitStates.series.removed);
    }
    
    // Update bulb 2
    if (bulb2El) {
        bulb2El.classList.toggle('on', bulb2On);
    }
    
    // Update wires
    wires.forEach(wire => {
        const isActive = switchOn && !circuitStates.series.removed;
        wire.classList.toggle('active', isActive);
    });
    
    // Update current flow animation
    if (currentDot) {
        const showCurrent = switchOn && !circuitStates.series.removed;
        currentDot.classList.toggle('active', showCurrent);
    }
    
    // Update voltage indicators
    voltageIndicators.forEach(indicator => {
        indicator.classList.toggle('show', switchOn && !circuitStates.series.removed);
    });
}

function toggleParallelCircuit() {
    const state = circuitStates.parallel;
    state.switch = !state.switch;
    
    updateParallelVisuals();
}

function removeParallelBulb() {
    const state = circuitStates.parallel;
    state.removed = !state.removed;
    
    if (state.removed) {
        state.bulb1 = false;
    } else {
        state.bulb1 = true;
    }
    
    updateParallelVisuals();
}

function resetParallelCircuit() {
    circuitStates.parallel = { switch: false, bulb1: true, bulb2: true, removed: false };
    updateParallelVisuals();
}

function updateParallelVisuals() {
    const state = circuitStates.parallel;
    const battery = document.getElementById('simParallelBattery');
    const switchEl = document.getElementById('simParallelSwitch');
    const bulb1El = document.getElementById('simParallelBulb1');
    const bulb2El = document.getElementById('simParallelBulb2');
    const wires = document.querySelectorAll('.circuit-svg .sim-wire');
    const currentDot1 = document.querySelector('.current-dot-1');
    const currentDot2 = document.querySelector('.current-dot-2');
    const voltageIndicators = document.querySelectorAll('.voltage-indicator');
    
    // Update battery
    if (battery) {
        battery.classList.toggle('active', state.switch);
    }
    
    // Update switch
    if (switchEl) {
        switchEl.classList.toggle('on', state.switch);
    }
    
    // Update bulb 1
    if (bulb1El) {
        bulb1El.classList.toggle('on', state.switch && state.bulb1 && !state.removed);
        bulb1El.classList.toggle('removed', state.removed);
    }
    
    // Update bulb 2
    if (bulb2El) {
        bulb2El.classList.toggle('on', state.switch && state.bulb2);
    }
    
    // Update wires
    wires.forEach(wire => {
        wire.classList.toggle('active', state.switch);
    });
    
    // Update current flow animations
    if (currentDot1) {
        const showCurrent1 = state.switch && !state.removed;
        currentDot1.classList.toggle('active', showCurrent1);
    }
    
    if (currentDot2) {
        const showCurrent2 = state.switch;
        currentDot2.classList.toggle('active', showCurrent2);
    }
    
    // Update voltage indicators
    voltageIndicators.forEach(indicator => {
        indicator.classList.toggle('show', state.switch);
    });
}

// Question Handling
function handleQuestionAnswer(event) {
    const questionName = event.target.name;
    const selectedOption = event.target.closest('.answer-option');
    const allOptions = document.querySelectorAll(`input[name="${questionName}"]`);
    const feedback = document.getElementById(`feedback${questionName.slice(-1)}`);
    
    // Reset all options
    allOptions.forEach(option => {
        const optionContainer = option.closest('.answer-option');
        optionContainer.classList.remove('correct', 'incorrect');
    });
    
    // Check if correct
    const isCorrect = selectedOption.dataset.correct === 'true';
    
    if (isCorrect) {
        selectedOption.classList.add('correct');
        feedback.textContent = '✅ ถูกต้อง! คำตอบนี้เป็นไปตามหลักการของวงจรไฟฟ้า';
        feedback.className = 'feedback correct show';
        quizScores.questions++;
    } else {
        selectedOption.classList.add('incorrect');
        feedback.textContent = '❌ ไม่ถูกต้อง กรุณาทบทวนเนื้อหาและลองใหม่อีกครั้ง';
        feedback.className = 'feedback incorrect show';
    }
    
    // Update total score
    quizScores.total++;
    
    // Check if all questions answered
    const totalQuestions = document.querySelectorAll('.question-item').length;
    if (quizScores.total >= totalQuestions) {
        setTimeout(() => {
            if (quizScores.questions === totalQuestions) {
                markObjectiveCompleted(1);
                showSuccessMessage('คุณตอบคำถามถูกทั้งหมด! เยี่ยมมาก! 🎉');
            }
        }, 1000);
    }
}

// Quiz Handling
function handleQuizAnswer(event) {
    const questionName = event.target.name;
    const selectedOption = event.target.closest('.quiz-option');
    const allOptions = document.querySelectorAll(`input[name="${questionName}"]`);
    const feedback = document.getElementById(`quizFeedback${questionName.slice(-1)}`);
    
    // Reset all options in this question
    allOptions.forEach(option => {
        const optionContainer = option.closest('.quiz-option');
        optionContainer.classList.remove('correct', 'incorrect');
    });
    
    // Check if correct
    const isCorrect = selectedOption.dataset.correct === 'true';
    
    if (isCorrect) {
        selectedOption.classList.add('correct');
        feedback.textContent = '✅ ถูกต้อง!';
        feedback.className = 'quiz-feedback correct show';
        
        // Update quiz score for this specific question
        const questionNumber = parseInt(questionName.slice(-1));
        updateQuizScore(questionNumber, true);
    } else {
        selectedOption.classList.add('incorrect');
        feedback.textContent = '❌ ไม่ถูกต้อง';
        feedback.className = 'quiz-feedback incorrect show';
        
        // Update quiz score for this specific question
        const questionNumber = parseInt(questionName.slice(-1));
        updateQuizScore(questionNumber, false);
    }
}

function updateQuizScore(questionNumber, isCorrect) {
    // Track individual quiz scores
    if (!window.quizAnswers) {
        window.quizAnswers = {};
    }
    
    window.quizAnswers[questionNumber] = isCorrect;
    
    // Calculate total score
    const correctAnswers = Object.values(window.quizAnswers).filter(answer => answer === true).length;
    const totalAnswered = Object.keys(window.quizAnswers).length;
    
    // Update score display
    const scoreDisplay = document.getElementById('scoreDisplay');
    if (scoreDisplay) {
        scoreDisplay.textContent = `${correctAnswers}/3`;
    }
    
    // Check if all quiz questions answered
    if (totalAnswered === 3) {
        if (correctAnswers === 3) {
            markObjectiveCompleted(4);
            setTimeout(() => {
                showSuccessMessage('คุณทำแบบทดสอบได้คะแนนเต็ม! เก่งมาก! 🏆');
            }, 1000);
        } else if (correctAnswers >= 2) {
            setTimeout(() => {
                showSuccessMessage(`คุณทำแบบทดสอบได้ ${correctAnswers}/3 คะแนน ผ่านเกณฑ์แล้ว! 👍`);
            }, 1000);
        }
    }
}

function resetQuiz() {
    // Reset all quiz answers
    window.quizAnswers = {};
    
    // Reset all radio buttons
    const quizRadios = document.querySelectorAll('.quiz-question input[type="radio"]');
    quizRadios.forEach(radio => {
        radio.checked = false;
    });
    
    // Reset all option styles
    const quizOptions = document.querySelectorAll('.quiz-option');
    quizOptions.forEach(option => {
        option.classList.remove('correct', 'incorrect');
    });
    
    // Hide all feedback
    const feedbacks = document.querySelectorAll('.quiz-feedback');
    feedbacks.forEach(feedback => {
        feedback.classList.remove('show');
    });
    
    // Reset score display
    const scoreDisplay = document.getElementById('scoreDisplay');
    if (scoreDisplay) {
        scoreDisplay.textContent = '0/3';
    }
}

// Drag and Drop Functions
function setupDragAndDrop() {
    console.log('Setting up drag and drop...');
    
    const components = document.querySelectorAll('.component');
    const dropZones = document.querySelectorAll('.build-drop-zone');
    
    console.log('Found components:', components.length);
    console.log('Found drop zones:', dropZones.length);
    
    // Setup draggable components
    components.forEach((component, index) => {
        console.log(`Setting up component ${index}:`, component.dataset.type);
        component.addEventListener('dragstart', handleDragStart);
        component.addEventListener('dragend', handleDragEnd);
    });
    
    // Setup SVG drop zones
    dropZones.forEach((zone, index) => {
        console.log(`Setting up drop zone ${index}:`, zone.dataset.accepts);
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('drop', handleDrop);
        zone.addEventListener('dragenter', handleDragEnter);
        zone.addEventListener('dragleave', handleDragLeave);
        zone.addEventListener('click', handleDropZoneClick);
    });
    
    console.log('Drag and drop setup complete');
}

function handleDragStart(e) {
    draggedElement = e.target;
    e.target.classList.add('dragging');
    e.dataTransfer.setData('text/plain', e.target.dataset.type);
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    draggedElement = null;
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDragEnter(e) {
    e.preventDefault();
    e.stopPropagation();
    
    let target = e.target;
    
    // Find the SVG group element with data-accepts attribute
    while (target && !target.dataset.accepts) {
        target = target.parentElement;
        // Stop if we reach the SVG or document
        if (!target || target.tagName === 'svg' || target === document) {
            return;
        }
    }
    
    if (target && target.dataset.accepts && draggedElement) {
        const componentType = draggedElement.dataset.type;
        const acceptedType = target.dataset.accepts;
        
        if (componentType === acceptedType && !target.classList.contains('filled')) {
            target.classList.add('drag-over');
            
            // Visual feedback on the rect element
            const rect = target.querySelector('rect');
            if (rect) {
                rect.setAttribute('stroke', '#667eea');
                rect.setAttribute('stroke-width', '4');
                rect.setAttribute('fill', '#e8f2ff');
            }
        }
    }
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    
    let target = e.target;
    
    // Find the SVG group element with data-accepts attribute
    while (target && !target.dataset.accepts) {
        target = target.parentElement;
        if (!target || target.tagName === 'svg' || target === document) {
            return;
        }
    }
    
    if (target && target.dataset.accepts) {
        target.classList.remove('drag-over');
        
        // Reset visual feedback if not filled
        if (!target.classList.contains('filled')) {
            const rect = target.querySelector('rect');
            if (rect) {
                rect.setAttribute('stroke', '#ccc');
                rect.setAttribute('stroke-width', '2');
                rect.setAttribute('fill', '#f0f4ff');
            }
        }
    }
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    
    let target = e.target;
    
    // Find the SVG group element with data-accepts attribute
    while (target && !target.dataset.accepts) {
        target = target.parentElement;
        if (!target || target.tagName === 'svg' || target === document) {
            return;
        }
    }
    
    if (target && target.dataset.accepts && draggedElement) {
        target.classList.remove('drag-over');
        
        const componentType = draggedElement.dataset.type;
        const acceptedType = target.dataset.accepts;
        
        console.log('Drop attempt:', { componentType, acceptedType, filled: target.classList.contains('filled') });
        
        if (componentType === acceptedType && !target.classList.contains('filled')) {
            fillDropZone(target, componentType);
        } else {
            // Reset visual feedback if drop was invalid
            const rect = target.querySelector('rect');
            if (rect && !target.classList.contains('filled')) {
                rect.setAttribute('stroke', '#ccc');
                rect.setAttribute('stroke-width', '2');
                rect.setAttribute('fill', '#f0f4ff');
            }
        }
    }
}

function handleDropZoneClick(e) {
    e.preventDefault();
    e.stopPropagation();
    
    let target = e.target;
    
    // Find the SVG group element with data-accepts attribute
    while (target && !target.dataset.accepts) {
        target = target.parentElement;
        if (!target || target.tagName === 'svg' || target === document) {
            return;
        }
    }
    
    if (target && target.dataset.accepts && target.classList.contains('filled')) {
        // Allow removing components by clicking
        clearDropZone(target);
    }
}

function fillDropZone(dropZone, componentType) {
    console.log('Filling drop zone:', { dropZone, componentType });
    
    // Mark as filled
    dropZone.classList.add('filled');
    
    // Update the visual in SVG
    const rect = dropZone.querySelector('rect');
    const texts = dropZone.querySelectorAll('text');
    
    if (rect) {
        rect.setAttribute('fill', '#f6ffed');
        rect.setAttribute('stroke', '#52c41a');
        rect.setAttribute('stroke-width', '3');
        rect.setAttribute('stroke-dasharray', 'none');
    }
    
    // Update all text elements
    texts.forEach(text => {
        text.setAttribute('fill', '#333');
        text.setAttribute('font-weight', '600');
    });
    
    // Add component icon based on type
    let iconText = '';
    switch(componentType) {
        case 'battery':
            iconText = '🔋';
            break;
        case 'switch':
            iconText = '🔘';
            break;
        case 'bulb':
            iconText = '💡';
            break;
        case 'wire':
            iconText = '━';
            break;
    }
    
    // Find or create the emoji text element
    let emojiElement = dropZone.querySelector('text[font-size="20"]');
    if (emojiElement) {
        emojiElement.textContent = iconText;
    }
    
    // Update circuit build state
    updateCircuitBuild(dropZone, componentType);
    
    // Show success feedback
    showDropSuccess(dropZone);
    
    console.log('Drop zone filled successfully');
}

function clearDropZone(dropZone) {
    console.log('Clearing drop zone:', dropZone);
    
    // Mark as not filled
    dropZone.classList.remove('filled');
    
    // Reset the visual in SVG
    const rect = dropZone.querySelector('rect');
    const texts = dropZone.querySelectorAll('text');
    
    if (rect) {
        rect.setAttribute('fill', '#f0f4ff');
        rect.setAttribute('stroke', '#ccc');
        rect.setAttribute('stroke-width', '2');
        rect.setAttribute('stroke-dasharray', '5,5');
    }
    
    // Reset all text elements
    texts.forEach(text => {
        text.setAttribute('fill', '#999');
        text.setAttribute('font-weight', 'normal');
    });
    
    // Reset emoji to original
    const componentType = dropZone.dataset.accepts;
    let originalIcon = '';
    switch(componentType) {
        case 'battery':
            originalIcon = '🔋';
            break;
        case 'switch':
            originalIcon = '🔘';
            break;
        case 'bulb':
            originalIcon = '💡';
            break;
        case 'wire':
            originalIcon = '━';
            break;
    }
    
    const emojiElement = dropZone.querySelector('text[font-size="20"]');
    if (emojiElement) {
        emojiElement.textContent = originalIcon;
    }
    
    // Update circuit build state
    updateCircuitBuild(dropZone, componentType, true); // true = remove
    
    console.log('Drop zone cleared successfully');
}

function updateCircuitBuild(dropZone, componentType, isRemoving = false) {
    const svg = dropZone.closest('svg');
    const circuitBuilder = svg.closest('.circuit-builder');
    const circuitType = circuitBuilder.querySelector('h3').textContent.includes('อนุกรม') ? 'series' : 'parallel';
    
    // Find which position this drop zone represents by its data-accepts attribute
    const acceptedType = dropZone.dataset.accepts;
    
    // Update build state
    const buildState = circuitBuilds[circuitType];
    
    if (acceptedType === 'battery') {
        buildState.battery = !isRemoving;
    } else if (acceptedType === 'switch') {
        buildState.switch = !isRemoving;
    } else if (acceptedType === 'bulb') {
        // For bulbs, check position in the SVG to determine bulb1 or bulb2
        const transform = dropZone.getAttribute('transform');
        if (transform.includes('240, 85') || transform.includes('340, 70')) {
            buildState.bulb1 = !isRemoving;
        } else {
            buildState.bulb2 = !isRemoving;
        }
    }
    
    // Check if circuit is complete
    checkCircuitCompletion(circuitType);
    
    // Update wire visuals
    updateBuildWires(circuitType);
}

function checkCircuitCompletion(circuitType) {
    const build = circuitBuilds[circuitType];
    const isComplete = build.battery && build.switch && build.bulb1 && build.bulb2;
    
    // Find the circuit builder container
    const circuitBuilders = document.querySelectorAll('.circuit-builder');
    let targetBuilder = null;
    
    circuitBuilders.forEach(builder => {
        const title = builder.querySelector('h3').textContent;
        if ((circuitType === 'series' && title.includes('อนุกรม')) ||
            (circuitType === 'parallel' && title.includes('ขนาน'))) {
            targetBuilder = builder;
        }
    });
    
    if (targetBuilder) {
        const testBtn = targetBuilder.querySelector('.test-btn');
        const successOverlay = targetBuilder.querySelector('.build-success-overlay');
        
        if (isComplete) {
            testBtn.disabled = false;
            testBtn.textContent = '✅ พร้อมทดสอบวงจร';
            if (successOverlay) {
                successOverlay.classList.add('show');
            }
        } else {
            testBtn.disabled = true;
            testBtn.textContent = 'ทดสอบวงจร';
            if (successOverlay) {
                successOverlay.classList.remove('show');
            }
        }
    }
}

function updateBuildWires(circuitType) {
    const build = circuitBuilds[circuitType];
    
    // Find the circuit builder container
    const circuitBuilders = document.querySelectorAll('.circuit-builder');
    let targetBuilder = null;
    
    circuitBuilders.forEach(builder => {
        const title = builder.querySelector('h3').textContent;
        if ((circuitType === 'series' && title.includes('อนุกรม')) ||
            (circuitType === 'parallel' && title.includes('ขนาน'))) {
            targetBuilder = builder;
        }
    });
    
    if (targetBuilder) {
        const wires = targetBuilder.querySelectorAll('.build-wire');
        const isComplete = build.battery && build.switch && build.bulb1 && build.bulb2;
        
        wires.forEach(wire => {
            wire.classList.toggle('active', isComplete);
        });
    }
}

function testCircuit(circuitType) {
    const resultDiv = document.getElementById(`${circuitType}Result`);
    const build = circuitBuilds[circuitType];
    
    if (build.battery && build.switch && build.bulb1 && build.bulb2) {
        resultDiv.className = 'circuit-result success show';
        resultDiv.innerHTML = `
            <h4>🎉 สำเร็จ!</h4>
            <p>คุณสร้างวงจรไฟฟ้าแบบ${circuitType === 'series' ? 'อนุกรม' : 'ขนาน'}ได้ถูกต้อง</p>
            <p><strong>ลักษณะ:</strong> ${circuitType === 'series' ? 
                'หลอดไฟต่อเรียงกันเป็นแถวเดียว กระแสไฟฟ้าไหลผ่านทางเดียว' : 
                'หลอดไฟแต่ละดวงมีเส้นทางแยกจากกัน กระแสไฟฟ้าแยกไหลผ่านหลายทาง'}</p>
        `;
        
        // Mark drag and drop objective as completed
        if (!progress.objectives[0]) {
            markObjectiveCompleted(1);
        }
        
        // If both circuits completed, mark objective 2
        if (circuitBuilds.series.battery && circuitBuilds.series.switch && 
            circuitBuilds.series.bulb1 && circuitBuilds.series.bulb2 &&
            circuitBuilds.parallel.battery && circuitBuilds.parallel.switch && 
            circuitBuilds.parallel.bulb1 && circuitBuilds.parallel.bulb2) {
            setTimeout(() => {
                markObjectiveCompleted(2);
            }, 1000);
        }
    } else {
        resultDiv.className = 'circuit-result error show';
        resultDiv.innerHTML = `
            <h4>❌ ไม่สมบูรณ์</h4>
            <p>กรุณาวางอุปกรณ์ให้ครบทุกตำแหน่งก่อนทดสอบวงจร</p>
        `;
    }
}

function showDropSuccess(dropZone) {
    // Create a temporary visual feedback
    const rect = dropZone.querySelector('rect');
    if (rect) {
        // Store original transform
        const originalTransform = dropZone.getAttribute('transform') || '';
        
        // Add scale animation via transform
        const match = originalTransform.match(/translate\(([^)]+)\)/);
        if (match) {
            const coords = match[1];
            dropZone.setAttribute('transform', `translate(${coords}) scale(1.1)`);
            
            setTimeout(() => {
                dropZone.setAttribute('transform', originalTransform);
            }, 300);
        }
    }
    
    // Show success message
    showSuccessMessage('วางชิ้นส่วนสำเร็จ! 🎉');
}

// Utility Functions
function showSuccessMessage(message) {
    // Create temporary success message
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #52c41a;
        color: white;
        padding: 1rem 2rem;
        border-radius: 25px;
        z-index: 1000;
        font-family: 'Kanit', sans-serif;
        font-weight: 500;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        animation: slideInRight 0.5s ease-out;
    `;
    successDiv.textContent = message;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.style.animation = 'slideOutRight 0.5s ease-in';
        setTimeout(() => {
            document.body.removeChild(successDiv);
        }, 500);
    }, 3000);
}

function showCompletionModal() {
    const modal = document.getElementById('progressModal');
    const achievedSpan = document.getElementById('achievedObjective');
    
    if (modal && achievedSpan) {
        achievedSpan.textContent = 'ทั้งหมด';
        modal.querySelector('h3').textContent = '🎊 ยอดเยี่ยม!';
        modal.querySelector('p').textContent = 'คุณได้เรียนรู้และทำกิจกรรมครบทุกจุดประสงค์แล้ว พร้อมไปต่อที่บทเรียนถัดไป!';
        modal.classList.add('show');
    }
}

function closeModal() {
    const modal = document.getElementById('progressModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function resetAllCircuits() {
    resetSeriesCircuit();
    resetParallelCircuit();
    
    // Reset demo circuits
    circuitStates.demo1 = { switch: false, bulb1: false, bulb2: false, removed: false };
    circuitStates.demo2 = { switch: false, bulb1: false, bulb2: false, removed: false };
    
    // Update demo visuals
    updateDemoVisuals(1);
    updateDemoVisuals(2);
}

// Add CSS animations for success messages
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(styleSheet);

// Performance monitoring
const perfObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
            console.log('Lesson page load time:', entry.loadEventEnd - entry.loadEventStart, 'ms');
        }
    }
});

if ('PerformanceObserver' in window) {
    perfObserver.observe({ entryTypes: ['navigation'] });
}

// Auto-save progress to localStorage
function saveProgress() {
    localStorage.setItem('lesson1Progress', JSON.stringify(progress));
    localStorage.setItem('lesson1QuizScores', JSON.stringify(quizScores));
}

function loadProgress() {
    const savedProgress = localStorage.getItem('lesson1Progress');
    const savedQuizScores = localStorage.getItem('lesson1QuizScores');
    
    if (savedProgress) {
        progress = { ...progress, ...JSON.parse(savedProgress) };
    }
    
    if (savedQuizScores) {
        quizScores = { ...quizScores, ...JSON.parse(savedQuizScores) };
    }
    
    updateProgress();
}

// Save progress periodically
setInterval(saveProgress, 30000); // Save every 30 seconds

// Load progress on page load
window.addEventListener('load', loadProgress);

// Save progress before page unload
window.addEventListener('beforeunload', saveProgress);

console.log('🔌 Interactive Electric Circuit Learning System Ready!');
console.log('⚡ Features: Circuit Simulation, Drag & Drop, Quiz System, Progress Tracking');