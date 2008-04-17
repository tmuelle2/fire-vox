google.load("language", "1");


var sourceLang = null;
var destLang = null;
var autoDetectPriority = true;


var waitingForTL = false;
var forcedTL = false;

var tlStr = "";

var tenthsPassed = 0;


function displayTranslation(result){
  var tlNode = _gel('translation');
  tlNode.innerHTML = result.translation;
};


function getTranslation(){
  var snapshot = tlStr;
  if  (autoDetectPriority){
    google.language.translate(snapshot, "", destLang,
                            function(result){
                              if(_gel('original').value == snapshot){
                                displayTranslation(result);
                              }
                            } );
  } else {
    google.language.translate(snapshot, sourceLang, destLang,
                            function(result){
                              if(_gel('original').value == snapshot){
                                displayTranslation(result);
                              }
                            } );
  }
};


function tlMonitor(){
  if (!waitingForTL){
    tenthsPassed += 1;
  }
  if (tenthsPassed >= 10){
    if (tlStr != _gel('original').value){
      tlStr = _gel('original').value;
      getTranslation();
      tenthsPassed = 0;
    }
  }
  window.setTimeout(tlMonitor,100);
};

function keypressMonitor(evt){
  tenthsPassed = 0;
  return true;
};

function init(){
  var prefs = new _IG_Prefs();
  sourceLang = prefs.getString("Source_Language");
  destLang = prefs.getString("Target_Language");
  autoDetectPriority = prefs.getBool("Give_autodetect_priority");
  tlMonitor();
};

google.setOnLoadCallback(init);
_gel('original').addEventListener('keypress', keypressMonitor, true);