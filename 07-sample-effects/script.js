// ============================================
// Sample with Effects Example
// ============================================

// UI Elements
const startAudioBtn = document.getElementById('startAudioBtn');
const statusMessage = document.getElementById('statusMessage');
const controlsSection = document.getElementById('controlsSection');
const fileInput = document.getElementById('fileInput');
const loadSampleBtn = document.getElementById('loadSampleBtn');
const sampleInfo = document.getElementById('sampleInfo');
const playBtn = document.getElementById('playBtn');
const stopBtn = document.getElementById('stopBtn');
const loopToggle = document.getElementById('loopToggle');
const volumeSlider = document.getElementById('volumeSlider');
const volumeValue = document.getElementById('volumeValue');

// Filter controls
const filterToggle = document.getElementById('filterToggle');
const filterCutoffSlider = document.getElementById('filterCutoffSlider');
const filterCutoffValue = document.getElementById('filterCutoffValue');
const filterResonanceSlider = document.getElementById('filterResonanceSlider');
const filterResonanceValue = document.getElementById('filterResonanceValue');

// Reverb controls
const reverbToggle = document.getElementById('reverbToggle');
const reverbDecaySlider = document.getElementById('reverbDecaySlider');
const reverbDecayValue = document.getElementById('reverbDecayValue');
const reverbWetSlider = document.getElementById('reverbWetSlider');
const reverbWetValue = document.getElementById('reverbWetValue');

// Delay controls
const delayToggle = document.getElementById('delayToggle');
const delayTimeSlider = document.getElementById('delayTimeSlider');
const delayTimeValue = document.getElementById('delayTimeValue');
const delayFeedbackSlider = document.getElementById('delayFeedbackSlider');
const delayFeedbackValue = document.getElementById('delayFeedbackValue');
const delayWetSlider = document.getElementById('delayWetSlider');
const delayWetValue = document.getElementById('delayWetValue');

// Audio components
let player = null;
let filter = null;
let reverb = null;
let delay = null;
let gainNode = null;

// Effect states
let filterEnabled = true;
let reverbEnabled = true;
let delayEnabled = true;

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
        statusMessage.textContent = '✅ Audio engine is ready! Load an audio sample to begin.';
        controlsSection.style.display = 'block';
        
        // Create effects chain
        createEffectsChain();
        
    } catch (error) {
        console.error('Error starting audio:', error);
        statusMessage.className = 'status status-error';
        statusMessage.textContent = '❌ Error starting audio. Please try again.';
    }
});

// ============================================
// Create Effects Chain
// ============================================

function createEffectsChain() {
    // Create gain node for volume control
    gainNode = new Tone.Gain(0.3).toDestination();
    
    // Create filter
    filter = new Tone.Filter({
        frequency: 5000,
        type: 'lowpass',
        Q: 1
    });
    
    // Create reverb
    reverb = new Tone.Reverb({
        decay: 2,
        wet: 0.3
    });
    
    // Create delay
    delay = new Tone.FeedbackDelay({
        delayTime: '8n',
        feedback: 0.3,
        wet: 0.2
    });
    
    // Connect effects in series: Filter → Delay → Reverb → Gain → Destination
    filter.connect(delay);
    delay.connect(reverb);
    reverb.connect(gainNode);
    
    console.log('🎛️ Effects chain created: Filter → Delay → Reverb → Gain → Destination');
}

// ============================================
// Load Predefined Sample
// ============================================

loadSampleBtn.addEventListener('click', async () => {
    const samplePath = '../resources/audio-samples/drum-loop-120.wav';
    await loadSample(samplePath, 'drum-loop-120.wav');
});

// ============================================
// Load Sample from File Input
// ============================================

fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const url = URL.createObjectURL(file);
    await loadSample(url, file.name);
});

// ============================================
// Load Sample Function
// ============================================

async function loadSample(url, filename) {
    try {
        sampleInfo.className = 'status status-info';
        sampleInfo.textContent = `Loading ${filename}...`;
        
        // Dispose of previous player if it exists
        if (player) {
            player.dispose();
        }
        
        // Create a new Player and connect to effects chain
        player = new Tone.Player({
            url: url,
            loop: false,
            onload: () => {
                console.log('✅ Sample loaded:', filename);
                sampleInfo.className = 'status status-success';
                sampleInfo.innerHTML = `
                    <strong>✅ Loaded: ${filename}</strong><br>
                    Duration: ${player.buffer.duration.toFixed(2)}s
                `;
                
                playBtn.disabled = false;
                stopBtn.disabled = false;
            }
        }).connect(filter);
        
    } catch (error) {
        console.error('Error loading sample:', error);
        sampleInfo.className = 'status status-error';
        sampleInfo.textContent = `❌ Error loading sample: ${error.message}`;
    }
}

// ============================================
// Play/Stop Controls
// ============================================

playBtn.addEventListener('click', () => {
    if (!player) return;
    
    if (player.state === 'started') {
        player.stop();
        playBtn.textContent = '▶️ Play';
    } else {
        player.start();
        playBtn.textContent = '⏸️ Pause';
        stopBtn.disabled = false;
        console.log('▶️ Playing sample with effects');
    }
});

stopBtn.addEventListener('click', () => {
    if (!player) return;
    
    player.stop();
    player.seek(0);
    playBtn.textContent = '▶️ Play';
    playBtn.disabled = false;
    stopBtn.disabled = true;
    console.log('⏹️ Stopped sample');
});

// ============================================
// Loop Toggle
// ============================================

loopToggle.addEventListener('change', (e) => {
    if (!player) return;
    player.loop = e.target.checked;
    console.log('🔁 Loop:', e.target.checked);
});

// ============================================
// Volume Control
// ============================================

volumeSlider.addEventListener('input', (e) => {
    const percentage = parseInt(e.target.value);
    volumeValue.textContent = percentage + '%';
    
    if (gainNode) {
        gainNode.gain.value = percentage / 100;
    }
});

// ============================================
// Filter Controls
// ============================================

filterToggle.addEventListener('change', (e) => {
    filterEnabled = e.target.checked;
    
    if (!player || !filter || !delay) return;
    
    player.disconnect();
    
    if (filterEnabled) {
        player.connect(filter);
        console.log('🎛️ Filter enabled');
    } else {
        player.connect(delay);
        console.log('🎛️ Filter bypassed');
    }
});

filterCutoffSlider.addEventListener('input', (e) => {
    const cutoff = parseFloat(e.target.value);
    filterCutoffValue.textContent = cutoff + ' Hz';
    
    if (filter) {
        filter.frequency.rampTo(cutoff, 0.1);
    }
});

filterResonanceSlider.addEventListener('input', (e) => {
    const resonance = parseFloat(e.target.value);
    filterResonanceValue.textContent = resonance.toFixed(1);
    
    if (filter) {
        filter.Q.value = resonance;
    }
});

// ============================================
// Reverb Controls
// ============================================

reverbToggle.addEventListener('change', (e) => {
    reverbEnabled = e.target.checked;
    
    if (reverb) {
        reverb.wet.value = reverbEnabled ? parseFloat(reverbWetSlider.value) : 0;
        console.log('🎛️ Reverb:', reverbEnabled ? 'enabled' : 'disabled');
    }
});

reverbDecaySlider.addEventListener('input', async (e) => {
    const decay = parseFloat(e.target.value);
    reverbDecayValue.textContent = decay.toFixed(1) + 's';
    
    if (reverb) {
        // Reverb decay requires regeneration
        reverb.decay = decay;
        await reverb.generate();
        console.log('🎛️ Reverb decay:', decay);
    }
});

reverbWetSlider.addEventListener('input', (e) => {
    const wet = parseFloat(e.target.value);
    reverbWetValue.textContent = Math.round(wet * 100) + '%';
    
    if (reverb && reverbEnabled) {
        reverb.wet.value = wet;
    }
});

// ============================================
// Delay Controls
// ============================================

delayToggle.addEventListener('change', (e) => {
    delayEnabled = e.target.checked;
    
    if (delay) {
        delay.wet.value = delayEnabled ? parseFloat(delayWetSlider.value) : 0;
        console.log('🎛️ Delay:', delayEnabled ? 'enabled' : 'disabled');
    }
});

delayTimeSlider.addEventListener('input', (e) => {
    const time = parseFloat(e.target.value);
    delayTimeValue.textContent = time.toFixed(2) + 's';
    
    if (delay) {
        delay.delayTime.value = time;
    }
});

delayFeedbackSlider.addEventListener('input', (e) => {
    const feedback = parseFloat(e.target.value);
    delayFeedbackValue.textContent = Math.round(feedback * 100) + '%';
    
    if (delay) {
        delay.feedback.value = feedback;
    }
});

delayWetSlider.addEventListener('input', (e) => {
    const wet = parseFloat(e.target.value);
    delayWetValue.textContent = Math.round(wet * 100) + '%';
    
    if (delay && delayEnabled) {
        delay.wet.value = wet;
    }
});

// ============================================
// Cleanup
// ============================================

window.addEventListener('beforeunload', () => {
    if (player) {
        player.dispose();
    }
    if (filter) filter.dispose();
    if (reverb) reverb.dispose();
    if (delay) delay.dispose();
    if (gainNode) gainNode.dispose();
});