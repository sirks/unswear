import React, { Component } from 'react';
import * as tf from '@tensorflow/tfjs';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor() {
    super();

    this.state = {
      model: null,
    };

    this.loadModel();
  }

  async loadModel() {
    let loadedModel = await tf.loadModel(process.env.PUBLIC_URL + '/model.json');
    this.setState({model: loadedModel});
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
