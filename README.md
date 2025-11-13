# Web Audio API Workshop for Audio Design Students

A comprehensive 4.5-hour workshop introducing beginners to web audio development using HTML, Tone.js, NexusUI, and p5.js.

## 🎯 Workshop Overview

This workshop teaches the fundamentals of creating interactive audio applications in the browser. Students will learn:

- **HTML5 Audio Basics** - Understanding web audio fundamentals
- **Tone.js** - High-level audio synthesis and effects
- **Signal Flow** - How audio nodes connect and process sound
- **Interactive Controls** - Building user interfaces for audio parameters
- **MIDI Integration** - Connecting hardware controllers
- **Audio Analysis** - Visualizing sound with p5.js
- **Sequencing** - Creating patterns and rhythms

## 📋 Prerequisites

### Essential Skills
- **No prior programming experience required!** This workshop starts from the basics.
- Basic computer literacy (file management, web browsing)

### Required Tools
- A modern web browser (Chrome, Firefox, or Edge recommended)
- A code editor (VS Code recommended - [download here](https://code.visualstudio.com/))

### Optional
- MIDI controller/keyboard for Example 5
- Headphones for better audio experience

### Recommended Pre-Workshop Study
If you're completely new to HTML/CSS, spend 30 minutes with our [UI Fundamentals](ui-fundamentals/) section before the workshop. Don't worry - we'll cover the basics during the introduction!

## 🚀 Getting Started

### Option 1: Local Development

1. **Clone or download this repository**
2. **Open any example folder** in your code editor
3. **Start a local server** (required for loading audio files):
   
   Using Python:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```
   
   Using Node.js:
   ```bash
   # Install http-server globally
   npm install -g http-server
   
   # Run server
   http-server -p 8000
   ```
   
   Using VS Code:
   - Install "Live Server" extension
   - Right-click on `index.html` → "Open with Live Server"

4. **Open your browser** to `http://localhost:8000`
5. **Navigate to any example** to start exploring!

### Option 2: Direct File Opening

Examples 00-05 can be opened directly in your browser by double-clicking `index.html`. However, examples 06-08 require a local server due to CORS restrictions when loading audio files.

## 🎨 UI Fundamentals (Pre-Workshop Optional)

**New to HTML/CSS?** Start here! We've created a comprehensive [UI Fundamentals](ui-fundamentals/) section covering:

- **[HTML Structure](ui-fundamentals/01-html-structure/)** - Document structure, semantic elements, form controls
- **[CSS Basics](ui-fundamentals/02-css-basics/)** - Styling, colors, typography, box model
- **[Flexbox Layouts](ui-fundamentals/03-flexbox-layout/)** - Modern responsive layouts
- **[NexusUI Basics](ui-fundamentals/05-nexusui/)** - Touch-optimized audio controls
- **[Frameworks Comparison](ui-fundamentals/06-frameworks-comparison/)** - Choosing the right tools

**During the workshop**, we'll introduce HTML/CSS concepts as needed, but having this foundation will help you focus on the audio aspects.

### Quick HTML/CSS Reference

<details>
<summary><strong>Click to expand: Essential HTML/CSS for this workshop</strong></summary>

#### Basic HTML Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My Audio App</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h1>My Synthesizer</h1>
    <button id="playBtn">Play</button>
    <input type="range" id="freq" min="20" max="2000" value="440">
    
    <script src="https://cdn.jsdelivr.net/npm/tone@latest/build/Tone.js"></script>
    <script src="script.js"></script>
</body>
</html>
```

#### Common HTML Elements for Audio UIs
```html
<!-- Buttons -->
<button id="playBtn">Play</button>

<!-- Sliders -->
<input type="range" id="volume" min="0" max="100" value="50">

<!-- Number inputs -->
<input type="number" id="bpm" min="60" max="200" value="120">

<!-- Dropdowns -->
<select id="waveform">
    <option value="sine">Sine</option>
    <option value="square">Square</option>
</select>

<!-- Labels -->
<label for="volume">Volume</label>

<!-- Containers -->
<div class="control-panel">
    <!-- Controls go here -->
</div>
```

#### Essential CSS Concepts
```css
/* Selectors */
.className { }          /* Class selector */
#idName { }             /* ID selector */
button { }              /* Element selector */

/* Layout with Flexbox */
.container {
    display: flex;
    justify-content: center;    /* Horizontal alignment */
    align-items: center;        /* Vertical alignment */
    gap: 20px;                  /* Space between items */
}

/* Styling buttons */
button {
    padding: 10px 20px;
    background-color: #667eea;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background-color: #5568d3;
}

/* Custom slider styling */
input[type="range"] {
    -webkit-appearance: none;
    width: 200px;
    height: 6px;
    background: #ddd;
    border-radius: 3px;
}

input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    background: #667eea;
    border-radius: 50%;
    cursor: pointer;
}
```

#### JavaScript DOM Manipulation
```javascript
// Get elements
const button = document.getElementById('playBtn');
const slider = document.getElementById('freq');

// Listen for events
button.addEventListener('click', function() {
    console.log('Button clicked!');
});

slider.addEventListener('input', function() {
    const value = this.value;
    console.log('Slider value:', value);
});

// Update text content
document.getElementById('display').textContent = '440 Hz';
```

For more details, see the complete [UI Fundamentals section](ui-fundamentals/).

</details>

## 📚 Workshop Structure

### Part 1: Foundation (60 minutes)
Building blocks of web audio synthesis

#### [Example 00: Hello World](00-hello-world/)
- Introduction to HTML5 `<audio>` element
- Understanding browser audio basics
- **Concepts**: Audio elements, playback controls, loading sounds

#### [Example 01: Simple Oscillator](01-simple-oscillator/)
- Creating your first synthesizer tone
- Controlling pitch with a slider
- **Concepts**: Tone.Oscillator, frequency, waveforms

#### [Example 02: Oscillator + Gain](02-oscillator-gain/)
- Adding volume control to your oscillator
- Understanding signal flow
- **Concepts**: Tone.Gain, signal routing, amplitude

#### [Example 03: Oscillator + Filter + Gain](03-oscillator-filter-gain/)
- Shaping tone with a low-pass filter
- Separate JavaScript file organization
- **Concepts**: Tone.Filter, cutoff frequency, resonance, code structure

### Part 2: Envelopes & Interaction (45 minutes)
Making sounds dynamic and expressive

#### [Example 04: ADSR Envelope](04-oscillator-adsr/)
- Shaping sound over time with envelopes
- Button-triggered notes
- **Concepts**: Attack, Decay, Sustain, Release, Tone.AmplitudeEnvelope

#### [Example 05: MIDI Trigger](05-midi-trigger/)
- Playing notes with a MIDI keyboard
- Virtual keyboard fallback
- **Concepts**: Web MIDI API, note-on/note-off, velocity, MIDI channels

### Part 3: Samples & Effects (60 minutes)
Working with recorded audio

#### [Example 06: Sample Playback](06-sample-playback/)
- Loading and triggering audio files
- Understanding Tone.Player
- **Concepts**: Audio buffers, sample playback, file loading

#### [Example 07: Sample Effects](07-sample-effects/)
- Adding reverb, delay, and filter to samples
- Effect parameter control
- **Concepts**: Tone.Reverb, Tone.FeedbackDelay, wet/dry mix, effect chains

#### [Example 08: Sample Visualization](08-sample-visualization/)
- Analyzing audio with p5.js
- Real-time waveform, spectrum, and amplitude display
- **Concepts**: Tone.Waveform, Tone.FFT, Tone.Meter, canvas drawing

### Part 4: Advanced Techniques (75 minutes)
Polyphony, modulation, and sequencing

#### [Example 09: Multiple Oscillators](09-multiple-oscillators/)
- Creating chords with multiple oscillators
- Detuning for richer sounds
- **Concepts**: Polyphony, harmony, chorus effect, detuning

#### [Example 10: LFO Modulation](10-lfo-modulation/)
- Using Low Frequency Oscillators to modulate parameters
- Vibrato, tremolo, and filter sweeps
- **Concepts**: Tone.LFO, modulation, vibrato, tremolo, automation

#### [Example 11: 4-Step Sequencer](11-sequencer/)
- Creating rhythmic patterns
- Programming melodies and beats
- **Concepts**: Tone.Transport, Tone.Sequence, BPM, step sequencing, timing

### Part 5: Q&A & Experimentation (30 minutes)
Students experiment with examples and ask questions

## 🎓 Learning Path

### Recommended Order for Self-Study:

1. **Start with Example 00** to understand HTML5 audio
2. **Work through Examples 01-03** to grasp synthesis basics
3. **Practice Examples 04-05** to understand envelopes and MIDI
4. **Explore Examples 06-08** to learn sample manipulation
5. **Experiment with Examples 09-11** for advanced techniques

### Key Concepts by Example:

| Example | Core Concepts | Difficulty |
|---------|---------------|------------|
| 00 | HTML5 Audio, Playback | ⭐ Beginner |
| 01 | Oscillators, Frequency | ⭐ Beginner |
| 02 | Gain, Signal Flow | ⭐ Beginner |
| 03 | Filters, File Organization | ⭐⭐ Beginner+ |
| 04 | Envelopes, ADSR | ⭐⭐ Intermediate |
| 05 | MIDI, External Input | ⭐⭐⭐ Intermediate |
| 06 | Audio Files, Buffers | ⭐⭐ Intermediate |
| 07 | Effects Chains, Processing | ⭐⭐⭐ Intermediate |
| 08 | Audio Analysis, Visualization | ⭐⭐⭐ Intermediate+ |
| 09 | Polyphony, Chords | ⭐⭐⭐ Intermediate+ |
| 10 | Modulation, LFOs | ⭐⭐⭐⭐ Advanced |
| 11 | Sequencing, Timing | ⭐⭐⭐⭐ Advanced |

## 🛠️ Technologies Used

### Core Libraries

- **[Tone.js](https://tonejs.github.io/)** - Web Audio framework
  - High-level synthesis and effects
  - Built on Web Audio API
  - Scheduling and timing utilities

- **[p5.js](https://p5js.org/)** - Creative coding library
  - Canvas-based visualization
  - Used in Example 08 for audio analysis

### Web APIs

- **Web Audio API** - Browser audio processing
- **Web MIDI API** - MIDI device connectivity (Example 05)

## 📖 Signal Flow Concepts

Understanding how audio flows through nodes:

```
Basic Synthesis (Examples 01-04):
Oscillator → Gain → Destination

With Filter (Example 03):
Oscillator → Filter → Gain → Destination

With Envelope (Example 04):
Oscillator → AmplitudeEnvelope → Destination

Sample Playback (Example 06):
Player (Audio File) → Destination

With Effects (Example 07):
Player → Filter → Delay → Reverb → Destination

LFO Modulation (Example 10):
LFO ↘
      → Filter.frequency
Osc ↗

Sequencer (Example 11):
Transport (Clock) → Sequence → Synth → Destination
```

## 🎹 Common Parameters

### Frequency
- Measured in Hertz (Hz)
- Middle C (C4) = 261.63 Hz
- Doubling frequency = up one octave

### Amplitude/Gain
- Volume control
- Usually 0.0 (silent) to 1.0 (full volume)
- Can go higher but may cause distortion

### Filter Cutoff
- Frequency where filtering begins
- Low-pass filter: allows frequencies below cutoff
- Typical range: 20 Hz to 20,000 Hz

### ADSR Envelope
- **Attack**: Time to reach full volume
- **Decay**: Time to drop to sustain level
- **Sustain**: Held volume level
- **Release**: Time to fade to silence

## 🔧 Troubleshooting

### No Sound?
1. Check your browser console for errors (F12)
2. Click "Start Audio Engine" button (required by browsers)
3. Check your system volume and browser tab isn't muted
4. Try a different browser (Chrome/Firefox recommended)

### MIDI Not Working?
1. Connect MIDI device before opening the page
2. Check browser supports Web MIDI (Chrome, Edge)
3. Use the virtual keyboard as fallback
4. Grant MIDI access when prompted

### Audio Files Not Loading?
1. Make sure you're using a local server (not file://)
2. Check audio file paths are correct
3. Download sample files (see resources/audio-samples/README.md)
4. Check browser console for CORS errors

### Examples Not Working?
1. Clear browser cache and reload
2. Check all script tags are loading
3. Ensure you clicked "Start Audio Engine"
4. Try opening in incognito/private mode

## 📝 Exercises for Students

### Beginner Challenges:
1. **Modify Example 01**: Change waveform type (sine, square, triangle, sawtooth)
2. **Extend Example 02**: Add a second oscillator at a different frequency
3. **Enhance Example 03**: Add filter resonance control
4. **Customize Example 04**: Create different envelope shapes (slow attack, fast release)

### Intermediate Challenges:
1. **Example 05**: Play chords (multiple notes) with MIDI
2. **Example 07**: Chain multiple effects together
3. **Example 08**: Add different visualization styles
4. **Example 09**: Create a full chord progression (C-F-G-C)

### Advanced Challenges:
1. **Example 10**: Modulate multiple parameters simultaneously
2. **Example 11**: Extend to 8 or 16 steps
3. **Combine examples**: Add LFO modulation to the sequencer
4. **Create new example**: Build a simple drum machine using multiple samples

## 🌐 Additional Resources

### Documentation
- [Tone.js Documentation](https://tonejs.github.io/docs/)
- [Web Audio API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [p5.js Reference](https://p5js.org/reference/)
- [Web MIDI API](https://www.w3.org/TR/webmidi/)

### Tutorials
- [Tone.js Interactive Tutorial](https://tonejs.github.io/examples/)
- [Web Audio School](https://mmckegg.github.io/web-audio-school/)
- [The Coding Train - p5.js](https://thecodingtrain.com/)

### Sound Design
- [Sound on Sound - Synth Secrets](https://www.soundonsound.com/series/synth-secrets)
- [Learning Synths by Ableton](https://learningsynths.ableton.com/)
- [Learning Music by Ableton](https://learningmusic.ableton.com/)

### Free Sample Libraries
- See [resources/audio-samples/README.md](resources/audio-samples/README.md)

## 🎨 Customization Ideas

Students can extend these examples by:
- Adding visual themes and custom styling
- Implementing preset systems (save/load settings)
- Creating more complex effect chains
- Building complete instruments
- Adding recording/export functionality
- Implementing more sophisticated sequencing
- Creating generative music systems

## 📄 License

This workshop material is provided for educational purposes. 

**Libraries Used:**
- Tone.js - MIT License
- p5.js - LGPL License

**Audio Samples:**
See individual attribution in resources/audio-samples/README.md

## 🤝 Contributing

Found a bug or have a suggestion? Students and instructors are encouraged to:
- Report issues with specific examples
- Suggest improvements to explanations
- Share additional exercises
- Contribute new examples

## ✨ Credits

Created for Audio Design B.A. students new to web audio programming.

**Special Thanks:**
- Tone.js community
- p5.js Foundation
- Web Audio API working group
- All open-source contributors

---

**Happy Sound Making! 🎵**

*Remember: The best way to learn audio programming is to experiment, make mistakes, and have fun!*
