import { useState, useEffect } from 'react';

interface MIDINote {
  note: number;
  velocity: number;
}

interface MIDIControl {
  type: 'note' | 'cc' | 'pitchbend';
  channel: number;
  control?: number;
  value: number;
  rawData: number[];
}

interface UseMIDIReturn {
  noteOn: MIDINote | null;
  noteOff: MIDINote | null;
  control: MIDIControl | null;
  error: string | null;
}

export const useMIDI = (): UseMIDIReturn => {
  const [noteOn, setNoteOn] = useState<MIDINote | null>(null);
  const [noteOff, setNoteOff] = useState<MIDINote | null>(null);
  const [control, setControl] = useState<MIDIControl | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.requestMIDIAccess) {
      setError('WebMIDI is not supported in this browser');
      return;
    }

    const handleMIDIMessage = function(this: MIDIInput, event: MIDIMessageEvent) {
      if (!event.data) return;
      
      const [status, data1, data2] = event.data;
      const channel = status & 0x0F;
      const type = status & 0xF0;

      console.log('MIDI Message:', { status, data1, data2, channel, type });
      
      // Note messages
      if (type === 0x90 && data2 > 0) { // Note On
        setNoteOn({ note: data1, velocity: data2 });
        setNoteOff(null);
        setControl({
          type: 'note',
          channel,
          value: data2,
          rawData: Array.from(event.data)
        });
      } else if (type === 0x80 || (type === 0x90 && data2 === 0)) { // Note Off
        setNoteOff({ note: data1, velocity: 0 });
        setNoteOn(null);
        setControl({
          type: 'note',
          channel,
          value: 0,
          rawData: Array.from(event.data)
        });
      }
      // Control Change messages (knobs, sliders, pads)
      else if (type === 0xB0) {
        setControl({
          type: 'cc',
          channel,
          control: data1,
          value: data2,
          rawData: Array.from(event.data)
        });
      }
      // Pitch Bend messages (joystick Y-axis typically)
      else if (type === 0xE0) {
        const value = (data2 << 7) + data1; // Combine bytes for 14-bit value
        setControl({
          type: 'pitchbend',
          channel,
          value,
          rawData: Array.from(event.data)
        });
      }
    };

    const initializeMIDI = async () => {
      try {
        const midiAccess = await navigator.requestMIDIAccess();
        const inputs = Array.from(midiAccess.inputs.values());

        // Connect to all available MIDI inputs
        inputs.forEach(input => {
          console.log(`Connecting to MIDI input: ${input.name}`);
          input.onmidimessage = handleMIDIMessage;
        });

        // Handle MIDI device connections/disconnections
        midiAccess.onstatechange = (e) => {
          const device = e.port;
          if (device && device.type === 'input') {
            if (device.state === 'connected') {
              console.log(`MIDI device connected: ${device.name}`);
              (device as MIDIInput).onmidimessage = handleMIDIMessage;
            } else {
              console.log(`MIDI device disconnected: ${device.name}`);
            }
          }
        };
      } catch (err) {
        setError('Failed to access MIDI devices');
        console.error('MIDI Access Error:', err);
      }
    };

    initializeMIDI();
  }, []);

  return { noteOn, noteOff, control, error };
}; 