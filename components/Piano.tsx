import React, { useEffect, useState } from 'react';
import { useMIDI } from '../hooks/useMIDI';
import { audioManager } from '../utils/audioUtils';

interface PianoProps {
  className?: string;
}

const waveforms: OscillatorType[] = ['sine', 'square', 'sawtooth', 'triangle'];

export const Piano: React.FC<PianoProps> = ({ className }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const { noteOn, noteOff, control, error } = useMIDI();
  const [activeNotes, setActiveNotes] = useState<Set<number>>(new Set());
  const [selectedWaveform, setSelectedWaveform] = useState<OscillatorType>('sine');
  const [filterFreq, setFilterFreq] = useState(2000);
  const [filterQ, setFilterQ] = useState(1);
  const [attack, setAttack] = useState(0.05);
  const [decay, setDecay] = useState(0.1);
  const [sustain, setSustain] = useState(0.7);
  const [release, setRelease] = useState(0.2);

  // Initialize on mount
  useEffect(() => {
    setIsInitialized(true);
    return () => setIsInitialized(false);
  }, []);

  // Handle MIDI note events
  useEffect(() => {
    if (!isInitialized || !noteOn) return;
    audioManager.playNote(noteOn.note, noteOn.velocity);
    setActiveNotes(prev => new Set(prev).add(noteOn.note));
  }, [noteOn, isInitialized]);

  useEffect(() => {
    if (!isInitialized || !noteOff) return;
    audioManager.stopNote(noteOff.note);
    setActiveNotes(prev => {
      const newSet = new Set(prev);
      newSet.delete(noteOff.note);
      return newSet;
    });
  }, [noteOff, isInitialized]);

  // Handle synth parameter changes
  const handleWaveformChange = (waveform: OscillatorType) => {
    setSelectedWaveform(waveform);
    audioManager.setWaveform(waveform);
  };

  const handleFilterFreqChange = (value: number) => {
    setFilterFreq(value);
    audioManager.setFilterFrequency(value);
  };

  const handleFilterQChange = (value: number) => {
    setFilterQ(value);
    audioManager.setFilterResonance(value);
  };

  const handleEnvelopeChange = (a: number, d: number, s: number, r: number) => {
    setAttack(a);
    setDecay(d);
    setSustain(s);
    setRelease(r);
    audioManager.setEnvelopeSettings(a, d, s, r);
  };

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error: {error}
      </div>
    );
  }

  const renderMIDIControl = () => {
    if (!control) return null;

    let description = '';
    switch (control.type) {
      case 'note':
        const noteName = getNoteNameFromMIDI(control.rawData[1]);
        description = `${noteName} ${control.value > 0 ? 'On' : 'Off'} (${control.value})`;
        break;
      case 'cc':
        const ccName = getCCName(control.control || 0);
        description = `${ccName}: ${control.value}`;
        break;
      case 'pitchbend':
        description = `Pitch: ${Math.round((control.value / 16383) * 100)}%`;
        break;
    }

    return (
      <div className="fixed bottom-4 right-4 font-times text-white text-4xl opacity-50">
        {description}
      </div>
    );
  };

  // Helper functions for MIDI note names
  const getNoteNameFromMIDI = (note: number) => {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = Math.floor(note / 12) - 1;
    return `${noteNames[note % 12]}${octave}`;
  };

  // Helper function for CC names (specific to Akai MPK Mini)
  const getCCName = (cc: number) => {
    const ccNames: Record<number, string> = {
      1: 'Mod Wheel',
      44: 'K1',
      45: 'K2',
      46: 'K3',
      47: 'K4',
      48: 'K5',
      49: 'K6',
      50: 'K7',
      51: 'K8',
      // Add more CC mappings as needed
    };
    return ccNames[cc] || `CC ${cc}`;
  };

  return (
    <div className={`p-4 ${className}`}>
      <div className="text-white text-sm">
        {activeNotes.size > 0 ? (
          <span>Playing notes: {Array.from(activeNotes).join(', ')}</span>
        ) : (
          <span>Press keys on your MIDI keyboard</span>
        )}
      </div>
      {renderMIDIControl()}
    </div>
  );
}; 