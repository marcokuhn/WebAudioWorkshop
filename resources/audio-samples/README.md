# Audio Samples for Web Audio Workshop

This folder contains links to Creative Commons licensed audio samples for use in the workshop examples.

## How to Use

1. Download the samples you need from the links below
2. Place them in this `audio-samples` folder
3. The examples are already configured to look for files in this directory

## Recommended Samples

### Drum Samples (One-Shots)

**Kick Drum**
- URL: https://freesound.org/people/DWSD/sounds/171104/
- License: CC0 (Public Domain)
- Suggested filename: `kick.wav`

**Snare Drum**
- URL: https://freesound.org/people/DWSD/sounds/171108/
- License: CC0 (Public Domain)
- Suggested filename: `snare.wav`

**Hi-Hat**
- URL: https://freesound.org/people/DWSD/sounds/171115/
- License: CC0 (Public Domain)
- Suggested filename: `hihat.wav`

### Drum Loops

**120 BPM Drum Loop**
- URL: https://freesound.org/people/waveplaySFX/sounds/381353/
- License: CC0 (Public Domain)
- Suggested filename: `drum-loop-120.wav`
- Perfect for Examples 06, 07, and 08

**Electronic Beat Loop**
- URL: https://freesound.org/people/zagi2/sounds/212450/
- License: CC-BY 3.0
- Suggested filename: `bass-loop.wav`

### Melodic Samples

**Piano C3**
- URL: https://freesound.org/people/MTG/sounds/368041/
- License: CC-BY 3.0
- Suggested filename: `piano-c3.wav`

**Piano E3**
- URL: https://freesound.org/people/MTG/sounds/368042/
- License: CC-BY 3.0
- Suggested filename: `piano-e3.wav`

**Piano G3**
- URL: https://freesound.org/people/MTG/sounds/368043/
- License: CC-BY 3.0
- Suggested filename: `piano-g3.wav`

### Atmospheric Sounds

**Ambient Pad**
- URL: https://freesound.org/people/klankbeeld/sounds/198297/
- License: CC0 (Public Domain)
- Suggested filename: `ambient-pad.wav`

**Synth Chord**
- URL: https://freesound.org/people/Robinhood76/sounds/273891/
- License: CC0 (Public Domain)
- Suggested filename: `synth-chord.wav`

## Alternative: Use Your Own Samples

Students are encouraged to use their own audio samples! The examples support:

- **WAV** files (recommended for quality)
- **MP3** files (smaller file size)
- **OGG** files (good compression)

### Tips for Your Own Samples

1. **Duration**: 1-5 seconds works best for most examples
2. **Sample Rate**: 44.1kHz or 48kHz recommended
3. **Bit Depth**: 16-bit or 24-bit
4. **File Size**: Keep under 5MB for quick loading
5. **Format**: WAV is best for audio manipulation

## License Information

All samples listed above are either:
- **CC0**: Public Domain - no attribution required
- **CC-BY**: Requires attribution to original creator

When using CC-BY samples, please credit the creators as shown in the Freesound.org links.

## Quick Download Script (Optional)

If you want to download all recommended samples at once, you can use this bash script:

```bash
#!/bin/bash
# Download recommended workshop samples
# Make sure you have wget or curl installed

mkdir -p audio-samples
cd audio-samples

# Note: You'll need to manually download from Freesound.org
# as they require login for downloads
echo "Please download samples manually from the URLs in this README"
echo "Freesound.org requires a free account to download"
```

## File Structure

After downloading, your folder should look like this:

```
audio-samples/
├── README.md (this file)
├── kick.wav
├── snare.wav
├── hihat.wav
├── drum-loop-120.wav
├── bass-loop.wav
├── piano-c3.wav
├── piano-e3.wav
├── piano-g3.wav
├── ambient-pad.wav
└── synth-chord.wav
```

## Need More Samples?

Check out these resources:

- **Freesound.org**: https://freesound.org/ (largest free sound library)
- **BBC Sound Effects**: https://sound-effects.bbcrewind.co.uk/ (16,000+ free sounds)
- **Looperman**: https://www.looperman.com/ (free loops and samples)
- **Splice Free**: https://splice.com/sounds/free (requires free account)

## Troubleshooting

**"Sample won't load"**
- Check the file path is correct
- Make sure the file is in this folder
- Try converting to WAV format
- Check browser console for CORS errors

**"No sound when playing sample"**
- Ensure your volume is up
- Check the gain/volume controls in the example
- Make sure you clicked "Start Audio" first (browser requirement)

**"File is too large"**
- Use MP3 instead of WAV
- Use audio editing software to reduce sample rate/bit depth
- Trim the sample to a shorter duration

## Have Fun!

Experiment with different samples to hear how they react to filters, effects, and modulation!