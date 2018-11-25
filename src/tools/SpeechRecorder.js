import SpeechToText from 'speech-to-text';

const iterRegex = /([a-z]|[A-Z])+ ([a-z]|[A-Z])+$/g;
const finalRegex = / ?([a-z]|[A-Z])+$/g;

class SpeechRecorder {
  constructor(onFinalised, onAnythingSaid, onWord) {
    this.constraints = {audio: true, video: false};
    this.listener = null;
    this.stopped = true;

    this.textFromMic = "";
    this.allText = "";

    this.lastWord = '';

    this.onFinalised = text => {

      const match = text.match(finalRegex);
      if (match) {
        const lastWord = match[0].trim();
        if (this.lastWord !== lastWord) {
          onWord(lastWord);
          this.lastWord = lastWord
        }
      }
      console.log(`Finalised text: ${text}`);
      this.allText = this.allText + text + ". ";

      this.textFromMic = "";
      if (onFinalised) {
        onFinalised(text);
      }
    };
    this.onAnythingSaid = text => {
      let match = text.match(iterRegex);
      if (match) {
        const lastWord = match[0].split(' ')[0];
        if (this.lastWord !== lastWord) {
          onWord(lastWord);
          this.lastWord = lastWord
        }
      }

      console.log(`Interim text: ${text}`);
      this.textFromMic = text;
      if (onAnythingSaid)
        onAnythingSaid(text);
    };
  }

  onEndReplaced = () => {
    console.log("onEndReplaced called");
    if (!this.stopped) {
      console.log("stopped unexpectedly, restarting listener");
      this.startRecord();
    }
  }

  createNewListener = () => {
    this.listener =
      new SpeechToText(
        this.onFinalised,
        this.onAnythingSaid);
    this.listener.recognition.onend = this.onEndReplaced;
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
