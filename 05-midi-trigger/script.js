// ============================================
// MIDI-Triggered ADSR Envelope Example
// ============================================

// UI Elements
const startAudioBtn = document.getElementById('startAudioBtn');
const statusMessage = document.getElementById('statusMessage');
const controlsSection = document.getElementById('controlsSection');
const midiSection = document.getElementById('midiSection');
const keyboardSection = document.getElementById('keyboardSection');
const midiDeviceSelect = document.getElementById('midiDeviceSelect');
const midiStatus = document.getElementById('midiStatus');
const noteDisplay = document.getElementById('noteDisplay');
const attackSlider = document.getElementById('attackSlider');
const attackValue = document.getElementById('attackValue');
const decaySlider = document.getElementById('decaySlider');
const decayValue = document.getElementById('decayValue');
const sustainSlider = document.getElementById('sustainSlider');
const sustainValue = document.getElementById('sustainValue');
const releaseSlider = document.getElementById('releaseSlider');
const releaseValue = document.getElementById('releaseValue');

// Audio components
let synth = null;
let midiAccess = null;
let activeNotes = new Map(); // Track which notes are currently playing

// ADSR values
let attack = 0.01;
let decay = 0.2;
let sustain = 0.5;
let release = 0.3;

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
        keyboardSection.style.display = 'block';
        
        // Create synth
        createSynth();
        
        // Try to initialize MIDI
        initMIDI();
        
    } catch (error) {
        console.error('Error starting audio:', error);
        statusMessage.className = 'status status-error';
        statusMessage.textContent = '❌ Error starting audio. Please try again.';
    }
});

// ============================================
// Create Polyphonic Synth
// ============================================

function createSynth() {
    // Use PolySynth for polyphonic playback (multiple notes at once)
    synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: {
            type: 'sawtooth'
        },
        envelope: {
            attack: attack,
            decay: decay,
            sustain: sustain,
            release: release
        }
    }).toDestination();
    
    synth.volume.value = -10; // Reduce volume slightly
    
    console.log('🎹 Polyphonic synth created');
}

// ============================================
// MIDI Initialization
// ============================================

async function initMIDI() {
    try {
        // Request MIDI access
        midiAccess = await navigator.requestMIDIAccess();
        console.log('✅ MIDI Access granted');
        
        // Get MIDI inputs
        const inputs = Array.from(midiAccess.inputs.values());
        
        if (inputs.length === 0) {
            midiStatus.className = 'status status-warning';
            midiStatus.innerHTML = '<strong>⚠️ No MIDI devices found.</strong><br>Use the keyboard fallback below (keys A-L).';
            return;
        }
        
        // Populate device selector
        midiDeviceSelect.innerHTML = '<option value="">Select MIDI Device...</option>';
        inputs.forEach((input, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = input.name || `MIDI Device ${index + 1}`;
            midiDeviceSelect.appendChild(option);
        });
        
        midiSection.style.display = 'block';
        midiStatus.className = 'status status-success';
        midiStatus.innerHTML = `<strong>✅ Found ${inputs.length} MIDI device(s)!</strong><br>Select one from the dropdown above.`;
        
    } catch (error) {
        console.error('MIDI Error:', error);
        midiStatus.className = 'status status-warning';
        midiStatus.innerHTML = '<strong>⚠️ MIDI not available in this browser.</strong><br>Use the keyboard fallback below (keys A-L).';
    }
}

// ============================================
// MIDI Device Selection
// ============================================

midiDeviceSelect.addEventListener('change', (e) => {
    const deviceIndex = parseInt(e.target.value);
    
    if (isNaN(deviceIndex)) return;
    
    // Disconnect all previous listeners
    const inputs = Array.from(midiAccess.inputs.values());
    inputs.forEach(input => input.onmidimessage = null);
    
    // Connect to selected device
    const selectedInput = inputs[deviceIndex];
    selectedInput.onmidimessage = handleMIDIMessage;
    
    midiStatus.className = 'status status-success';
    midiStatus.innerHTML = `<strong>✅ Connected to: ${selectedInput.name}</strong><br>Play your MIDI keyboard!`;
    
    console.log('🎹 Connected to MIDI device:', selectedInput.name);
});

// ============================================
// Handle MIDI Messages
// ============================================

function handleMIDIMessage(message) {
    const [status, note, velocity] = message.data;
    
    // MIDI message types
    const messageType = status & 0xF0;
    const NOTE_ON = 0x90;
    const NOTE_OFF = 0x80;
    
    if (messageType === NOTE_ON && velocity > 0) {
        // Note On
        playNote(note, velocity);
    } else if (messageType === NOTE_OFF || (messageType === NOTE_ON && velocity === 0)) {
        // Note Off
        stopNote(note);
    }
}

// ============================================
// Play/Stop Notes
// ============================================

function playNote(midiNote, velocity = 127) {
    if (!synth) return;
    
    // Convert MIDI note number to frequency
    const frequency = Tone.Frequency(midiNote, 'midi').toFrequency();
    
    // Convert MIDI velocity (0-127) to gain (0-1)
    const gain = velocity / 127;
    
    // Trigger the note
    synth.triggerAttack(frequency, undefined, gain);
    
    // Track active note
    activeNotes.set(midiNote, frequency);
    
    // Update display
    updateNoteDisplay();
    
    console.log(`🎵 Note ON: ${midiNote} (${Tone.Frequency(midiNote, 'midi').toNote()}) @ velocity ${velocity}`);
}

function stopNote(midiNote) {
    if (!synth) return;
    
    const frequency = activeNotes.get(midiNote);
    if (!frequency) return;
    
    // Release the note
    synth.triggerRelease(frequency);
    
    // Remove from active notes
    activeNotes.delete(midiNote);
    
    // Update display
    updateNoteDisplay();
    
    console.log(`🎵 Note OFF: ${midiNote} (${Tone.Frequency(midiNote, 'midi').toNote()})`);
}

// ============================================
// Update Note Display
// ============================================

function updateNoteDisplay() {
    if (activeNotes.size === 0) {
        noteDisplay.textContent = 'No notes playing';
        noteDisplay.style.color = '#999';
    } else {
        const notes = Array.from(activeNotes.keys())
            .map(note => Tone.Frequency(note, 'midi').toNote())
            .join(', ');
        noteDisplay.textContent = `Playing: ${notes}`;
        noteDisplay.style.color = '#667eea';
        noteDisplay.style.fontWeight = 'bold';
    }
}

// ============================================
// Keyboard Fallback (Computer Keyboard)
// ============================================

// Map computer keys to MIDI notes (C3 to C5)
const keyboardMap = {
    'KeyA': 60,  // C4
    'KeyW': 61,  // C#4
    'KeyS': 62,  // D4
    'KeyE': 63,  // D#4
    'KeyD': 64,  // E4
    'KeyF': 65,  // F4
    'KeyT': 66,  // F#4
    'KeyG': 67,  // G4
    'KeyY': 68,  // G#4
    'KeyH': 69,  // A4
    'KeyU': 70,  // A#4
    'KeyJ': 71,  // B4
    'KeyK': 72,  // C5
    'KeyO': 73,  // C#5
    'KeyL': 74   // D5
};

const pressedKeys = new Set();

document.addEventListener('keydown', (e) => {
    if (e.repeat || !synth) return;
    
    const midiNote = keyboardMap[e.code];
    if (midiNote && !pressedKeys.has(e.code)) {
        pressedKeys.add(e.code);
        playNote(midiNote, 100);
        
        // Visual feedback on button
        const button = document.querySelector(`[data-note="${midiNote}"]`);
        if (button) button.classList.add('active');
    }
});

document.addEventListener('keyup', (e) => {
    const midiNote = keyboardMap[e.code];
    if (midiNote && pressedKeys.has(e.code)) {
        pressedKeys.delete(e.code);
        stopNote(midiNote);
        
        // Remove visual feedback
        const button = document.querySelector(`[data-note="${midiNote}"]`);
        if (button) button.classList.remove('active');
    }
});

// ============================================
// Virtual Keyboard Buttons
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const keyboardContainer = document.getElementById('virtualKeyboard');
    if (!keyboardContainer) return;
    
    // Create virtual keyboard buttons
    const keys = [
        { note: 60, label: 'C4', key: 'A', white: true },
        { note: 61, label: 'C#', key: 'W', white: false },
        { note: 62, label: 'D4', key: 'S', white: true },
        { note: 63, label: 'D#', key: 'E', white: false },
        { note: 64, label: 'E4', key: 'D', white: true },
        { note: 65, label: 'F4', key: 'F', white: true },
        { note: 66, label: 'F#', key: 'T', white: false },
        { note: 67, label: 'G4', key: 'G', white: true },
        { note: 68, label: 'G#', key: 'Y', white: false },
        { note: 69, label: 'A4', key: 'H', white: true },
        { note: 70, label: 'A#', key: 'U', white: false },
        { note: 71, label: 'B4', key: 'J', white: true },
        { note: 72, label: 'C5', key: 'K', white: true }
    ];
    
    keys.forEach(key => {
        const button = document.createElement('button');
        button.className = `piano-key ${key.white ? 'white-key' : 'black-key'}`;
        button.setAttribute('data-note', key.note);
        button.innerHTML = `${key.label}<br><small>${key.key}</small>`;
        
        // Mouse events
        button.addEventListener('mousedown', () => playNote(key.note, 100));
        button.addEventListener('mouseup', () => stopNote(key.note));
        button.addEventListener('mouseleave', () => stopNote(key.note));
        
        // Touch events
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            playNote(key.note, 100);
        });
        button.addEventListener('touchend', (e) => {
            e.preventDefault();
            stopNote(key.note);
        });
        
        keyboardContainer.appendChild(button);
    });
});

// ============================================
// ADSR Controls
// ============================================

attackSlider.addEventListener('input', (e) => {
    attack = parseFloat(e.target.value);
    attackValue.textContent = attack.toFixed(2) + 's';
    if (synth) synth.set({ envelope: { attack } });
});

decaySlider.addEventListener('input', (e) => {
    decay = parseFloat(e.target.value);
    decayValue.textContent = decay.toFixed(2) + 's';
    if (synth) synth.set({ envelope: { decay } });
});

sustainSlider.addEventListener('input', (e) => {
    sustain = parseFloat(e.target.value);
    sustainValue.textContent = Math.round(sustain * 100) + '%';
    if (synth) synth.set({ envelope: { sustain } });
});

releaseSlider.addEventListener('input', (e) => {
    release = parseFloat(e.target.value);
    releaseValue.textContent = release.toFixed(2) + 's';
    if (synth) synth.set({ envelope: { release } });
});