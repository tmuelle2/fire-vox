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
 

//Last Modified Date 6/13/2008


//------------------------------------------
//
//
function CLC_MacTTS_SanitizeInput(targetStr){
  targetStr = targetStr.replace("#"," ");
  targetStr = targetStr.replace("["," ");
  targetStr = targetStr.replace("]"," ");
  return targetStr;
  }

//------------------------------------------
//
//
function CLC_MacTTS_InitLocalTTSServer(){
  //Don't bother initializing if the TTS is already up
  try {
    CLC_MacTTS_ServerReady();
    return; //Return if Mac TTS already running
    }
  catch (err) { } //Will receive an error if it is not running yet

  if (CLC_MACTTS_USEOLDTTS){
    CLC_MacTTS_InitOldTTS();
    } else {
    //Use the Leopard TTS server if at all possible
    CLC_MacTTS_InitLeopardTTS();
    }
  }

//------------------------------------------
//
//
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


//------------------------------------------
//
//
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

//------------------------------------------
//
//
function CLC_MacTTS_SendToTTS(speechStr){
  CLC_MACTTS_OBJ.abort();
  CLC_MACTTS_OBJ.overrideMimeType('text/xml');
  CLC_MACTTS_OBJ.open('GET', "http://127.0.0.1:" + CLC_MACTTS_PORT + "/" + speechStr, true);
  CLC_MACTTS_OBJ.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  CLC_MACTTS_OBJ.send("");
  }

//------------------------------------------
//
//
function CLC_MacTTS_ServerReady(){
  if (CLC_MACTTS_CheckingReadyStatus){
    return false;
    }
  CLC_MACTTS_CheckingReadyStatus = true;
  CLC_MACTTS_CHECKER.abort();
  CLC_MACTTS_CHECKER.overrideMimeType('text/xml');
  CLC_MACTTS_CHECKER.open('GET', "http://127.0.0.1:" + CLC_MACTTS_PORT + "/", false);
  CLC_MACTTS_CHECKER.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  CLC_MACTTS_CHECKER.send("");
  if (CLC_MACTTS_CHECKER.responseText && CLC_MACTTS_CHECKER.responseText.toLowerCase() == "<false/>"){
    CLC_MACTTS_CheckingReadyStatus = false;
    return true;
    }
  CLC_MACTTS_CheckingReadyStatus = false;
  return false;
  }

//------------------------------------------
// Use the Leopard TTS server if possible as  
// this does not have the "chipmunking" problem.
//
function CLC_MacTTS_InitLeopardTTS(){
  //Find the TTS executable
  const id = "{7529D455-3392-4a17-A489-0C737D1DBAC0}";
  var extensionPath = Components.classes["@mozilla.org/extensions/manager;1"].getService(Components.interfaces.nsIExtensionManager).getInstallLocation(id).getItemLocation(id).path;
  var macTTSFile = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
  macTTSFile.initWithPath(extensionPath);
  macTTSFile.append("components");
  macTTSFile.append("MacTTS_Leopard");
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

  //Sleep for one second 
  var thread = Components.classes["@mozilla.org/thread;1"].createInstance(Components.interfaces.nsIThread);
  thread.currentThread.sleep(1000);
  }

//------------------------------------------
// Fall back to the older, non-Leopard TTS server.
// This is recommended only as a last result as there
// is a known "chipmunking" problem when this server
// is used. Chipmunking is when the TTS starts raising
// its pitch until it reaches the maximum and sounds
// like a chipmunk talking. The problem is caused by
// an inability to bring the pitch level back down
// once it has gone up. 
//
// Pre-Leopard Mac OSX did not have the necessary 
// properties in the NSSpeechSynthesizer API to 
// reset the speech properties properly.
//
// This problem can be worked around by using "Brief Mode"
// in Fire Vox. However, it cannot be cleanly solved.
//
// To fix a chipmunked Mac, the user needs to choose a 
// new voice in the Mac system settings for speech,
// then switch back to the voice they want. This will
// reset the chipmunked voice, but it can still chipmunk
// again later on.
//
function CLC_MacTTS_InitOldTTS(){
  //Find the TTS executable
  const id = "{7529D455-3392-4a17-A489-0C737D1DBAC0}";
  var extensionPath = Components.classes["@mozilla.org/extensions/manager;1"].getService(Components.interfaces.nsIExtensionManager).getInstallLocation(id).getItemLocation(id).path;
  var macTTSFile = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
  macTTSFile.initWithPath(extensionPath);
  macTTSFile.append("components");
  macTTSFile.append("MacTTS_Old");
  macTTSFile.append("Contents");
  macTTSFile.append("MacOS");
  macTTSFile.append("old_tts");

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

  //Sleep for one second 
  var thread = Components.classes["@mozilla.org/thread;1"].createInstance(Components.interfaces.nsIThread);
  thread.currentThread.sleep(1000);
  }



