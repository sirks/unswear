import React, {Component} from 'react';
import SpeechToText from 'speech-to-text';
import mic from "../assets/mic.png";


class SpeechRecorder extends Component {

  constructor() {
    super();
    this.constraints = {audio: true, video: false};
    this.state = {isStarted: false, textFromMic: "", allText: "", start:true, stop:false};
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
    this.setState({start:false, stop:true});
    console.log(this.state.listener);
  }

  onBtnStopClicked = () => {
    console.log("stop clicked");
    this.stopped = true;
    this.listener.stopListening();
    this.setState({start:true, stop:false});
  }

  render() {
    return (
      <div className='App'>
        <audio>placeholder for audio</audio>
        <div className={this.state.stop ? "mic-container visible" : "mic-container invisible"}>
          <img src={mic} alt="" />
        </div>
        <button className= {this.state.start ? "button-start visible" : "button-start invisible"} onClick={this.onBtnRecordClicked}>Start</button>
        <button className= {this.state.stop ? "button-stop visible" : "button-stop invisible"} onClick={this.onBtnStopClicked}>Stop</button>
        <div>{this.state.allText} {this.state.textFromMic}</div>
      </div>

    );
  }
}

export default SpeechRecorder;
