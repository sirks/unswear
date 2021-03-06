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
const WORD_AGE = 5;

class App extends Component {
  constructor() {
    super();

    this.state = {
      level: 0,
    };

    this.greeted = false;
    this.text2Speech = new Text2Speech();
    this.toxicity = new Toxicity();
    this.speechRecorder = new SpeechRecorder(
      this.onWord,
    );
		this.wordTimes = {}
  }

  onWord = async (lastWord) => {
    const now = new Date().getTime();
    if(!!this.wordTimes['lastWord'] && now-this.wordTimes['lastWord']<WORD_AGE){
      return;
    }
    let {wordScore, totalScore} = await this.toxicity.addWord(lastWord);
    console.log(lastWord, wordScore, totalScore);
    if(wordScore < TOXIC_THRESHOLD){
    	return;
		}
		this.wordTimes['lastWord']=now;
		const sysnonym = await getSynonym(lastWord);
		if (sysnonym) {
			this.text2Speech.speak(lastWord, `better say ${sysnonym}`);
      this.wordTimes['lastWord']=now;
		}
    this.setState({level: totalScore})
  };

  toggleRecord = () => {
    if (!this.greeted) {
      this.text2Speech.speak('greeting1', 'Hi');
      this.text2Speech.speak('greeting2', 'Call me Fred. I help you unswear.');
      this.greeted = true;
    }
    if (this.state.recording) {
      this.speechRecorder.stopRecord();
    } else {
      this.speechRecorder.startRecord();
    }
    this.setState({recording: !this.state.recording});
  };

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
