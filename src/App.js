import React, { Component } from "react";
import "./App.css";
import logo from "./assets/logo.png";
import Text2Speech from "./tools/Text2Speech";
import Toxicity from "./tools/Toxicity";
import { getSynonym } from "./tools/thesaurus";
import SpeechRecorder from "./tools/SpeechRecorder";
import Speedometer from "./components/Speedometer";

const TOXIC_THRESHOLD = 0.33;

class App extends Component {
  constructor() {
    super();

    this.state = {
      level: 0
    };

    // let greeting = 'Hi. I am Fred. Prepare your prayers to get unsweared';
    let greeting = "Hi";
    this.text2Speech = new Text2Speech();
    this.text2Speech.speak(greeting);

    this.recording = false;
    this.speechRecorder = new SpeechRecorder(
      async (text) => {
        const promises = text.trim().split(' ').map(this.processWord);
        await Promise.all(promises);
      },
      console.log,
    );

    this.toxicity = new Toxicity();
  }

  processWord = async (word) => {
    let {wordScore, totalScore} = await this.toxicity.addWord(word);
    console.log(wordScore, totalScore);
    if (wordScore > TOXIC_THRESHOLD) {
      this.text2Speech.speak(await getSynonym(word));
    }
    this.setState({level: totalScore});
  }

  onChangeText = async (event) => {
    const text = event.target.value;
    if (!text.endsWith(' ')) {
      return;
    }
    const regex = / ?([a-z]|[A-Z])+ $/g;
    const lastWord = text.match(regex)[0].trim();
    this.processWord(lastWord);
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
        <div className="logo-container">
          <img src={logo} alt="" />
        </div>
        <Speedometer level={this.state.level}/>
        <div className="form">
          <textarea onChange={this.onChangeText}/>
          <button onClick={this.toggleRecord}>{buttonText}</button>
        </div>
      </div>
    );
  }
}

export default App;
