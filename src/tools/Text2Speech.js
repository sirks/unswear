class Text2Speech {
  constructor() {
    this.synth = window.speechSynthesis;
    this.utterance = new SpeechSynthesisUtterance();
    this.utterance.onend = () => console.log('speaking finished');
    this.utterance.onerror = () => console.error('speaking error');
    this.utterance.pitch = 1;
    this.utterance.rate = 1;
    this.utterance.volume = 1;
    this.utterance.voice = this.synth.getVoices().find((voice) => voice.name === 'Fred');
  }

  speak(text) {
    if (this.synth.speaking) {
      console.error('speechSynthesis.speaking');
      return;
    }
    if (!text) {
      return;
    }
    this.utterance.text = text;
    this.synth.speak(this.utterance);
  }
}

export default Text2Speech