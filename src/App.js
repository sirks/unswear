import React, {Component} from "react";
import "./App.css";
import mic from "./assets/mic.png";
import logo from "./assets/logo.png";
import Text2Speech from "./tools/Text2Speech";
import Toxicity from "./tools/Toxicity";
import {getSynonym} from "./tools/thesaurus";
import SpeechRecorder from "./tools/SpeechRecorder";
import Speedometer from "./components/Speedometer";

const TOXIC_THRESHOLD = 0.25;

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

    this.toxicity = new Toxicity();

    this.speechRecorder = new SpeechRecorder(
      this.onWord,
    );
  }

  onWord = async (lastWord) => {
    let {wordScore, totalScore} = await this.toxicity.addWord(lastWord);
    console.log(lastWord, wordScore, totalScore);
    if (wordScore > TOXIC_THRESHOLD) {
      this.text2Speech.speak(await getSynonym(lastWord));
    }
    this.setState({level: totalScore})
  };

  onChangeText = async (event) => {
    const text = event.target.value;
    if (!text.endsWith(' ')) {
      return;
    }
    const regex = / ?([a-z]|[A-Z])+ $/g;
    const lastWord = text.match(regex)[0].trim();
    await this.onWord(lastWord);
  };

  toggleRecord = () => {
    if (this.state.recording) {
      this.speechRecorder.stopRecord();
    } else {
      this.speechRecorder.startRecord();
    }
    this.setState({recording: !this.state.recording});
  };

  onSentence = async (sentence) => {
    let {wordScore, totalScore} = await this.toxicity.addWord(sentence);
    console.log(wordScore, totalScore);
    this.setState({level: totalScore})
  };

  // onLastWord = async (word) => {
  //   console.log(word);
  //   let wordScore = await this.toxicity.testWord(word);
  //   if (wordScore > TOXIC_THRESHOLD) {
  //     this.text2Speech.speak(await getSynonym(word));
  //   }
  // };

  render() {
    const buttonText = this.state.recording ? "Stop" : "Start";
    const buttonClass = this.state.recording ? "button-stop" : "button-start";
    const micClass = this.state.recording ? "mic-container visible" : "mic-container invisible";
    return (
      <div className='App'>
        <div className="logo-container">
          <img src={logo} alt=""/>
        </div>
        <Speedometer level={this.state.level}/>
        <div className={micClass}>
          <img src={mic} alt=""/>
        </div>
        <button className={buttonClass} onClick={this.toggleRecord}>{buttonText}</button>
      </div>
    );
  }
}

export default App;
