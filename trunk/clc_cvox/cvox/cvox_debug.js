var CVoxDebug = function(){
  this.debugLog = new Array();
};


CVoxDebug.prototype.speak = function(textString, queueMode, propertiesArray){
  if (propertiesArray){
    this.log(textString + ", " + queueMode + ", " + propertiesArray.toString());
  } else {
    this.log(textString + ", " + queueMode);
  }
};

CVoxDebug.prototype.isSpeaking = function(){
  return false;
};

CVoxDebug.prototype.stop = function(){
  this.log("STOP CALLED!");
};

CVoxDebug.prototype.log = function(msgString){
  this.debugLog.push(msgString);
};

CVoxDebug.prototype.getLog = function(){
  return this.debugLog;
};

CVoxDebug.prototype.resetLog = function(){
  this.debugLog = new Array();
};