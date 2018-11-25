import * as rp from 'request-promise-native';

let knownSynonyms = {};

async function getSynonym(swearWord) {
  let allSynonyms = null;
  if (knownSynonyms.hasOwnProperty(swearWord)) {
    allSynonyms = knownSynonyms[swearWord]
  }
  else {
    const options = {
      uri: `https://tuna.thesaurus.com/relatedWords/${swearWord}?limit=9&offset=0`,
      json: true,
    };
    const resp = await rp.get(options);
    if (!resp.data) {
      return;
    }
    allSynonyms = resp.data
    .flatMap(meaning => meaning.synonyms)
    .filter(synonym => synonym.term !== swearWord);
    knownSynonyms[swearWord] = allSynonyms
  }

  const randomSynonym = allSynonyms[Math.floor(Math.random() * allSynonyms.length)];
  return randomSynonym.term
}

export {getSynonym};
