import React, {Component} from 'react';
import * as tf from '@tensorflow/tfjs';
import './App.css';
import Text2Speech from './tools/Text2Speech';
import * as rp from 'request-promise-native';

class App extends Component {
  constructor() {
    super();

    this.initData = [
      0, //toxic
      0, //severe toxic
      0, //obscene
      0, //threat
      0, //insult
      0, //identity hate
    ];
    this.vocab = null;

    this.state = {
      text: '',
      model: null,
      data: this.initData,
    };

    this.loadModel();

    let greeting = 'Me Fred. Me help you unswear';
    this.text2Speech = new Text2Speech();
    this.text2Speech.speak(greeting);

    Promise.all([this.loadVocab(), this.loadModel()])
      .then(
        (value) => { this.calculate(this.state.text); },
        (reason) => {});
  }

  loadVocab = async () => {
    let uri = document.location.href + '/vocab.json';

    let options = {
      uri: uri,
      json: true,
    };

    this.vocab = await rp.get(options);

    return;
  }

  loadModel = async () => {
    let loadedModel = await tf.loadModel(process.env.PUBLIC_URL + '/model.json');
    this.setState({model: loadedModel});

    return;
  }

  calculate = async (text) => {
    let data = this.initData;

    if (text && this.state.model) {
      let tensorBuffer = tf.zeros([1, 100]).buffer();

      let words = text.split(' ');
      let wordIndex = 0;
      words.forEach((value) => {
        if (this.vocab.hasOwnProperty(value)) {
          tensorBuffer.set(this.vocab[value], 0, wordIndex);
          wordIndex++;
        }
      });

      data = await this.state.model.predict(tensorBuffer.toTensor()).data();
    }

    this.setState({data});
  }

  onChangeText = (event) => {
    let text = event.target.value;
    this.setState({text});

    if (text) {
      this.text2Speech.speak(text);
      this.calculate(text.toLowerCase());
    }
  };

  render() {
    return (
      <div className='App'>
        <input type='text' onBlur={this.onChangeText}/>
      </div>
    );
  }
}

export default App;
