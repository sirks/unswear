import * as rp from 'request-promise-native';

async function getSynonym(swearWord) {
  const options = {
    uri: `https://tuna.thesaurus.com/relatedWords/${swearWord}?limit=9&offset=0`,
    json: true,
  };
  const resp = await rp.get(options);
  if (!resp.data) {
    return;
  }
  const allSynonyms = resp.data
  .flatMap(meaning => meaning.synonyms)
  .filter(synonym => synonym.term !== swearWord);
  const randomSynonym = allSynonyms[Math.floor(Math.random() * allSynonyms.length)];
  return randomSynonym.term
}

export {getSynonym};
