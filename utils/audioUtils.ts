class AudioManager {
  private audioContext: AudioContext | null = null;
  private activeOscillators: Map<number, {
    oscillator: OscillatorNode;
    envelope: GainNode;
    filter: BiquadFilterNode;
  }> = new Map();
  private gainNode: GainNode | null = null;
  private waveform: OscillatorType = 'sine';
  private filterFrequency = 2000;
  private filterResonance = 1;

  // ADSR settings
  private attack = 0.05;  // seconds
  private decay = 0.1;   // seconds
  private sustain = 0.7;  // gain level (0-1)
  private release = 0.2;  // seconds

  private initAudioContext() {
    if (this.audioContext) return;
    
    try {
      this.audioContext = new AudioContext();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.gainNode.gain.value = 0.5; // Set default volume
    } catch (err) {
      console.error('Failed to initialize AudioContext:', err);
    }
  }

  private ensureContext() {
    if (!this.audioContext) {
      this.initAudioContext();
    } else if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  private midiNoteToFrequency(note: number): number {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  setWaveform(waveform: OscillatorType) {
    this.waveform = waveform;
    if (this.audioContext) {
      this.activeOscillators.forEach(({ oscillator }) => {
        oscillator.type = waveform;
      });
    }
  }

  setFilterFrequency(frequency: number) {
    this.filterFrequency = Math.max(20, Math.min(20000, frequency));
    if (this.audioContext) {
      this.activeOscillators.forEach(({ filter }) => {
        filter.frequency.setValueAtTime(this.filterFrequency, this.audioContext?.currentTime || 0);
      });
    }
  }

  setFilterResonance(resonance: number) {
    this.filterResonance = Math.max(0.1, Math.min(20, resonance));
    if (this.audioContext) {
      this.activeOscillators.forEach(({ filter }) => {
        filter.Q.setValueAtTime(this.filterResonance, this.audioContext?.currentTime || 0);
      });
    }
  }

  setEnvelopeSettings(attack: number, decay: number, sustain: number, release: number) {
    this.attack = Math.max(0.001, Math.min(2, attack));
    this.decay = Math.max(0.001, Math.min(2, decay));
    this.sustain = Math.max(0, Math.min(1, sustain));
    this.release = Math.max(0.001, Math.min(5, release));
  }

  playNote(note: number, velocity: number) {
    this.ensureContext();
    if (!this.audioContext || !this.gainNode) return;

    const now = this.audioContext.currentTime;

    // Create oscillator
    const oscillator = this.audioContext.createOscillator();
    oscillator.type = this.waveform;
    oscillator.frequency.value = this.midiNoteToFrequency(note);

    // Create filter
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = this.filterFrequency;
    filter.Q.value = this.filterResonance;

    // Create envelope
    const envelopeGain = this.audioContext.createGain();
    envelopeGain.gain.setValueAtTime(0, now);
    envelopeGain.gain.linearRampToValueAtTime(velocity / 127, now + this.attack);
    envelopeGain.gain.linearRampToValueAtTime(this.sustain * (velocity / 127), now + this.attack + this.decay);

    // Connect the audio chain
    oscillator.connect(filter);
    filter.connect(envelopeGain);
    envelopeGain.connect(this.gainNode);

    // Start the oscillator
    oscillator.start();

    // Store the nodes for later
    this.activeOscillators.set(note, {
      oscillator,
      envelope: envelopeGain,
      filter
    });
  }

  stopNote(note: number) {
    const nodes = this.activeOscillators.get(note);
    if (!nodes || !this.audioContext) return;

    const { oscillator, envelope } = nodes;
    const now = this.audioContext.currentTime;

    // Apply release envelope
    envelope.gain.cancelScheduledValues(now);
    envelope.gain.setValueAtTime(envelope.gain.value, now);
    envelope.gain.linearRampToValueAtTime(0, now + this.release);

    // Stop and clean up after release
    setTimeout(() => {
      oscillator.stop();
      this.activeOscillators.delete(note);
    }, this.release * 1000);
  }

  setVolume(value: number) {
    if (this.gainNode) {
      this.gainNode.gain.value = Math.max(0, Math.min(1, value));
    }
  }
}

// Export a singleton instance
export const audioManager = new AudioManager(); 