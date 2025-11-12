// ============================================
// Oscillator + Filter + Gain Example
// ============================================

// UI Elements
const startAudioBtn = document.getElementById('startAudioBtn');
const statusMessage = document.getElementById('statusMessage');
const controlsSection = document.getElementById('controlsSection');
const filterSection = document.getElementById('filterSection');
const gainSection = document.getElementById('gainSection');
const playBtn = document.getElementById('playBtn');
const stopBtn = document.getElementById('stopBtn');
const frequencySlider = document.getElementById('frequencySlider');
const frequencyValue = document.getElementById('frequencyValue');
const waveformSelect = document.getElementById('waveformSelect');
const filterToggle = document.getElementById('filterToggle');
const filterCutoffSlider = document.getElementById('filterCutoffSlider');
const filterCutoffValue = document.getElementById('filterCutoffValue');
const filterResonanceSlider = document.getElementById('filterResonanceSlider');
const filterResonanceValue = document.getElementById('filterResonanceValue');
const filterTypeSelect = document.getElementById('filterTypeSelect');
const volumeSlider = document.getElementById('volumeSlider');
const volumeValue = document.getElementById('volumeValue');

// Audio nodes
let oscillator = null;
let filter = null;
let gainNode = null;
let isPlaying = false;
let filterEnabled = true;

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
        filterSection.style.display = 'block';
        gainSection.style.display = 'block';
        
        // Create audio chain
        createAudioChain();
        
    } catch (error) {
        console.error('Error starting audio:', error);
        statusMessage.className = 'status status-error';
        statusMessage.textContent = '❌ Error starting audio. Please try again.';
    }
});

// ============================================
// Create Audio Signal Chain
// ============================================

function createAudioChain() {
    // Create the Gain node
    gainNode = new Tone.Gain(0.3).toDestination();
    
    // Create the Filter node
    filter = new Tone.Filter({
        frequency: 1000,      // Cutoff frequency in Hz
        type: 'lowpass',      // Filter type
        Q: 1                  // Resonance (Quality factor)
    }).connect(gainNode);
    
    // Create the Oscillator
    oscillator = new Tone.Oscillator({
        frequency: 440,
        type: 'sawtooth'      // Sawtooth has harmonics to filter
    }).connect(filter);
    
    // Signal flow: Oscillator → Filter → Gain → Destination
    
    console.log('🎵 Audio chain created: Oscillator → Filter → Gain → Destination');
}

// ============================================
// Play/Stop Controls
// ============================================

playBtn.addEventListener('click', () => {
    if (!oscillator) return;
    
    oscillator.start();
    isPlaying = true;
    
    playBtn.disabled = true;
    stopBtn.disabled = false;
    console.log('▶️ Oscillator started');
});

stopBtn.addEventListener('click', () => {
    if (!oscillator) return;
    
    oscillator.stop();
    isPlaying = false;
    
    playBtn.disabled = false;
    stopBtn.disabled = true;
    
    // Recreate audio chain
    createAudioChain();
    oscillator.frequency.value = frequencySlider.value;
    oscillator.type = waveformSelect.value;
    filter.frequency.value = filterCutoffSlider.value;
    filter.Q.value = filterResonanceSlider.value;
    filter.type = filterTypeSelect.value;
    
    console.log('⏹️ Oscillator stopped');
});

// ============================================
// Oscillator Controls
// ============================================

frequencySlider.addEventListener('input', (e) => {
    const freq = parseFloat(e.target.value);
    frequencyValue.textContent = freq + ' Hz';
    
    if (oscillator) {
        oscillator.frequency.rampTo(freq, 0.1);
    }
});

waveformSelect.addEventListener('change', (e) => {
    if (oscillator) {
        oscillator.type = e.target.value;
        console.log('🎵 Waveform:', e.target.value);
    }
});

// ============================================
// Filter Controls
// ============================================

// Filter bypass toggle
filterToggle.addEventListener('change', (e) => {
    filterEnabled = e.target.checked;
    
    if (!oscillator || !filter || !gainNode) return;
    
    // Disconnect and reconnect appropriately
    oscillator.disconnect();
    
    if (filterEnabled) {
        // Route through filter
        oscillator.connect(filter);
        console.log('🎛️ Filter enabled');
    } else {
        // Bypass filter, connect directly to gain
        oscillator.connect(gainNode);
        console.log('🎛️ Filter bypassed');
    }
});

// Filter cutoff frequency
filterCutoffSlider.addEventListener('input', (e) => {
    const cutoff = parseFloat(e.target.value);
    filterCutoffValue.textContent = cutoff + ' Hz';
    
    if (filter) {
        filter.frequency.rampTo(cutoff, 0.1);
        console.log('🎛️ Filter cutoff:', cutoff, 'Hz');
    }
});

// Filter resonance (Q factor)
filterResonanceSlider.addEventListener('input', (e) => {
    const resonance = parseFloat(e.target.value);
    filterResonanceValue.textContent = resonance.toFixed(1);
    
    if (filter) {
        filter.Q.rampTo(resonance, 0.1);
        console.log('🎛️ Filter resonance:', resonance);
    }
});

// Filter type
filterTypeSelect.addEventListener('change', (e) => {
    if (filter) {
        filter.type = e.target.value;
        console.log('🎛️ Filter type:', e.target.value);
    }
});

// ============================================
// Gain Control
// ============================================

volumeSlider.addEventListener('input', (e) => {
    const percentage = parseInt(e.target.value);
    volumeValue.textContent = percentage + '%';
    
    if (gainNode) {
        const gainLinear = percentage / 100;
        gainNode.gain.rampTo(gainLinear, 0.05);
    }
});

// ============================================
// Cleanup
// ============================================

window.addEventListener('beforeunload', () => {
    if (oscillator && isPlaying) {
        oscillator.stop();
    }
});