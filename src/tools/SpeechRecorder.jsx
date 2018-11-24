import React, {Component} from 'react';
import SpeechToText from 'speech-to-text';

class SpeechRecorder extends Component {

  constructor() {
    super();
    this.constraints = {audio: true, video: false};
    this.state = {isStarted: false, textFromMic: "", allText: ""};
    this.listener = null;
    this.stopped = true;
  }

  onFinalised = text => {
    console.log(`Finalised text: ${text}`);
    this.setState({allText: this.state.allText + text + ". ", textFromMic: ""});

  }
  onAnythingSaid = text => {
    console.log(`Interim text: ${text}`);
    this.setState({textFromMic: text});
  }

  onEndReplaced = () => {
    console.log("onEndReplaced called");
    if (!this.stopped) {
      console.log("restarting listener");
      this.onBtnRecordClicked();
    }
  }

  createNewListener = () => {
    this.listener = new SpeechToText(this.onFinalised, this.onAnythingSaid);
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

  render() {
    return (
      <div className='App'>
        <audio>placeholder for audio</audio>
        <button onClick={this.onBtnRecordClicked}>Start</button>
        <button onClick={this.onBtnStopClicked}>Stop</button>
        <div>{this.state.allText} {this.state.textFromMic}</div>
      </div>

    );
  }
}

export default SpeechRecorder;
