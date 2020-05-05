import SpeechToText from 'speech-to-text';

const swearWordMap = {
  'f***': 'fuck',
  'f******': 'fucking',
  'f*****': 'fucker',
  'm***********': 'motherfucker',
  'b****': 'bitch',
  's***': 'shit',
  'b*******': 'bullshit',
  'c***': 'cunt',
  'a******': 'asshole',
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
    for (let word of text.trim().split(' ').slice(-5)) {
      const b = swearWordMap.hasOwnProperty(word);
      this.onWord(b ? swearWordMap[word] : word);
    }
    this.timoutId = setTimeout(this.restart, 1000)
  };

  restart = (event) => {
    console.log("--------------------", event);
    if (!this.stopped) {
      this.stopRecord();
      this.startRecord();
    }
  };

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
    this.stopped = false;
    this.createNewListener();
    this.listener.startListening();
    console.log(this.listener);
  }

  stopRecord = () => {
    this.stopped = true;
    this.listener.stopListening();
  }
}

export default SpeechRecorder;
