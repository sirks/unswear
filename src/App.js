import React, {Component} from 'react';
import './App.css';
import Text2Speech from './tools/Text2Speech';
import Toxicity from "./tools/Toxicity";
import {getRightWord} from './tools/thesaurus';

class App extends Component {
  constructor() {
    super();

    let greeting = 'Hi. I am Fred. Prepare your prayers to get unsweared';
    this.text2Speech = new Text2Speech();
    this.text2Speech.speak(greeting);

    this.toxicity = new Toxicity();
  }

  onChangeText = async (event) => {
    const text = ' ' + event.target.value;
    if (!text.endsWith(' ')) {
      return;
    }
    const regex = / ([a-z]|[A-Z])+ $/g;
    const lastWord = text.match(regex)[0].trim();
    let {wordScore, totalScore} = await this.toxicity.addWord(lastWord);
    if (wordScore > 0.5) {
      debugger;
      this.text2Speech.speak(lastWord);
    }
    if (totalScore > 0.1) {
      debugger;
      this.text2Speech.speak("bugger");
    }

  someWord = async () => console.log(await getRightWord('pie'));

  render(){
      return (
        <div className='App'>
          <input type='text' onChange={this.onChangeText}/>
          <SpeechRecorder/>
        </div>
      );
    }
}

export default App;