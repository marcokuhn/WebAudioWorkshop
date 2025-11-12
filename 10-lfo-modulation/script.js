// ============================================
// LFO Modulation Example
// ============================================

// UI Elements
const startAudioBtn = document.getElementById('startAudioBtn');
const statusMessage = document.getElementById('statusMessage');
const controlsSection = document.getElementById('controlsSection');
const playBtn = document.getElementById('playBtn');
const stopBtn = document.getElementById('stopBtn');
const carrierFreqSlider = document.getElementById('carrierFreqSlider');
const carrierFreqValue = document.getElementById('carrierFreqValue');
const lfoRateSlider = document.getElementById('lfoRateSlider');
const lfoRateValue = document.getElementById('lfoRateValue');
const lfoDepthSlider = document.getElementById('lfoDepthSlider');
const lfoDepthValue = document.getElementById('lfoDepthValue');
const lfoWaveformSelect = document.getElementById('lfoWaveformSelect');
const filterCutoffSlider = document.getElementById('filterCutoffSlider');
const filterCutoffValue = document.getElementById('filterCutoffValue');
const modulationTargetSelect = document.getElementById('modulationTargetSelect');

// Audio components
let carrier = null;
let lfo = null;
let filter = null;
let gainNode = null;
let isPlaying = false;

// Modulation state
let modulationTarget = 'filter';

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
    // Create gain node
    gainNode = new Tone.Gain(0.3).toDestination();
    
    // Create filter
    filter = new Tone.Filter({
        frequency: 1000,
        type: 'lowpass',
        Q: 5
    }).connect(gainNode);
    
    // Create carrier oscillator
    carrier = new Tone.Oscillator({
        frequency: 220,
        type: 'sawtooth',
        volume: -Infinity
    }).connect(filter);
    
    carrier.start();
    
    // Create LFO (Low Frequency Oscillator)
    lfo = new Tone.LFO({
        frequency: 2,
        min: 200,
        max: 2000,
        type: 'sine'
    });
    
    // Connect LFO to filter frequency
    lfo.connect(filter.frequency);
    lfo.start();
    
    console.log('🎛️ Created carrier oscillator + LFO + filter');
}

// ============================================
// Play/Stop Controls
// ============================================

playBtn.addEventListener('click', () => {
    if (isPlaying) {
        stopSound();
    } else {
        playSound();
    }
});

stopBtn.addEventListener('click', () => {
    stopSound();
});

function playSound() {
    if (carrier) {
        carrier.volume.rampTo(-10, 0.05);
    }
    
    isPlaying = true;
    playBtn.textContent = '⏸️ Pause';
    stopBtn.disabled = false;
    console.log('▶️ Playing with LFO modulation');
}

function stopSound() {
    if (carrier) {
        carrier.volume.rampTo(-Infinity, 0.05);
    }
    
    isPlaying = false;
    playBtn.textContent = '▶️ Play Sound';
    stopBtn.disabled = true;
    console.log('⏹️ Stopped');
}

// ============================================
// Carrier Frequency Control
// ============================================

carrierFreqSlider.addEventListener('input', (e) => {
    const freq = parseFloat(e.target.value);
    carrierFreqValue.textContent = freq + ' Hz';
    
    if (carrier && modulationTarget !== 'pitch') {
        // Only directly control frequency when NOT in pitch modulation mode
        carrier.frequency.rampTo(freq, 0.1);
    } else if (modulationTarget === 'pitch') {
        // In pitch mode, update the LFO range
        updateLFORange();
    }
});

// ============================================
// LFO Rate Control
// ============================================

lfoRateSlider.addEventListener('input', (e) => {
    const rate = parseFloat(e.target.value);
    lfoRateValue.textContent = rate.toFixed(2) + ' Hz';
    
    if (lfo) {
        lfo.frequency.value = rate;
    }
});

// ============================================
// LFO Depth Control
// ============================================

lfoDepthSlider.addEventListener('input', (e) => {
    const depth = parseFloat(e.target.value);
    lfoDepthValue.textContent = depth.toFixed(2);
    
    updateLFORange();
});

// ============================================
// LFO Waveform Control
// ============================================

lfoWaveformSelect.addEventListener('change', (e) => {
    if (lfo) {
        lfo.type = e.target.value;
        console.log('🌊 LFO waveform:', e.target.value);
    }
});

// ============================================
// Filter Cutoff Control
// ============================================

filterCutoffSlider.addEventListener('input', (e) => {
    const cutoff = parseFloat(e.target.value);
    filterCutoffValue.textContent = cutoff + ' Hz';
    
    updateLFORange();
});

// ============================================
// Modulation Target Control
// ============================================

modulationTargetSelect.addEventListener('change', (e) => {
    modulationTarget = e.target.value;
    
    if (!lfo || !carrier) return;
    
    // Stop and recreate LFO for clean switching
    lfo.stop();
    lfo.dispose();
    
    // Create new LFO with current settings
    const rate = parseFloat(lfoRateSlider.value);
    const waveform = lfoWaveformSelect.value;
    
    lfo = new Tone.LFO({
        frequency: rate,
        type: waveform
    });
    
    // Reset base values before connecting LFO
    if (modulationTarget === 'pitch') {
        // Set carrier to base frequency before LFO takes over
        carrier.frequency.value = parseFloat(carrierFreqSlider.value);
    }
    
    if (modulationTarget === 'volume') {
        // Set gain to base value before LFO takes over
        gainNode.gain.value = 0.3;
    }
    
    // Connect to new target
    switch(modulationTarget) {
        case 'filter':
            lfo.connect(filter.frequency);
            console.log('🎛️ LFO → Filter Cutoff');
            break;
        case 'pitch':
            lfo.connect(carrier.frequency);
            console.log('🎛️ LFO → Carrier Pitch');
            break;
        case 'volume':
            lfo.connect(gainNode.gain);
            console.log('🎛️ LFO → Volume');
            break;
    }
    
    updateLFORange();
    lfo.start();
});

// ============================================
// Update LFO Range
// ============================================

function updateLFORange() {
    if (!lfo) return;
    
    const depth = parseFloat(lfoDepthSlider.value);
    
    switch(modulationTarget) {
        case 'filter':
            // Modulate filter cutoff
            const centerValue = parseFloat(filterCutoffSlider.value);
            const filterMin = Math.max(20, centerValue - (centerValue * depth));
            const filterMax = Math.min(20000, centerValue + (centerValue * depth));
            lfo.min = filterMin;
            lfo.max = filterMax;
            console.log(`Filter range: ${filterMin.toFixed(0)} - ${filterMax.toFixed(0)} Hz`);
            break;
            
        case 'pitch':
            // Modulate carrier frequency (vibrato)
            const carrierFreq = parseFloat(carrierFreqSlider.value);
            const pitchRange = carrierFreq * depth * 0.05; // 5% variation max
            const pitchMin = carrierFreq - pitchRange;
            const pitchMax = carrierFreq + pitchRange;
            lfo.min = pitchMin;
            lfo.max = pitchMax;
            console.log(`Pitch range: ${pitchMin.toFixed(1)} - ${pitchMax.toFixed(1)} Hz`);
            break;
            
        case 'volume':
            // Modulate volume (tremolo)
            const baseVolume = 0.3;
            const volumeRange = depth * 0.3; // Max 30% variation
            const volumeMin = Math.max(0, baseVolume - volumeRange);
            const volumeMax = Math.min(1, baseVolume + volumeRange);
            lfo.min = volumeMin;
            lfo.max = volumeMax;
            console.log(`Volume range: ${volumeMin.toFixed(2)} - ${volumeMax.toFixed(2)}`);
            break;
    }
}

// ============================================
// Cleanup
// ============================================

window.addEventListener('beforeunload', () => {
    if (carrier) carrier.stop();
    if (lfo) lfo.stop();
});