// ============================================
// Simple 4-Step Sequencer Example
// ============================================

// UI Elements
const startAudioBtn = document.getElementById('startAudioBtn');
const statusMessage = document.getElementById('statusMessage');
const controlsSection = document.getElementById('controlsSection');
const playBtn = document.getElementById('playBtn');
const stopBtn = document.getElementById('stopBtn');
const bpmSlider = document.getElementById('bpmSlider');
const bpmValue = document.getElementById('bpmValue');

// Step controls
const stepButtons = [];
const noteSelects = [];
for (let i = 0; i < 4; i++) {
    stepButtons.push(document.getElementById(`step${i}Btn`));
    noteSelects.push(document.getElementById(`step${i}Note`));
}

// Audio components
let synth = null;
let sequence = null;
let isPlaying = false;
let currentStep = 0;

// Step data
const steps = [
    { active: true, note: 'C4' },
    { active: true, note: 'E4' },
    { active: true, note: 'G4' },
    { active: true, note: 'C5' }
];

// ============================================
// Start Audio Context
// ============================================

startAudioBtn.addEventListener('click', async () => {
    try {
        await Tone.start();
        console.log('✅ Audio context started');
        
        // Update UI
        startAudioBtn.disabled = true;
        startAudioBtn.textContent = '✅ Audio Engine Ready';
        statusMessage.className = 'status status-success';
        statusMessage.textContent = '✅ Audio engine is ready!';
        controlsSection.style.display = 'block';
        
        // Create synth and sequencer
        createSynth();
        createSequence();
        
    } catch (error) {
        console.error('Error starting audio:', error);
        statusMessage.className = 'status status-error';
        statusMessage.textContent = '❌ Error starting audio. Please try again.';
    }
});

// ============================================
// Create Synth
// ============================================

function createSynth() {
    synth = new Tone.Synth({
        oscillator: {
            type: 'square'
        },
        envelope: {
            attack: 0.005,
            decay: 0.1,
            sustain: 0.3,
            release: 0.1
        }
    }).toDestination();
    
    synth.volume.value = -10;
    
    console.log('🎹 Synth created');
}

// ============================================
// Create Sequence
// ============================================

function createSequence() {
    // Create a sequence that repeats every 4 steps
    sequence = new Tone.Sequence(
        (time, step) => {
            // Check if this step is active
            if (steps[step].active) {
                // Play the note for this step
                synth.triggerAttackRelease(steps[step].note, '8n', time);
            }
            
            // Visual feedback (scheduled to match audio)
            Tone.Draw.schedule(() => {
                updateStepDisplay(step);
            }, time);
        },
        [0, 1, 2, 3],  // Step indices
        '4n'  // Time between steps (quarter note)
    );
    
    console.log('🎼 Sequence created');
}

// ============================================
// Play/Stop Controls
// ============================================

playBtn.addEventListener('click', () => {
    if (!sequence) return;
    
    if (isPlaying) {
        // Pause
        Tone.Transport.pause();
        isPlaying = false;
        playBtn.textContent = '▶️ Play';
        console.log('⏸️ Paused');
    } else {
        // Play
        Tone.Transport.start();
        sequence.start(0);
        isPlaying = true;
        playBtn.textContent = '⏸️ Pause';
        stopBtn.disabled = false;
        console.log('▶️ Playing sequence');
    }
});

stopBtn.addEventListener('click', () => {
    if (!sequence) return;
    
    Tone.Transport.stop();
    sequence.stop();
    isPlaying = false;
    currentStep = -1;
    
    playBtn.textContent = '▶️ Play';
    stopBtn.disabled = true;
    
    // Clear step display
    stepButtons.forEach(btn => btn.classList.remove('playing'));
    
    console.log('⏹️ Stopped');
});

// ============================================
// BPM Control
// ============================================

bpmSlider.addEventListener('input', (e) => {
    const bpm = parseInt(e.target.value);
    bpmValue.textContent = bpm + ' BPM';
    Tone.Transport.bpm.value = bpm;
    console.log('🎵 BPM:', bpm);
});

// Set initial BPM
Tone.Transport.bpm.value = 120;

// ============================================
// Step Controls
// ============================================

// Toggle step on/off
stepButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        steps[index].active = !steps[index].active;
        
        if (steps[index].active) {
            btn.classList.add('active');
            btn.innerHTML = `Step ${index + 1}<br><small>ON</small>`;
        } else {
            btn.classList.remove('active');
            btn.innerHTML = `Step ${index + 1}<br><small>OFF</small>`;
        }
        
        console.log(`Step ${index + 1}:`, steps[index].active ? 'ON' : 'OFF');
    });
    
    // Initialize as active
    btn.classList.add('active');
});

// Change note for each step
noteSelects.forEach((select, index) => {
    select.addEventListener('change', (e) => {
        steps[index].note = e.target.value;
        console.log(`Step ${index + 1} note:`, steps[index].note);
    });
});

// ============================================
// Visual Step Display
// ============================================

function updateStepDisplay(step) {
    // Remove playing class from all steps
    stepButtons.forEach(btn => btn.classList.remove('playing'));
    
    // Add playing class to current step
    if (steps[step].active) {
        stepButtons[step].classList.add('playing');
    }
    
    currentStep = step;
}

// ============================================
// Cleanup
// ============================================

window.addEventListener('beforeunload', () => {
    if (sequence) {
        sequence.stop();
        sequence.dispose();
    }
    if (synth) {
        synth.dispose();
    }
    Tone.Transport.stop();
});