const synth = window.speechSynthesis;
const utterance = new SpeechSynthesisUtterance();
utterance.onend = () => console.log('speaking finished');
utterance.onerror = () => console.error('speaking error');
utterance.pitch = 1;
utterance.rate = 1;
utterance.volume = 1;
utterance.voice = synth.getVoices().find((voice) => voice.name === 'Fred');

const inputTxt = document.querySelector('.txt');
const playBtn = document.querySelector('button#play');
playBtn.onclick = () => speak(inputTxt.value);

function speak(text) {
  if (synth.speaking) {
    console.error('speechSynthesis.speaking');
    return;
  }
  if (!text) {
    return;
  }
  utterance.text = text;
  synth.speak(utterance);
}

