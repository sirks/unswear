import SpeechToText from 'speech-to-text';

class SpeechRecorder {
  constructor(onFinalised, onAnythingSaid) {
    this.constraints = {audio: true, video: false};
    this.listener = null;
    this.stopped = true;

    this.textFromMic = "";
    this.allText = "";

    this.onFinalised = text => {
      console.log(`Finalised text: ${text}`);

      this.allText = this.allText + text + ". ";
      this.textFromMic = "";

      if (onFinalised)
        onFinalised(text);
    };
    this.onAnythingSaid = text => {
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
