var CVOX_BASEURL = ''

function loadCVox(){
  //Load the debug TTS engine
  var theScript = document.createElement('script');
  theScript.type = 'text/javascript';
  theScript.src = CVOX_BASEURL + 'cvox_debug.js'
  document.getElementsByTagName('head')[0].appendChild(theScript);

  //Load the TTS
  theScript = document.createElement('script');
  theScript.type = 'text/javascript';
  theScript.src = CVOX_BASEURL + 'cvox_tts.js'
  document.getElementsByTagName('head')[0].appendChild(theScript);
}

loadCVox();


function debug(){
// Run some test code here
var myDebug = new CVoxDebug();
var myTts = new CVoxTts(myDebug);
myTts.speak("hello world", 0, null);
alert(myDebug.getLog()[0]);
}

window.setTimeout(debug, 100);