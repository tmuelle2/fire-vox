var CVoxTts = function(ttsEngine){
  this.engine = ttsEngine;
}


CVoxTts.prototype.speak = function(textString, queueMode, propertiesArray){
  this.engine.speak(textString, queueMode, propertiesArray);
}


CVoxTts.prototype.isSpeaking = function(){
  return this.engine.isSpeaking();
}


CVoxTts.prototype.stop = function(){
  this.engine.stop();
}