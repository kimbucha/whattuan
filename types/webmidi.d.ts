declare namespace WebMidi {
  interface MIDIMessageEvent {
    data: Uint8Array;
    timeStamp: number;
    target: MIDIInput;
  }
}

interface MIDIMessageEventInit extends EventInit {
  data?: Uint8Array;
  receivedTime?: number;
}

interface MIDIMessageEvent extends Event {
  readonly data: Uint8Array;
  readonly receivedTime: number;
}

interface MIDIInput extends MIDIPort {
  onmidimessage: ((this: MIDIInput, ev: MIDIMessageEvent) => any) | null;
  addEventListener<K extends keyof MIDIInputEventMap>(
    type: K,
    listener: (this: MIDIInput, ev: MIDIInputEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
}

interface MIDIInputEventMap {
  midimessage: MIDIMessageEvent;
} 