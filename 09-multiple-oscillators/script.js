// ============================================
// Multiple Oscillators - Harmony & Chords
// ============================================

// UI Elements
const startAudioBtn = document.getElementById('startAudioBtn');
const statusMessage = document.getElementById('statusMessage');
const controlsSection = document.getElementById('controlsSection');
const playBtn = document.getElementById('playBtn');
const stopBtn = document.getElementById('stopBtn');
const rootNoteSlider = document.getElementById('rootNoteSlider');
const rootNoteValue = document.getElementById('rootNoteValue');
const chordTypeSelect = document.getElementById('chordTypeSelect');
const osc1VolumeSlider = document.getElementById('osc1VolumeSlider');
const osc1VolumeValue = document.getElementById('osc1VolumeValue');
const osc2VolumeSlider = document.getElementById('osc2VolumeSlider');
const osc2VolumeValue = document.getElementById('osc2VolumeValue');
const osc3VolumeSlider = document.getElementById('osc3VolumeSlider');
const osc3VolumeValue = document.getElementById('osc3VolumeValue');
const detuneSlider = document.getElementById('detuneSlider');
const detuneValue = document.getElementById('detuneValue');
const waveformSelect = document.getElementById('waveformSelect');

// Audio components
let oscillators = [];
let gains = [];
let masterGain = null;
let isPlaying = false;

// Note names for display
const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Chord intervals (semitones from root)
const chordTypes = {
    major: [0, 4, 7],           // Major triad
    minor: [0, 3, 7],           // Minor triad
    diminished: [0, 3, 6],      // Diminished triad
    augmented: [0, 4, 8],       // Augmented triad
    sus2: [0, 2, 7],            // Suspended 2nd
    sus4: [0, 5, 7],            // Suspended 4th
    major7: [0, 4, 7, 11],      // Major 7th
    minor7: [0, 3, 7, 10],      // Minor 7th
    power: [0, 7, 12]           // Power chord (root, 5th, octave)
};

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
        
        // Create audio components
        createAudioComponents();
        
    } catch (error) {
        console.error('Error starting audio:', error);
        statusMessage.className = 'status status-error';
        statusMessage.textContent = '❌ Error starting audio. Please try again.';
    }
});

// ============================================
// Create Audio Components
// ============================================

function createAudioComponents() {
    // Create master gain
    masterGain = new Tone.Gain(0.3).toDestination();
    
    // Create 3 oscillators with individual gains
    for (let i = 0; i < 3; i++) {
        const gain = new Tone.Gain(0.33).connect(masterGain);
        gains.push(gain);
        
        const osc = new Tone.Oscillator({
            type: 'sawtooth',
            volume: -Infinity  // Start silent
        }).connect(gain);
        
        oscillators.push(osc);
        osc.start();  // Start oscillators (they're silent until we set frequencies)
    }
    
    console.log('🎹 Created 3 oscillators for harmony');
    updateChord();
}

// ============================================
// Play/Stop Controls
// ============================================

playBtn.addEventListener('click', () => {
    if (isPlaying) {
        stopChord();
    } else {
        playChord();
    }
});

stopBtn.addEventListener('click', () => {
    stopChord();
});

function playChord() {
    oscillators.forEach(osc => {
        osc.volume.rampTo(-10, 0.05);
    });
    
    isPlaying = true;
    playBtn.textContent = '⏸️ Pause';
    stopBtn.disabled = false;
    console.log('▶️ Playing chord');
}

function stopChord() {
    oscillators.forEach(osc => {
        osc.volume.rampTo(-Infinity, 0.05);
    });
    
    isPlaying = false;
    playBtn.textContent = '▶️ Play Chord';
    stopBtn.disabled = true;
    console.log('⏹️ Stopped chord');
}

// ============================================
// Update Chord
// ============================================

function updateChord() {
    if (oscillators.length === 0) return;
    
    const rootMidi = parseInt(rootNoteSlider.value);
    const chordType = chordTypeSelect.value;
    const intervals = chordTypes[chordType];
    const detune = parseFloat(detuneSlider.value);
    
    // Update display
    const noteName = noteNames[rootMidi % 12];
    const octave = Math.floor(rootMidi / 12) - 1;
    rootNoteValue.textContent = `${noteName}${octave}`;
    
    // Set frequencies for each oscillator based on intervals
    intervals.forEach((interval, index) => {
        if (index < oscillators.length) {
            const midiNote = rootMidi + interval;
            const freq = Tone.Frequency(midiNote, 'midi').toFrequency();
            
            // Apply slight detune for richness
            const detuneAmount = (index - 1) * detune;  // -detune, 0, +detune
            oscillators[index].frequency.value = freq;
            oscillators[index].detune.value = detuneAmount;
        }
    });
    
    // Mute unused oscillators if chord has fewer than 3 notes
    for (let i = intervals.length; i < oscillators.length; i++) {
        oscillators[i].volume.value = -Infinity;
    }
    
    console.log(`🎵 Chord: ${noteName}${octave} ${chordType}`);
}

// ============================================
// Root Note Control
// ============================================

rootNoteSlider.addEventListener('input', () => {
    updateChord();
});

// ============================================
// Chord Type Control
// ============================================

chordTypeSelect.addEventListener('change', () => {
    updateChord();
});

// ============================================
// Individual Oscillator Volumes
// ============================================

osc1VolumeSlider.addEventListener('input', (e) => {
    const value = parseInt(e.target.value);
    osc1VolumeValue.textContent = value + '%';
    if (gains[0]) {
        gains[0].gain.value = value / 100;
    }
});

osc2VolumeSlider.addEventListener('input', (e) => {
    const value = parseInt(e.target.value);
    osc2VolumeValue.textContent = value + '%';
    if (gains[1]) {
        gains[1].gain.value = value / 100;
    }
});

osc3VolumeSlider.addEventListener('input', (e) => {
    const value = parseInt(e.target.value);
    osc3VolumeValue.textContent = value + '%';
    if (gains[2]) {
        gains[2].gain.value = value / 100;
    }
});

// ============================================
// Detune Control
// ============================================

detuneSlider.addEventListener('input', (e) => {
    const value = parseFloat(e.target.value);
    detuneValue.textContent = value + ' cents';
    updateChord();
});

// ============================================
// Waveform Control
// ============================================

waveformSelect.addEventListener('change', (e) => {
    const waveform = e.target.value;
    oscillators.forEach(osc => {
        osc.type = waveform;
    });
    console.log('🎵 Waveform:', waveform);
});

// ============================================
// Cleanup
// ============================================

window.addEventListener('beforeunload', () => {
    oscillators.forEach(osc => osc.stop());
});