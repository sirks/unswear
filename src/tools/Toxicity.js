import * as tf from '@tensorflow/tfjs';
import * as rp from "request-promise-native";


class Toxicity {
  constructor() {
    this.totalScore = 0;
    this.wordCount = 0;

    this.vocabulary = null;
    this.model = null;
    this.load();
  }

  async load() {
    await Promise.all([this.loadVocabulary(), this.loadModel()]);
  }

  async loadVocabulary() {
    const options = {
      uri: document.location.href + '/vocab.json',
      json: true,
    };

    this.vocabulary = await rp.get(options);
  };

  async loadModel() {
    this.model = await tf.loadModel(process.env.PUBLIC_URL + '/model.json');
  }

  ready() {
    return this.vocabulary && this.model;
  }

  async testWord(word) {
    const tensorBuffer = tf.zeros([1, 100]).buffer();
    if (this.vocabulary.hasOwnProperty(word)) {
      tensorBuffer.set(this.vocabulary[word], 0, 0);
    }
    return (await this.model.predict(tensorBuffer.toTensor()).data())[0];
  }

  async addWord(word) {
    let wordScore = await this.testWord(word);
    this.totalScore = (this.totalScore * this.wordCount + wordScore) / ++this.wordCount;
    return {wordScore, totalScore: this.totalScore};
  }

  reset() {
    this.totalScore = 0;
    this.wordCount = 0;
  }

}

export default Toxicity;
