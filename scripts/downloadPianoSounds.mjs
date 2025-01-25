import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PIANO_BASE_URL = 'https://gleitz.github.io/midi-js-soundfonts/FatBoy/acoustic_grand_piano-mp3/';
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'sounds');

// Ensure the output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Download a single note
const downloadNote = (note) => {
  const noteFileName = `piano-${note}.mp3`;
  const outputPath = path.join(OUTPUT_DIR, noteFileName);
  
  // Skip if file already exists
  if (fs.existsSync(outputPath)) {
    console.log(`File ${noteFileName} already exists, skipping...`);
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    // Convert MIDI note number to note name
    const noteNames = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
    const octave = Math.floor(note / 12) - 1;
    const noteName = `${noteNames[note % 12]}${octave}`;
    const url = `${PIANO_BASE_URL}${noteName.toLowerCase()}.mp3`;

    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(outputPath);
        response.pipe(fileStream);
        
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`Downloaded ${noteFileName}`);
          resolve();
        });
      } else {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      reject(err);
    });
  });
};

// Download one octave of piano notes starting from middle C (MIDI note 60)
const downloadPianoSounds = async () => {
  const baseNote = 60; // Middle C
  const promises = [];

  for (let i = 0; i < 12; i++) {
    const note = baseNote + i;
    promises.push(downloadNote(note));
  }

  try {
    await Promise.all(promises);
    console.log('All piano sounds downloaded successfully!');
  } catch (err) {
    console.error('Error downloading piano sounds:', err);
  }
};

downloadPianoSounds(); 