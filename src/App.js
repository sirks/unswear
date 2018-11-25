import React, {Component} from 'react';
import './App.css';
import Text2Speech from './tools/Text2Speech';
import Toxicity from "./tools/Toxicity";
import {getSynonym} from './tools/thesaurus';
import SpeechRecorder from "./tools/SpeechRecorder";
import Speedometer from "./components/Speedometer";


const TOXIC_THRESHOLD = 0.33;

class App extends Component {
  constructor() {
    super();

    this.state = {
      level: 0,
    };

    // let greeting = 'Hi. I am Fred. Prepare your prayers to get unsweared';
    let greeting = 'Hi';
    this.text2Speech = new Text2Speech();
    this.text2Speech.speak(greeting);

    this.recording = false;
    this.speechRecorder = new SpeechRecorder(
      console.log,
      console.log,
    );

    this.toxicity = new Toxicity();
  }

  onChangeText = async (event) => {
    const text = event.target.value;
    if (!text.endsWith(' ')) {
      return;
    }
    const regex = / ?([a-z]|[A-Z])+ $/g;
    const lastWord = text.match(regex)[0].trim();
    let {wordScore, totalScore} = await this.toxicity.addWord(lastWord);
    console.log(wordScore, totalScore);
    if (wordScore > TOXIC_THRESHOLD) {
      this.text2Speech.speak(await getSynonym(lastWord));
    }
    this.setState({level: totalScore});
  };

  toggleRecord = () => {
    if (this.recording) {
      this.recording = false;
      this.speechRecorder.stopRecord();
    } else {
      this.recording = true;
      this.speechRecorder.startRecord();
    }
  };

  render() {
    const buttonText = this.recording ? "Stop" : "Start";
    return (
      <div className='App'>
        <Speedometer level={this.state.level}/>
        <textarea onChange={this.onChangeText}/>
        <button onClick={this.toggleRecord}>{buttonText}</button>
      </div>
    );
  }
}

export default App;
