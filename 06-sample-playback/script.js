// ============================================
// Sample Playback Example
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
const playbackRateSlider = document.getElementById('playbackRateSlider');
const playbackRateValue = document.getElementById('playbackRateValue');
const volumeSlider = document.getElementById('volumeSlider');
const volumeValue = document.getElementById('volumeValue');
const progressBar = document.getElementById('progressBar');
const timeDisplay = document.getElementById('timeDisplay');

// Audio components
let player = null;
let isPlaying = false;
let progressInterval = null;

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
        
    } catch (error) {
        console.error('Error starting audio:', error);
        statusMessage.className = 'status status-error';
        statusMessage.textContent = '❌ Error starting audio. Please try again.';
    }
});

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
    
    // Create object URL from file
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
        
        // Create a new Player
        player = new Tone.Player({
            url: url,
            loop: false,
            volume: -10,
            onload: () => {
                console.log('✅ Sample loaded:', filename);
                sampleInfo.className = 'status status-success';
                sampleInfo.innerHTML = `
                    <strong>✅ Loaded: ${filename}</strong><br>
                    Duration: ${player.buffer.duration.toFixed(2)}s
                `;
                
                // Enable controls
                playBtn.disabled = false;
                stopBtn.disabled = false;
                
                // Update progress bar max
                progressBar.max = player.buffer.duration;
            }
        }).toDestination();
        
        // Set up playback ended callback
        player.onstop = () => {
            isPlaying = false;
            playBtn.textContent = '▶️ Play';
            playBtn.disabled = false;
            stopBtn.disabled = true;
            stopProgressTracking();
        };
        
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
        // Pause
        player.stop();
        isPlaying = false;
        playBtn.textContent = '▶️ Play';
        stopProgressTracking();
    } else {
        // Play
        player.start();
        isPlaying = true;
        playBtn.textContent = '⏸️ Pause';
        stopBtn.disabled = false;
        startProgressTracking();
        console.log('▶️ Playing sample');
    }
});

stopBtn.addEventListener('click', () => {
    if (!player) return;
    
    player.stop();
    player.seek(0); // Reset to beginning
    isPlaying = false;
    playBtn.textContent = '▶️ Play';
    playBtn.disabled = false;
    stopBtn.disabled = true;
    stopProgressTracking();
    updateProgress();
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
// Playback Rate Control
// ============================================

playbackRateSlider.addEventListener('input', (e) => {
    const rate = parseFloat(e.target.value);
    playbackRateValue.textContent = rate.toFixed(2) + 'x';
    
    if (player) {
        player.playbackRate = rate;
        console.log('⏩ Playback rate:', rate);
    }
});

// ============================================
// Volume Control
// ============================================

volumeSlider.addEventListener('input', (e) => {
    const percentage = parseInt(e.target.value);
    volumeValue.textContent = percentage + '%';
    
    if (player) {
        const dB = Tone.gainToDb(percentage / 100);
        player.volume.value = dB;
    }
});

// ============================================
// Progress Tracking
// ============================================

function startProgressTracking() {
    // Update progress every 50ms
    progressInterval = setInterval(updateProgress, 50);
}

function stopProgressTracking() {
    if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
    }
}

function updateProgress() {
    if (!player || !player.buffer) return;
    
    const currentTime = Tone.Transport.seconds - player._startTime + player._offset;
    const duration = player.buffer.duration;
    
    // Update progress bar
    progressBar.value = Math.max(0, Math.min(currentTime, duration));
    
    // Update time display
    const current = formatTime(Math.max(0, currentTime));
    const total = formatTime(duration);
    timeDisplay.textContent = `${current} / ${total}`;
    
    // Stop tracking if playback finished (and not looping)
    if (currentTime >= duration && !player.loop) {
        stopProgressTracking();
    }
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ============================================
// Seek by clicking progress bar
// ============================================

progressBar.addEventListener('click', (e) => {
    if (!player || !player.buffer) return;
    
    const rect = progressBar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const seekTime = percentage * player.buffer.duration;
    
    // Stop and restart at new position
    const wasPlaying = player.state === 'started';
    player.stop();
    player.seek(seekTime);
    
    if (wasPlaying) {
        player.start();
    }
    
    updateProgress();
    console.log('⏭️ Seeked to:', seekTime.toFixed(2), 's');
});

// ============================================
// Cleanup
// ============================================

window.addEventListener('beforeunload', () => {
    if (player) {
        player.dispose();
    }
    stopProgressTracking();
});