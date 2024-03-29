import React, {Component} from 'react';
import * as tf from '@tensorflow/tfjs';
import {throttle} from 'lodash';

const renderScore = (score) => {
  return (Math.round(score * 1000) / 10) + '%';
};

const ToxicityScoresRender = ({data}) => {
  return (
    <div className="results">
      <div><span>toxic {renderScore(data[0])}</span></div>
      <div><span>severe toxic {renderScore(data[1])}</span></div>
      <div><span>obscene {renderScore(data[2])}</span></div>
      <div><span>threat {renderScore(data[3])}</span></div>
      <div><span>insult {renderScore(data[4])}</span></div>
      <div><span>identity hate {renderScore(data[5])}</span></div>
    </div>
  );
};

const initData = [
  0, //toxic
  0, //severe toxic
  0, //obscene
  0, //threat
  0, //insult
  0, //identity hate
];

const chunk = (array, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize)
    chunks.push(array.slice(i, i + chunkSize));
  return chunks;
};

class ToxicityScores extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: initData,
      chunkSize: props.chunkSize,
      chunkResults: [],
    };

    this.calculate = throttle(this.calculate, 150);
    this.chunkedCalculate = throttle(this.chunkedCalculate, 150);
  }

  calculate = async (text) => {
    let data = initData;
    const model = this.props.model;
    const vocab = this.props.vocab;

    if (text && model && vocab) {
      const tensorBuffer = tf.zeros([1, 100]).buffer();

      const words = text.trim().split(' ');
      let wordIndex = 0;
      words.forEach((value) => {
        if (vocab.hasOwnProperty(value)) {
          tensorBuffer.set(vocab[value], 0, wordIndex);
          wordIndex++;
        }
      });

      data = await model.predict(tensorBuffer.toTensor()).data();
    }

    this.setState({data});
  }

  chunkedCalculate = async (text) => {
    const model = this.props.model;
    const vocab = this.props.vocab;

    if (text && model && vocab) {
      const tensorBuffer = tf.zeros([1, 100]).buffer();

      const skipWords = Math.max(0, this.state.chunkResults.length - 1) * this.state.chunkSize;
      const newWords = text.trim().split(' ').slice(skipWords);

      const chunkPromises = chunk(newWords, this.state.chunkSize).map(async (words) => {
        let wordIndex = 0;
        words.forEach((value) => {
          if (vocab.hasOwnProperty(value)) {
            tensorBuffer.set(vocab[value], 0, wordIndex);
            wordIndex++;
          }
        });

        return await model.predict(tensorBuffer.toTensor()).data();
      });

      const newResults = await Promise.all(chunkPromises);
      const chunkResults = this.state.chunkResults.slice(0, -1).concat(newResults);

      const data =
        chunkResults
          .reduce((acc, results) => acc.map((e, i) => { return e + results[i]; }), initData)
          .map((e) => e / chunkResults.length);

      this.setState({
        chunkResults,
        data,
      });
    };
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.text !== prevProps.text) {
      if (this.state.chunkSize > 0) {
        this.chunkedCalculate(this.props.text);
      } else {
        this.calculate(this.props.text);
      }
      // Flush on new words
      if (this.props.text.split(' ').length !== prevProps.text.split(' ').length) {
        this.calculate.flush();
        this.chunkedCalculate.flush();
      }
    }
  }

  render() {
    return (
      <ToxicityScoresRender
        data={this.state.data}
      />
    );
  }
}

export default ToxicityScores;
