import React, {Component} from 'react';
//import * as speech from '@google-cloud/speech'; // Imports the Google Cloud client library
//import gapi from 'gapi-client';
import SpeechToText from 'speech-to-text';

class SpeechRecorder extends Component {

  constructor() {
    super();
    this.constraints = {audio: true, video: false};
    this.state = {listener: null, isStarted: false, textFromMic: "", allText: ""};

    //listener.recognition.onend = this.onEndReplaced;
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
    this.onBtnRecordClicked();
    console.log("onEndReplaced called");
  }

  createNewListener = () => {
    const listener = new SpeechToText(this.onFinalised, this.onAnythingSaid);
    this.setState({listener: listener});
    return listener;
  }

  onBtnRecordClicked = () => {
    console.log("start clicked");
    const listener = this.createNewListener();
    listener.startListening();
    console.log(this.state.listener);
    //
    // if (this.state.isStarted) {
    //   this.state.listener.restart();
    //   console.log('should restart? ' + this.state.listener.shouldRestart)
    // }
    // else {
    //   this.state.listener.startListening();
    //   this.setState({isStarted: true});
    //   console.log('should restart? ' + this.state.listener.shouldRestart)
    // }
  }

  onBtnStopClicked = () => {
    console.log("stop clicked");
    this.state.listener.stopListening();
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

  componentDidMount() {
    navigator.mediaDevices.getUserMedia(this.constraints)
    .then(stream => this.setState({stream}))
  }
}


export default SpeechRecorder;