import SpeechToText from 'speech-to-text';

const swearWordMap = {
  'f***': 'fuck',
  'f******': 'fucking',
  'b****': 'bitch',
  's***': 'shit',
  'b*******': 'bullshit',
};

class SpeechRecorder {
  constructor(onWord) {
    this.constraints = {audio: true, video: false};
    this.listener = null;
    this.onWord = onWord;

    this.stopped = true;
    this.timoutId = 0;
  }

  onText = text => {
    this.timoutId = clearTimeout(this.timoutId);
    // console.log(text);
    for (let word of text.split(' ').slice(-5)) {
      const b = swearWordMap.hasOwnProperty(word);
      this.onWord(b ? swearWordMap[word] : word);
    }
    this.timoutId = setTimeout(this.restart, 10000)
  };

  restart = (event) => {
    console.log("restart called", event);
    if (!this.stopped) {
      console.log("stopped unexpectedly, restarting listener");
      this.stopRecord();
      this.startRecord();
    }
  }

  createNewListener = () => {
    this.listener =
      new SpeechToText(
        this.onText,
        this.onText
      );
    // this.listener.recognition.onend = this.restart;
    // this.listener.recognition.onerror = this.restart;
  }

  startRecord = () => {
    console.log("start clicked");
    this.stopped = false;
    this.createNewListener();
    this.listener.startListening();
    console.log(this.listener);
  }

  stopRecord = () => {
    console.log("stop clicked");
    this.stopped = true;
    this.listener.stopListening();
  }
}

export default SpeechRecorder;
