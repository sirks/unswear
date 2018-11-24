import React, {Component} from 'react';
import * as tf from '@tensorflow/tfjs';
import './App.css';
import Text2Speech from './tools/Text2Speech';
import * as rp from 'request-promise-native';

import ToxicityScores from './components/ToxicityScores';

class App extends Component {
  constructor() {
    super();

    this.state = {
      model: null,
      vocab: null,
      data: this.initData,
    };

    this.loadModel();

    let greeting = 'Me Fred. Me help you unswear';
    this.text2Speech = new Text2Speech();
    this.text2Speech.speak(greeting);

    this.initializeState();
  }

  initializeState = async () => {
    await Promise.all([this.loadVocab(), this.loadModel()]);
    return;
  };

  loadVocab = async () => {
    const options = {
      uri: document.location.href + '/vocab.json',
      json: true,
    };

    const vocab = await rp.get(options);
    this.setState({vocab});

    return;
  }

  loadModel = async () => {
    const loadedModel = await tf.loadModel(process.env.PUBLIC_URL + '/model.json');
    this.setState({model: loadedModel});

    return;
  }

  onBlurText = (event) => {
    if (event.target.value)
      this.text2Speech.speak(event.target.value);
  };

  onChangeText = (event) => {
    this.setState({text: event.target.value});
  };

  render() {
    const stateInitialized = this.state.model && this.state.vocab;
    return (
      <div className='App'>
        { stateInitialized ?
          <ToxicityScores
            model={this.state.model}
            vocab={this.state.vocab}
            text={this.state.text}
          /> :
          undefined }
        <input type='text' onBlur={this.onChangeText} onChange={this.onChangeText} />
      </div>
    );
  }
}

export default App;
