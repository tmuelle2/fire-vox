//Copyright (C) 2008 Google Inc.
//CLC-4-TTS Firefox Extension:
//Core Library Components for Text-To-Speech for Firefox
//Special functions for dealing with Mac Local TTS Server quirks
//by Charles L. Chen

 
//This program is free software; you can redistribute it
//and/or modify it under the terms of the GNU General Public
//License as published by the Free Software Foundation;
//either version 2.1 of the License, or (at your option) any
//later version.  This program is distributed in the hope
//that it will be useful, but WITHOUT ANY WARRANTY; without
//even the implied warranty of MERCHANTABILITY or FITNESS FOR
//A PARTICULAR PURPOSE. See the GNU General Public License for
//more details.  You should have received a copy of the GNU
//General Public License along with this program; if not, look
//on the web at on the web at http://www.gnu.org/copyleft/gpl.html
//or write to the Free Software Foundation, Inc., 59 Temple Place,
//Suite 330, Boston, MA 02111-1307, USA.
 

//Last Modified Date 1/7/2008


//------------------------------------------
//
//
function CLC_MacTTS_SanitizeInput(targetStr){
  targetStr = targetStr.replace("#"," ");
  return targetStr;
  }

function CLC_MacTTS_InitLocalTTSServer(){
  //Find the TTS executable
  const id = "{7529D455-3392-4a17-A489-0C737D1DBAC0}";
  var extensionPath = Components.classes["@mozilla.org/extensions/manager;1"].getService(Components.interfaces.nsIExtensionManager).getInstallLocation(id).getItemLocation(id).path;
  var macTTSFile = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
  macTTSFile.initWithPath(extensionPath);
  macTTSFile.append("components");
  macTTSFile.append("MacTTS");
  macTTSFile.append("Contents");
  macTTSFile.append("MacOS");
  macTTSFile.append("tts");

  //Make sure the TTS is executable
  CLC_MacTTS_MakeExecutable(macTTSFile.path);

  // create an nsIProcess
  var process = Components.classes["@mozilla.org/process/util;1"].createInstance(Components.interfaces.nsIProcess);
  process.init(macTTSFile);

  // Run the process.
  // If first param is true, calling thread will be blocked until
  // called process terminates.
  // Second and third params are used to pass command-line arguments
  // to the process.
  var args = [CLC_MACTTS_PORT];
  process.run(false, args, args.length);
  }

function CLC_MacTTS_MakeExecutable(targetFilePath){
  var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);	
  file.initWithPath("/");
  file.append("bin");
  file.append("chmod");
  var process = Components.classes["@mozilla.org/process/util;1"].createInstance(Components.interfaces.nsIProcess);
  process.init(file);
  var argv = ["0755",targetFilePath];
  process.run(true, argv, argv.length);	
  }




function CLC_MacTTS_ProcessSpeechQueue(){
  CLC_MACTTS_PROCESSINGQUEUE = true;
  if (CLC_MACTTS_SPEECHQUEUE.length == 0){
    CLC_MACTTS_PROCESSINGQUEUE = false;
    return;
    }  
  if (CLC_MacTTS_ServerReady()){
    var message = CLC_MACTTS_SPEECHQUEUE.shift();
    CLC_MacTTS_SendToTTS(message);
    }
  window.setTimeout("CLC_MacTTS_ProcessSpeechQueue();",100);
  }

function CLC_MacTTS_SendToTTS(speechStr){
  speechStr = CLC_MacTTS_SanitizeInput(speechStr);
  CLC_MACTTS_OBJ.abort();
  CLC_MACTTS_OBJ.overrideMimeType('text/xml');
  CLC_MACTTS_OBJ.open('GET', "http://127.0.0.1:" + CLC_MACTTS_PORT + "/" + speechStr, true);
  CLC_MACTTS_OBJ.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  CLC_MACTTS_OBJ.send("");
  }

function CLC_MacTTS_ServerReady(){
  if (CLC_MACTTS_CheckingReadyStatus){
    return false;
    }
  CLC_MACTTS_CheckingReadyStatus = true;
  CLC_MACTTS_OBJ.abort();
  CLC_MACTTS_OBJ.overrideMimeType('text/xml');
  CLC_MACTTS_OBJ.open('GET', "http://127.0.0.1:" + CLC_MACTTS_PORT + "/", false);
  CLC_MACTTS_OBJ.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  CLC_MACTTS_OBJ.send("");
  if (CLC_MACTTS_OBJ.responseText && CLC_MACTTS_OBJ.responseText.toLowerCase() == "false"){
    CLC_MACTTS_CheckingReadyStatus = false;
    return true;
    }
  CLC_MACTTS_CheckingReadyStatus = false;
  return false;
  }