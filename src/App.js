import React, {Component} from 'react';
import * as tf from '@tensorflow/tfjs';
import logo from './logo.svg';
import './App.css';
import Text2Speech from './tools/Text2Speech'

class App extends Component {
  constructor() {
    super();

    this.state = {
      model: null,
    };

    this.loadModel();

    let greeting = 'Me Fred. Me help you unswear';
    this.text2Speech = new Text2Speech();
    this.text2Speech.speak(greeting);
  }

  async loadModel() {
    let loadedModel = await tf.loadModel(process.env.PUBLIC_URL + '/model.json');
    this.setState({model: loadedModel});
  }

  onChangeText = (event) => {
    let text = event.target.value;
    if (text) {
      this.text2Speech.speak(text);
    }
  };

  render() {
    return (
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo'/>
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className='App-link'
            href='https://reactjs.org'
            target='_blank'
            rel='noopener noreferrer'
          >
            Learn React
          </a>
        </header>
        <input type='text' onBlur={this.onChangeText}/>
      </div>
    );
  }
}

export default App;
