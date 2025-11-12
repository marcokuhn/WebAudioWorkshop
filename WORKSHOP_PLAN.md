# Web Audio Workshop - Complete Implementation Plan

## Workshop Structure (4.5 hours)

### Project Organization

```
WebAudioIntroduction/
├── README.md (Main workshop guide)
├── resources/
│   ├── audio-samples/
│   │   └── README.md (Links to CC-licensed samples)
│   └── css/
│       └── workshop-styles.css (Shared styling)
├── 00-hello-world/
│   └── index.html (HTML5 audio basics)
├── 01-simple-oscillator/
│   └── index.html (Pitch control with slider)
├── 02-oscillator-gain/
│   └── index.html (Volume control)
├── 03-oscillator-filter-gain/
│   └── index.html (Filter cutoff control)
├── 04-oscillator-adsr/
│   └── index.html (Envelope with trigger button)
├── 05-midi-trigger/
│   └── index.html (MIDI input + keyboard fallback)
├── 06-sample-playback/
│   └── index.html (Load and trigger audio sample)
├── 07-sample-effects/
│   └── index.html (Sample with reverb/filter)
├── 08-sample-visualization/
│   └── index.html (p5.js waveform/amplitude viz)
├── 09-multiple-oscillators/
│   └── index.html (Chord generator - Additional example)
├── 10-lfo-modulation/
│   └── index.html (LFO controlling filter - Additional example)
└── 11-sequencer/
    └── index.html (4-step sequencer - Advanced topic)
```

## Library Versions (Latest via CDN)

- **Tone.js**: https://cdn.jsdelivr.net/npm/tone@latest/build/Tone.js
- **NexusUI**: https://cdn.jsdelivr.net/npm/nexusui@latest/dist/NexusUI.js
- **p5.js**: https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

## Design Principles

### HTML Structure
Each example follows this template:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Example Name - Web Audio Workshop</title>
    <link rel="stylesheet" href="../resources/css/workshop-styles.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>Example Title</h1>
            <p class="description">Brief description</p>
        </header>
        
        <main class="controls">
            <!-- Interactive controls here -->
        </main>
        
        <footer>
            <div class="info-box">
                <h3>What's happening?</h3>
                <p>Educational explanation</p>
            </div>
            <div class="code-hint">
                <h3>Key concepts:</h3>
                <ul>
                    <li>Concept 1</li>
                    <li>Concept 2</li>
                </ul>
            </div>
        </footer>
    </div>
    
    <!-- Libraries -->
    <script src="[CDN links]"></script>
    <!-- Main code -->
    <script>
        // Well-commented code here
    </script>
</body>
</html>
```

### CSS Styling
- **Clean, modern interface** with good contrast
- **Visual feedback** for interactive elements (hover states, active states)
- **Responsive design** that works on different screen sizes
- **Color-coded sections** (controls in blue, info in green, warnings in orange)

### Code Comments
Each example includes:
- **Section headers** explaining each part
- **Inline comments** for complex operations
- **Educational notes** about Web Audio concepts
- **Common pitfalls** and how to avoid them

## Example Details

### 00 - Hello World (HTML5 Audio)
**Purpose**: Show basic browser audio before Web Audio API  
**Duration**: 10 minutes  
**Features**:
- HTML5 `<audio>` element
- Play/pause controls
- Volume slider
- Shows limitations vs Web Audio API

### 01 - Simple Oscillator
**Purpose**: Introduction to Tone.js and signal generation  
**Duration**: 20 minutes  
**Features**:
- Single oscillator (sine wave)
- Frequency slider (50Hz - 2000Hz)
- Start/Stop button
- NexusUI dial for frequency

### 02 - Oscillator + Gain
**Purpose**: Signal routing and volume control  
**Duration**: 15 minutes  
**Features**:
- Oscillator → Gain → Destination
- Volume slider with dB display
- Visual signal flow diagram
- Mute button

### 03 - Oscillator + Filter + Gain
**Purpose**: Audio effects in signal chain  
**Duration**: 20 minutes  
**Features**:
- Low-pass filter with cutoff control
- Filter resonance (Q) control
- A/B comparison (filter on/off)
- Signal flow visualization

### 04 - Oscillator + ADSR
**Purpose**: Envelope shaping  
**Duration**: 30 minutes  
**Features**:
- ADSR envelope controls (NexusUI)
- Trigger button
- Visual envelope display
- Attack/Decay/Sustain/Release sliders

### 05 - MIDI Trigger
**Purpose**: External input handling  
**Duration**: 25 minutes  
**Features**:
- Web MIDI API integration
- MIDI device selector
- Keyboard fallback (ASDF keys)
- Note number → frequency conversion
- Connection status indicator

### 06 - Sample Playback
**Purpose**: Working with audio files  
**Duration**: 20 minutes  
**Features**:
- File upload interface
- Trigger button
- Playback rate control
- Loop toggle
- Sample suggestions (CC-licensed)

### 07 - Sample + Effects
**Purpose**: Processing audio files  
**Duration**: 20 minutes  
**Features**:
- Sample with reverb
- Filter controls
- Wet/dry mix
- Effect bypass toggle

### 08 - Sample Visualization (p5.js)
**Purpose**: Audio analysis and visual feedback  
**Duration**: 40 minutes  
**Features**:
- Amplitude analyzer → circle size
- Waveform display
- Frequency analyzer → spectrum bars
- Multiple visualization modes

### 09 - Multiple Oscillators (Additional)
**Purpose**: Polyphony and harmony  
**Duration**: 20 minutes  
**Features**:
- 3 oscillators (root, third, fifth)
- Chord selector (major, minor, sus)
- Individual volume controls
- Detune controls for richness

### 10 - LFO Modulation (Additional)
**Purpose**: Modulation concepts  
**Duration**: 20 minutes  
**Features**:
- LFO controlling filter cutoff
- LFO rate control
- LFO depth control
- Waveform selector (sine, triangle, square)
- Visual LFO display

### 11 - Simple Sequencer (Advanced)
**Purpose**: Rhythm and patterns  
**Duration**: 30 minutes  
**Features**:
- 4-step sequencer
- Note selector per step
- Step on/off toggles
- Tempo control (BPM)
- Transport controls (play/stop)
- Visual step indicator

## Audio Resources

### Recommended CC-Licensed Samples

**Drums/Percussion**:
- https://freesound.org/people/DWSD/sounds/171104/ (Kick drum)
- https://freesound.org/people/DWSD/sounds/171108/ (Snare drum)
- https://freesound.org/people/DWSD/sounds/171115/ (Hi-hat)

**Loops**:
- https://freesound.org/people/FoolBoyMedia/sounds/352653/ (Drum loop 120 BPM)
- https://freesound.org/people/zagi2/sounds/212450/ (Bass loop)

**Melodic**:
- https://freesound.org/people/MTG/sounds/368041/ (Piano note C3)
- https://freesound.org/people/MTG/sounds/368042/ (Piano note E3)

All samples are licensed under Creative Commons CC0 or CC-BY.

## Workshop Timeline

**0:00 - 0:30** Introduction & Setup
- HTML/CSS/JS basics review
- Web Audio concepts
- Project setup

**0:30 - 1:00** Examples 00-01
- Hello World
- Simple oscillator

**1:00 - 1:45** Examples 02-03
- Gain control
- Filter introduction

**1:45 - 2:30** Example 04
- ADSR envelope (detailed)

**2:30 - 2:45** Break

**2:45 - 3:15** Example 05
- MIDI integration

**3:15 - 3:45** Examples 06-07
- Sample playback
- Effects processing

**3:45 - 4:15** Example 08
- p5.js visualization

**4:15 - 4:30** Examples 09-11 (Time permitting)
- Quick demos of advanced topics

**4:30 - 5:00** Q&A & Experimentation
- Student questions
- Free exploration

## Teaching Notes

### Common Issues to Address

1. **Audio Context Autoplay Policy**
   - Must start after user gesture
   - Include "Start Audio" button

2. **CORS Issues**
   - Explain local file restrictions
   - Recommend Live Server extension

3. **Browser Compatibility**
   - Test on Chrome (best support)
   - Firefox also good
   - Safari has some limitations

4. **Performance**
   - Too many audio nodes can cause issues
   - Demonstrate proper cleanup

### Progressive Complexity Strategy

Each example builds on previous ones:
- Reuse concepts already learned
- Add ONE new concept at a time
- Provide working code, then explain
- Encourage experimentation

### Engagement Techniques

- **Live coding**: Build examples together
- **Challenges**: "Can you change the waveform to square?"
- **Sharing**: Students present their modifications
- **Troubleshooting together**: Debug as a group

## Next Steps

All examples will be created with:
✅ Complete, working code
✅ Educational comments
✅ Visual polish (CSS)
✅ Clear documentation
✅ Progressive difficulty
✅ Reusable patterns

Ready to switch to Code mode to implement all examples!