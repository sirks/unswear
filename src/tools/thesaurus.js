import * as rp from 'request-promise-native';

async function getRightWord(swearWord){
  let i = 0;
  while (i < 5){
    const options = {
      uri: `https://tuna.thesaurus.com/relatedWords/${swearWord}?limit=1&offset=${i}`,
      json: true,
    };
    debugger;
    const resp = await rp.get(options);
    debugger;
    if (!resp.data){
      return;
    }
    else {
      for (let synonym of resp.data[0].synonyms){
      if (synonym.similarity==='100'){
        return synonym.targetTerm;
      }
      }
    }
    i++;
  }
}

export { getRightWord };
