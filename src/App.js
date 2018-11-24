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
    const options = {
      uri: document.location.href + '/vocab.json',
      json: true,
    };

    this.vocab = await rp.get(options);

    return;
  }

  loadModel = async () => {
    const loadedModel = await tf.loadModel(process.env.PUBLIC_URL + '/model.json');
    this.setState({model: loadedModel});

    return;
  }

  calculate = async (text) => {
    let data = this.initData;

    if (text && this.state.model) {
      const tensorBuffer = tf.zeros([1, 100]).buffer();

      const words = text.split(' ');
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
    const text = event.target.value;
    this.setState({text});

    if (text) {
      this.text2Speech.speak(text);
    }
    if (text !== undefined && text !== null && text !== this.state.text) {
      this.calculate(text.toLowerCase());
    }
  };

  renderScore = (score) => {
    return (Math.round(score * 1000) / 10) + '%';
  }

  ScoreList = ({data}) => {
    return (
      <div className="results">
        <div><span>toxic {this.renderScore(data[0])}</span></div>
        <div><span>severe toxic {this.renderScore(data[1])}</span></div>
        <div><span>obscene {this.renderScore(data[2])}</span></div>
        <div><span>threat {this.renderScore(data[3])}</span></div>
        <div><span>insult {this.renderScore(data[4])}</span></div>
        <div><span>identity hate {this.renderScore(data[5])}</span></div>
      </div>
    );
  }

  render() {
    return (
      <div className='App'>
        <this.ScoreList data={this.state.data} />
        <input type='text' onBlur={this.onChangeText}/>
      </div>
    );
  }
}

export default App;
