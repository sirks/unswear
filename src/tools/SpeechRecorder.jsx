import SpeechToText from 'speech-to-text';

class SpeechRecorder {
  constructor(onFinalised, onAnythingSaid) {
    this.constraints = {audio: true, video: false};
    this.listener = null;
    this.stopped = true;

    this.state = {
      textFromMic: "",
      allText: ""
    };

    console.log(onFinalised)
    console.log(onAnythingSaid)

    this.onFinalised = text => {
      console.log(`Finalised text: ${text}`);
      this.setState({
        allText: this.state.allText + text + ". ",
        textFromMic: ""
      });

      if (onFinalised)
        onFinalised(text);
    };
    this.onAnythingSaid = text => {
      console.log(`Interim text: ${text}`);
      this.setState({textFromMic: text});
      if (onAnythingSaid)
        onAnythingSaid(text);
    };
  }

  onEndReplaced = () => {
    console.log("onEndReplaced called");
    if (!this.stopped) {
      console.log("stopped unexpectedly, restarting listener");
      this.onBtnRecordClicked();
    }
  }

  createNewListener = () => {
    this.listener =
      new SpeechToText(
        this.onFinalised,
        this.onAnythingSaid);
    this.listener.recognition.onend = this.onEndReplaced;
  }

  onBtnRecordClicked = () => {
    console.log("start clicked");
    this.stopped = false;
    this.createNewListener();
    this.listener.startListening();
    console.log(this.state.listener);
  }

  onBtnStopClicked = () => {
    console.log("stop clicked");
    this.stopped = true;
    this.listener.stopListening();
  }
}

export default SpeechRecorder;
