// ============================================
// Oscillator + ADSR Envelope Example
// ============================================

// UI Elements
const startAudioBtn = document.getElementById('startAudioBtn');
const statusMessage = document.getElementById('statusMessage');
const controlsSection = document.getElementById('controlsSection');
const adsrSection = document.getElementById('adsrSection');
const triggerBtn = document.getElementById('triggerBtn');
const frequencySlider = document.getElementById('frequencySlider');
const frequencyValue = document.getElementById('frequencyValue');
const waveformSelect = document.getElementById('waveformSelect');
const attackSlider = document.getElementById('attackSlider');
const attackValue = document.getElementById('attackValue');
const decaySlider = document.getElementById('decaySlider');
const decayValue = document.getElementById('decayValue');
const sustainSlider = document.getElementById('sustainSlider');
const sustainValue = document.getElementById('sustainValue');
const releaseSlider = document.getElementById('releaseSlider');
const releaseValue = document.getElementById('releaseValue');
const envelopeDisplay = document.getElementById('envelopeDisplay');

// Audio nodes
let oscillator = null;
let envelope = null;
let isPlaying = false;

// ADSR values
let attack = 0.1;
let decay = 0.2;
let sustain = 0.5;
let release = 0.5;

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
        adsrSection.style.display = 'block';
        
        // Create synth
        createSynth();
        
    } catch (error) {
        console.error('Error starting audio:', error);
        statusMessage.className = 'status status-error';
        statusMessage.textContent = '❌ Error starting audio. Please try again.';
    }
});

// ============================================
// Create Synth with ADSR Envelope
// ============================================

function createSynth() {
    // Tone.js has a built-in synth that combines oscillator + envelope
    // But we'll create our own to understand how it works
    
    oscillator = new Tone.Oscillator({
        frequency: 440,
        type: 'sawtooth'
    });
    
    // Create an AmplitudeEnvelope (ADSR for volume)
    envelope = new Tone.AmplitudeEnvelope({
        attack: attack,
        decay: decay,
        sustain: sustain,
        release: release
    }).toDestination();
    
    // Connect oscillator to envelope
    oscillator.connect(envelope);
    
    // Start the oscillator (it runs continuously, but is silent until envelope triggers)
    oscillator.start();
    
    console.log('🎵 Synth created: Oscillator → ADSR Envelope → Destination');
    updateEnvelopeDisplay();
}

// ============================================
// Trigger Envelope
// ============================================

triggerBtn.addEventListener('click', () => {
    if (!envelope) return;
    
    // Trigger the envelope (Attack → Decay → Sustain)
    envelope.triggerAttack();
    
    // Visual feedback
    triggerBtn.classList.add('active');
    
    console.log('🎵 Note triggered (Attack → Decay → Sustain)');
});

// Release when button is released
triggerBtn.addEventListener('mouseup', releaseNote);
triggerBtn.addEventListener('mouseleave', releaseNote);
triggerBtn.addEventListener('touchend', releaseNote);

function releaseNote() {
    if (!envelope) return;
    
    // Trigger release phase
    envelope.triggerRelease();
    
    // Visual feedback
    triggerBtn.classList.remove('active');
    
    console.log('🎵 Note released (Release phase)');
}

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
// ADSR Controls
// ============================================

// Attack time
attackSlider.addEventListener('input', (e) => {
    attack = parseFloat(e.target.value);
    attackValue.textContent = attack.toFixed(2) + 's';
    
    if (envelope) {
        envelope.attack = attack;
    }
    updateEnvelopeDisplay();
});

// Decay time
decaySlider.addEventListener('input', (e) => {
    decay = parseFloat(e.target.value);
    decayValue.textContent = decay.toFixed(2) + 's';
    
    if (envelope) {
        envelope.decay = decay;
    }
    updateEnvelopeDisplay();
});

// Sustain level
sustainSlider.addEventListener('input', (e) => {
    sustain = parseFloat(e.target.value);
    sustainValue.textContent = Math.round(sustain * 100) + '%';
    
    if (envelope) {
        envelope.sustain = sustain;
    }
    updateEnvelopeDisplay();
});

// Release time
releaseSlider.addEventListener('input', (e) => {
    release = parseFloat(e.target.value);
    releaseValue.textContent = release.toFixed(2) + 's';
    
    if (envelope) {
        envelope.release = release;
    }
    updateEnvelopeDisplay();
});

// ============================================
// Visual Envelope Display
// ============================================

function updateEnvelopeDisplay() {
    // Create a visual envelope representation including release
    const totalTime = attack + decay + 0.5 + release; // 0.5s for sustain visual
    const scale = 200; // pixels width
    const height = 80; // pixels height
    
    // Calculate X positions for each stage
    const attackX = (attack / totalTime) * scale;
    const decayX = ((attack + decay) / totalTime) * scale;
    const sustainX = ((attack + decay + 0.5) / totalTime) * scale;
    const releaseX = scale;
    
    const sustainY = (1 - sustain) * height; // Height in pixels (inverted for SVG)
    
    // Create SVG path for ADSR
    const path = `
        M 0,${height}
        L ${attackX},0
        L ${decayX},${sustainY}
        L ${sustainX},${sustainY}
        L ${releaseX},${height}
    `;
    
    // Update display with styled text representation
    envelopeDisplay.innerHTML = `
        <div style="font-family: monospace; font-size: 12px; line-height: 1.4;">
            <strong>ADSR Envelope Shape:</strong><br><br>
            Attack: ${attack.toFixed(2)}s → Peak<br>
            Decay: ${decay.toFixed(2)}s → ${Math.round(sustain * 100)}% level<br>
            Sustain: Holds at ${Math.round(sustain * 100)}%<br>
            Release: ${release.toFixed(2)}s → Silence<br><br>
            <svg width="220" height="100" style="background: #f0f0f0; border-radius: 8px; padding: 10px;">
                <path d="${path}"
                      stroke="#667eea"
                      stroke-width="3"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"/>
                <!-- Stage labels -->
                <text x="${attackX/2-5}" y="95" font-size="10" fill="#666" font-weight="bold">A</text>
                <text x="${(attackX+decayX)/2-5}" y="95" font-size="10" fill="#666" font-weight="bold">D</text>
                <text x="${(decayX+sustainX)/2-5}" y="95" font-size="10" fill="#666" font-weight="bold">S</text>
                <text x="${(sustainX+releaseX)/2-5}" y="95" font-size="10" fill="#666" font-weight="bold">R</text>
            </svg>
        </div>
    `;
}

// ============================================
// Keyboard Support (Optional)
// ============================================

// Allow spacebar to trigger notes
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !e.repeat && envelope) {
        e.preventDefault();
        envelope.triggerAttack();
        triggerBtn.classList.add('active');
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'Space' && envelope) {
        e.preventDefault();
        envelope.triggerRelease();
        triggerBtn.classList.remove('active');
    }
});

// ============================================
// Cleanup
// ============================================

window.addEventListener('beforeunload', () => {
    if (oscillator) {
        oscillator.stop();
    }
});