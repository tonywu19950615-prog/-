let audioCtx: AudioContext | null = null;
let oscillator: OscillatorNode | null = null;
let gainNode: GainNode | null = null;
let lfo: OscillatorNode | null = null;
let isPlaying = false;

export function startPoliceSiren(): boolean {
  if (isPlaying) return true;

  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return false;

    audioCtx = new AudioContextClass();

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    // Main tone oscillator
    oscillator = audioCtx.createOscillator();
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(650, audioCtx.currentTime);

    // LFO (Low Frequency Oscillator) to modulate siren frequency up and down
    lfo = audioCtx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(2.2, audioCtx.currentTime); // 2.2 Hz sweep cycle

    const lfoGain = audioCtx.createGain();
    lfoGain.gain.setValueAtTime(350, audioCtx.currentTime); // sweep ±350Hz (300Hz ~ 1000Hz)

    lfo.connect(lfoGain);
    lfoGain.connect(oscillator.frequency);

    // Master volume gain
    gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.25, audioCtx.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    lfo.start();
    isPlaying = true;
    return true;
  } catch (err) {
    console.error('Failed to start emergency siren:', err);
    return false;
  }
}

export function stopPoliceSiren() {
  if (!isPlaying) return;
  try {
    if (oscillator) {
      oscillator.stop();
      oscillator.disconnect();
      oscillator = null;
    }
    if (lfo) {
      lfo.stop();
      lfo.disconnect();
      lfo = null;
    }
    if (gainNode) {
      gainNode.disconnect();
      gainNode = null;
    }
    if (audioCtx && audioCtx.state !== 'closed') {
      audioCtx.close();
      audioCtx = null;
    }
  } catch (e) {
    console.error('Error stopping siren', e);
  } finally {
    isPlaying = false;
  }
}

export function getIsSirenPlaying(): boolean {
  return isPlaying;
}
