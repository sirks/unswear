class Text2Speech {
  constructor() {
    this.synth = window.speechSynthesis;
    this.utterance = new SpeechSynthesisUtterance();
    this.utterance.onerror = () => console.error('speaking error');
    this.utterance.pitch = 1;
    this.utterance.rate = 1;
    this.utterance.volume = 1;
    this.utterance.voice = this.synth.getVoices().find((voice) => voice.name === 'Fred');
    this.speakList = {}
  }

  speak(key, text) {
    if (this.speakList.hasOwnProperty(key)) {
      return;
    }
    this.speakList[key] = text;
    if (!this.synth.speaking) {
      this.speakAll()
    }
  }

  speakAll = () => {
    const key = Object.keys(this.speakList)[0];
    if (!key) {
      return;
    }
    this.utterance.text = this.speakList[key];
    this.utterance.onend = () => {
      delete this.speakList[key];
      this.speakAll();
    };
    this.synth.speak(this.utterance);
  }
}

export default Text2Speech