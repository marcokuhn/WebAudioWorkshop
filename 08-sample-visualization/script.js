// ============================================
// Sample Analysis + p5.js Visualization
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
const vizModeSelect = document.getElementById('vizModeSelect');

// Audio components
let player = null;
let analyser = null;
let waveform = null;
let fft = null;
let meter = null;

// Visualization state
let vizMode = 'waveform';

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
        
        // Create analyzers
        createAnalyzers();
        
    } catch (error) {
        console.error('Error starting audio:', error);
        statusMessage.className = 'status status-error';
        statusMessage.textContent = '❌ Error starting audio. Please try again.';
    }
});

// ============================================
// Create Audio Analyzers
// ============================================

function createAnalyzers() {
    // Waveform analyzer (shows the actual audio waveform)
    waveform = new Tone.Waveform(1024);
    
    // FFT analyzer (shows frequency spectrum)
    fft = new Tone.FFT(512);
    
    // Meter (shows average volume/amplitude)
    meter = new Tone.Meter();
    
    // Create a splitter to send audio to multiple analyzers
    analyser = new Tone.Gain(0.5);
    analyser.connect(waveform);
    analyser.connect(fft);
    analyser.connect(meter);
    analyser.toDestination();
    
    console.log('📊 Analyzers created');
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
        
        if (player) {
            player.dispose();
        }
        
        player = new Tone.Player({
            url: url,
            loop: true,
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
        }).connect(analyser);
        
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
        console.log('▶️ Playing sample with visualization');
    }
});

stopBtn.addEventListener('click', () => {
    if (!player) return;
    
    player.stop();
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
});

// ============================================
// Volume Control
// ============================================

volumeSlider.addEventListener('input', (e) => {
    const percentage = parseInt(e.target.value);
    volumeValue.textContent = percentage + '%';
    
    if (analyser) {
        analyser.gain.value = percentage / 100;
    }
});

// ============================================
// Visualization Mode
// ============================================

vizModeSelect.addEventListener('change', (e) => {
    vizMode = e.target.value;
    console.log('📊 Visualization mode:', vizMode);
});

// ============================================
// p5.js Sketch
// ============================================

// This will be called by p5.js
function setup() {
    const canvas = createCanvas(800, 400);
    canvas.parent('visualizationCanvas');
    frameRate(60);
}

function draw() {
    background(26, 26, 26);
    
    if (!waveform || !fft || !meter) return;
    
    switch(vizMode) {
        case 'waveform':
            drawWaveform();
            break;
        case 'spectrum':
            drawSpectrum();
            break;
        case 'amplitude':
            drawAmplitude();
            break;
        case 'combined':
            drawCombined();
            break;
    }
}

// ============================================
// Waveform Visualization
// ============================================

function drawWaveform() {
    const values = waveform.getValue();
    
    stroke(102, 126, 234);
    strokeWeight(2);
    noFill();
    
    beginShape();
    for (let i = 0; i < values.length; i++) {
        const x = map(i, 0, values.length, 0, width);
        const y = map(values[i], -1, 1, height, 0);
        vertex(x, y);
    }
    endShape();
    
    // Draw center line
    stroke(100, 100, 100, 100);
    strokeWeight(1);
    line(0, height/2, width, height/2);
    
    // Label
    fill(200);
    noStroke();
    textSize(16);
    textAlign(LEFT, TOP);
    text('Waveform', 10, 10);
}

// ============================================
// Spectrum Visualization (FFT)
// ============================================

function drawSpectrum() {
    const values = fft.getValue();
    const barWidth = width / values.length;
    
    noStroke();
    
    for (let i = 0; i < values.length; i++) {
        // Convert dB value to height (FFT returns values in dB)
        const amplitude = map(values[i], -100, 0, 0, height);
        
        // Color based on frequency (low = red, high = blue)
        const hue = map(i, 0, values.length, 0, 280);
        colorMode(HSB);
        fill(hue, 80, 90);
        
        const x = i * barWidth;
        rect(x, height - amplitude, barWidth - 1, amplitude);
    }
    
    colorMode(RGB);
    
    // Label
    fill(200);
    noStroke();
    textSize(16);
    textAlign(LEFT, TOP);
    text('Frequency Spectrum', 10, 10);
}

// ============================================
// Amplitude Visualization
// ============================================

function drawAmplitude() {
    const level = meter.getValue();
    
    // Map meter value (-Infinity to 0 dB) to 0-1
    const normalizedLevel = map(level, -60, 0, 0, 1, true);
    
    // Draw pulsing circle
    const maxRadius = min(width, height) * 0.4;
    const radius = maxRadius * normalizedLevel;
    
    // Outer glow
    for (let i = 5; i > 0; i--) {
        const glowAlpha = map(i, 0, 5, 0, 50);
        fill(102, 126, 234, glowAlpha);
        noStroke();
        circle(width/2, height/2, radius * 2 + i * 20);
    }
    
    // Main circle
    fill(102, 126, 234);
    circle(width/2, height/2, radius * 2);
    
    // Center dot
    fill(255);
    circle(width/2, height/2, 10);
    
    // Level text
    fill(200);
    noStroke();
    textSize(20);
    textAlign(CENTER, CENTER);
    text(Math.round(normalizedLevel * 100) + '%', width/2, height/2 + 60);
    
    // Label
    textSize(16);
    textAlign(LEFT, TOP);
    text('Amplitude', 10, 10);
}

// ============================================
// Combined Visualization
// ============================================

function drawCombined() {
    // Top half: Waveform
    push();
    const waveValues = waveform.getValue();
    stroke(102, 126, 234);
    strokeWeight(2);
    noFill();
    
    beginShape();
    for (let i = 0; i < waveValues.length; i++) {
        const x = map(i, 0, waveValues.length, 0, width);
        const y = map(waveValues[i], -1, 1, height/2, 0);
        vertex(x, y);
    }
    endShape();
    pop();
    
    // Bottom half: Spectrum
    push();
    const fftValues = fft.getValue();
    const barWidth = width / fftValues.length;
    noStroke();
    
    for (let i = 0; i < fftValues.length; i++) {
        const amplitude = map(fftValues[i], -100, 0, 0, height/2);
        const hue = map(i, 0, fftValues.length, 0, 280);
        colorMode(HSB);
        fill(hue, 80, 90);
        
        const x = i * barWidth;
        rect(x, height - amplitude, barWidth - 1, amplitude);
    }
    colorMode(RGB);
    pop();
    
    // Dividing line
    stroke(100);
    strokeWeight(1);
    line(0, height/2, width, height/2);
    
    // Labels
    fill(200);
    noStroke();
    textSize(14);
    textAlign(LEFT, TOP);
    text('Waveform', 10, 10);
    text('Spectrum', 10, height/2 + 10);
}

// ============================================
// Window Resize
// ============================================

function windowResized() {
    const container = document.getElementById('visualizationCanvas');
    if (container) {
        resizeCanvas(container.offsetWidth, 400);
    }
}