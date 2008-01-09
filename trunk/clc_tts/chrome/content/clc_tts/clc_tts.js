//CLC-4-TTS Firefox Extension:
//Core Library Components for Text-To-Speech for Firefox
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
 

//Last Modified Date 10/06/2007



//------------------------------------------

//Globals used by CLC-4-TTS
//These variables MUST NOT be touched by anyone using this library!
var CLC_TTS_ENGINE = 0;
var CLC_LANG = "en";
var CLC_SAPI5_OBJ;
var CLC_TTS_HISTORY_BUFFER;
var CLC_TTS_HISTORY_BUFFER_MAXSIZE;
var CLC_FREETTS_OBJ;
var CLC_FREETTS_SPEECHBUFFER;
var CLC_FREETTS_PITCHBUFFER;
var CLC_FREETTS_PROPERTYBUFFER;

var CLC_SAPI5_DefaultMiddle = 0;
var CLC_SAPI5_DefaultRate = 0;
var CLC_SAPI5_DefaultVolume = 100;
var CLC_FreeTTS_DefaultMiddle = 100;
var CLC_FreeTTS_DefaultRange = 35;
var CLC_FreeTTS_DefaultRate = 150;
var CLC_FreeTTS_DefaultVolume = 1.0;

var CLC_ORCA_OBJ;
var CLC_ORCA_URL = "http://127.0.0.1:20433";
var CLC_ORCA_CheckingReadyStatus = false;

var CLC_EMACSPEAK_OBJ;
var CLC_EMACSPEAK_URL = "http://127.0.0.1:2222";
var CLC_EMACSPEAK_CheckingReadyStatus = false;

var CLC_MACTTS_OBJ;
var CLC_MACTTS_CHECKER;
var CLC_MACTTS_PORT = "58384";
var CLC_MACTTS_CheckingReadyStatus = false;
var CLC_MACTTS_PROCESSINGQUEUE = false;
var CLC_MACTTS_SPEECHQUEUE;


//------------------------------------------

//The Text-To-Speech engine that will be used is determined by "engine."
//Currently, the following values are valid for "engine":
//   0 = No engine selected
//   1 = SAPI 5 Engine
//   2 = FreeTTS (Java based TTS)
//   3 = Orca (Linux only, HTTPRequest TTS)
//   4 = Emacspeak (Linux only, HTTPRequest TTS)
//   5 = Mac Local TTS Server (Mac only, HTTPRequest TTS)
//
//
//Returns true if initialized successfully; otherwise false.
//
function CLC_Init(engine) {
   if (CLC_TTS_ENGINE){
      CLC_Shutdown();  
      }
   if (engine == 1){
	try {
		netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
		const cid = "@mydomain.com/CLC_SAPI;1";
		CLC_SAPI5_OBJ = Components.classes[cid].createInstance();
		CLC_SAPI5_OBJ = CLC_SAPI5_OBJ.QueryInterface(Components.interfaces.ICLC_SAPI);
	} catch (err) {
        //Fail quietly to avoid a failure loop of error messages caused by trying to speak error alert boxes
	//	alert(err);
		return false;
	}    
	CLC_SAPI5_OBJ.Init();
        CLC_Make_TTS_History_Buffer(20);
        CLC_TTS_ENGINE = 1;
        return true;
        }
   if (engine == 2){
	try {
            //Obvious method of doing this:
            //CLC_FREETTS_OBJ = new Packages.CLC4TTS_Java();
            //fails on Linux. Therefore, do something unobvious...
            CLC_FREETTS_OBJ = CLC_FREETTS_CreateFreeTTSJavaObjectInstance();	
	} catch (err) {
          try {
              CLC_FREETTS_OBJ = new Packages.CLC4TTS_Java();
              } catch (err) {
                //Fail quietly to avoid a failure loop of error messages
                //caused by trying to speak error alert boxes
	        //alert(err);
		return false;
	        }    
           }
	CLC_FREETTS_OBJ.Init();
        CLC_Make_TTS_History_Buffer(20);
        CLC_TTS_ENGINE = 2;
        return true;
        }
   if (engine == 3){
	try {
                CLC_ORCA_CheckingReadyStatus = false;
                CLC_Orca_CleanUp();
		CLC_ORCA_OBJ = new XMLHttpRequest();
		CLC_ORCA_OBJ.overrideMimeType('text/xml');
                //Use the false flag since we do not do this asynchronously.
                //The goal here is to test for ORCA's existence... 
                //There will be an exception thrown if it does not exist.
		CLC_ORCA_OBJ.open('POST', CLC_ORCA_URL, false);
		CLC_ORCA_OBJ.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		CLC_ORCA_OBJ.send(null); 
	} catch (err) {
        //Fail quietly to avoid a failure loop of error messages caused by trying to speak error alert boxes
	//	alert(err);
		return false;
	}    
        CLC_Make_TTS_History_Buffer(20);
        CLC_TTS_ENGINE = 3;
        return true;
        }
   if (engine == 4){
	try {
                CLC_EMACSPEAK_CheckingReadyStatus = false;
                CLC_Emacspeak_CleanUp();
		CLC_EMACSPEAK_OBJ = new XMLHttpRequest();
		CLC_EMACSPEAK_OBJ.overrideMimeType('text/xml');
                //Use the false flag since we do not do this asynchronously.
                //The goal here is to test for ORCA's existence... 
                //There will be an exception thrown if it does not exist.
		CLC_EMACSPEAK_OBJ.open('POST', CLC_EMACSPEAK_URL, false);
		CLC_EMACSPEAK_OBJ.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		CLC_EMACSPEAK_OBJ.send(null); 
	} catch (err) {
        //Fail quietly to avoid a failure loop of error messages caused by trying to speak error alert boxes
	//	alert(err);
		return false;
	}    
        CLC_Make_TTS_History_Buffer(20);
        CLC_TTS_ENGINE = 4;
        return true;
        }
   if (engine == 5){
	try {
                CLC_MACTTS_OBJ = new XMLHttpRequest();
                CLC_MACTTS_CHECKER = new XMLHttpRequest();
                CLC_MACTTS_SPEECHQUEUE = new Array();
                CLC_MACTTS_CheckingReadyStatus = false;
                CLC_MACTTS_PROCESSINGQUEUE = false;
                CLC_MacTTS_InitLocalTTSServer();
                CLC_MacTTS_ServerReady();  //This call will fail if Mac TTS did not init properly
	} catch (err) {
        //Fail quietly to avoid a failure loop of error messages caused by trying to speak error alert boxes
	//	alert(err);
		return false;
	}    
        CLC_Make_TTS_History_Buffer(20);
        CLC_TTS_ENGINE = 5;
        return true;
        }
   CLC_TTS_ENGINE = 0;
   return false;   
   }


//------------------------------------------

//Shuts down the speech engine.
//This function is a NOOP; deallocation is automatically handled
//by Firefox so developers do NOT actually need to free any memory 
//themselves. In fact, manual deallocation can be dangerous since
//it may deallocate it when some other extension still needs it.
//
function CLC_Shutdown() {
   CLC_Interrupt();
   return;
   }

//------------------------------------------

//Allocates the space needed for the history buffer
//that stores the most recently read content objects.
//The default history buffer can store the 20 most
//recently read objects. 
//Calling this function will clear the buffer and the
//new size of the buffer will be "maxsize."
//
function CLC_Make_TTS_History_Buffer(maxsize){
   CLC_TTS_HISTORY_BUFFER_MAXSIZE = maxsize;
   CLC_TTS_HISTORY_BUFFER = new Array(CLC_TTS_HISTORY_BUFFER_MAXSIZE);
   }

//------------------------------------------

//Queries the speech engine to see if it is ready to speak.
//True == Ready to speak 
//False == Not ready to speak/Busy
//
function CLC_Ready() {
   if (CLC_TTS_ENGINE == 0){
      return false;
      }
   if (CLC_TTS_ENGINE == 1){
      return CLC_SAPI5_OBJ.ReadyToSpeak();
      }
   if (CLC_TTS_ENGINE == 2){
      return CLC_FREETTS_OBJ.ReadyToSpeak();
      }
   if (CLC_TTS_ENGINE == 3){
      if (CLC_ORCA_CheckingReadyStatus){
         return false;
         }
      CLC_ORCA_CheckingReadyStatus = true;
      CLC_Orca_CleanUp();
      CLC_ORCA_OBJ = new XMLHttpRequest();
      CLC_ORCA_OBJ.overrideMimeType('text/xml');
      CLC_ORCA_OBJ.open('POST', 'http://127.0.0.1:20433', false);
      CLC_ORCA_OBJ.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      CLC_ORCA_OBJ.send("isSpeaking");
      if (CLC_ORCA_OBJ.responseText && CLC_ORCA_OBJ.responseText.toLowerCase() == "false"){
         CLC_ORCA_CheckingReadyStatus = false;
         return true;
         }
      CLC_ORCA_CheckingReadyStatus = false;
      return false;
      }
   if (CLC_TTS_ENGINE == 4){
      return true; //Emacspeak cannot do "ready" reliably; always treat it as true for now.
      }
   if (CLC_TTS_ENGINE == 5){
      if (CLC_MACTTS_SPEECHQUEUE.length > 0){
        return false;
        }
      return CLC_MacTTS_ServerReady();
      }
   }

//------------------------------------------

//Interrupts the speech engine so that it stops speaking.
//
function CLC_Interrupt() {
   if (CLC_TTS_ENGINE == 0){
      return;
      }
   if (CLC_TTS_ENGINE == 1){
      CLC_SAPI5_OBJ.Stop();
      return;
      }
   if (CLC_TTS_ENGINE == 2){
      CLC_FREETTS_OBJ.Stop();
      return;
      }
   if (CLC_TTS_ENGINE == 3){
      CLC_Orca_Prep();
      CLC_ORCA_OBJ.send("stop"); 
      return;
      }
   if (CLC_TTS_ENGINE == 4){
      CLC_Emacspeak_Prep();
      CLC_EMACSPEAK_OBJ.send("stop"); 
      return;
      }
   if (CLC_TTS_ENGINE == 5){
      CLC_Shout("/",0); 
      return;
      }
   }

//------------------------------------------

//This function is intended to allow developers to
//make the speech engine say a message. Possible uses
//include (but are definitely not limited to) announcing
//events to the user and echoing back hotkey commands.
//
//Makes the speech engine say the "messagestring" 
//using the specified "pitch."
//
//"messagestring" is a text string.
//"pitch" can be any one of the following integer values:
//   -2 = very low
//   -1 = low
//    0 = normal
//    1 = high
//    2 = very high
//
//CLC_Say will NOT interrupt the currently spoken string.
//
function CLC_Say(messagestring, pitch) {
   if (CLC_TTS_ENGINE == 0){
      return;
      }
   if ((pitch > 2) || (pitch < -2)){
      alert("Invalid pitch");
      return;
      }
   if (CLC_TTS_ENGINE == 1){
      pitch = pitch * 5;
      messagestring = CLC_SAPI5_FixMessage(messagestring);
      var SAPI5_XML_STR = '<pitch middle="' + pitch + '">' + messagestring + '</pitch>';
      //Set language
      var langid = CLC_SAPI5_FindLangID(CLC_LANG);
      if (langid){
         SAPI5_XML_STR = '<lang langid="' + langid + '">' + SAPI5_XML_STR + '</lang>'; 
         }
      CLC_SAPI5_OBJ.Speak(SAPI5_XML_STR,1);
      }
   if (CLC_TTS_ENGINE == 2){
      pitch = (pitch * 25) + 100;      
      CLC_FREETTS_OBJ.Speak(messagestring, pitch, CLC_FreeTTS_DefaultRange, CLC_FreeTTS_DefaultRate, CLC_FreeTTS_DefaultVolume, "");
      }
   if (CLC_TTS_ENGINE == 3){
      //Orca cannot do pitch, just ignore that for now
      CLC_Orca_Prep();
      CLC_ORCA_OBJ.send("speak: " + messagestring);     
      }
   if (CLC_TTS_ENGINE == 4){
      //Emacspeak cannot do pitch, just ignore that for now
      CLC_Emacspeak_Prep();
      CLC_EMACSPEAK_OBJ.send("speak: " + messagestring);     
      }
   if (CLC_TTS_ENGINE == 5){
      //Put in speech queue management for Mac   
      CLC_MACTTS_SPEECHQUEUE.push(messagestring);
      if (!CLC_MACTTS_PROCESSINGQUEUE){
        CLC_MacTTS_ProcessSpeechQueue();
        }
      }
   }


//------------------------------------------

//This function is intended to allow developers to
//make the speech engine read content displayed within the 
//browser. The object that generated the string is stored
//to allow users to go back to the last object that was read.
//
//Makes the speech engine read the "contentstring" 
//using the specified "pitch." It also stores the "contentobject"
//in a history buffer of the most recently read objects.
//
//"messagestring" is a text string.
//"pitch" can be any one of the following integer values:
//   -2 = very low
//   -1 = low
//    0 = normal
//    1 = high
//    2 = very high
//"contentobject" should be the object on the page that generated the "contentstring"
//
//CLC_Read will NOT interrupt the currently spoken string.
//
function CLC_Read(contentobject, contentstring, pitch) {
   if (CLC_TTS_ENGINE == 0){
      return;
      }
   if ((pitch > 2) || (pitch < -2)){
      alert("Invalid pitch");
      return;
      }
   if (CLC_TTS_ENGINE == 1){
      pitch = pitch * 5;
      contentstring = CLC_SAPI5_FixMessage(contentstring);
      var SAPI5_XML_STR = '<pitch middle="' + pitch + '">' +  contentstring + '</pitch>';
      //Set language
      var langid = CLC_SAPI5_FindLangID(CLC_LANG);
      if (langid){
         SAPI5_XML_STR = '<lang langid="' + langid + '">' + SAPI5_XML_STR + '</lang>'; 
         }
      CLC_SAPI5_OBJ.Speak(SAPI5_XML_STR,1);
      }
   if (CLC_TTS_ENGINE == 2){
      pitch = (pitch * 25) + 100;      
      CLC_FREETTS_OBJ.Speak(contentstring, pitch, CLC_FreeTTS_DefaultRange, CLC_FreeTTS_DefaultRate, CLC_FreeTTS_DefaultVolume, "");
      }
   if (CLC_TTS_ENGINE == 3){
      //Orca cannot do pitch, just ignore that for now
      CLC_Orca_Prep();
      CLC_ORCA_OBJ.send("speak: " + contentstring);     
      }
   if (CLC_TTS_ENGINE == 4){
      //Emacspeak cannot do pitch, just ignore that for now
      CLC_Emacspeak_Prep();
      CLC_EMACSPEAK_OBJ.send("speak: " + contentstring);     
      }
   if (CLC_TTS_ENGINE == 5){
      CLC_Say(contentstring, pitch);     
      }
   for(var i = CLC_TTS_HISTORY_BUFFER_MAXSIZE; i > 1; i--){
      CLC_TTS_HISTORY_BUFFER[i-1] = CLC_TTS_HISTORY_BUFFER[i-2];
      } 
   CLC_TTS_HISTORY_BUFFER[0] = contentobject;
   }

//------------------------------------------

//Retrieves the ("i"+1)th content object that was most recently read
//
//Example: CLC_Recently_Read(0) will return the last object 
//         that was read while CLC_Recently_Read(1) will 
//         return the next to the last object that was read.
//
function CLC_Recently_Read(i){
   if ((i < 0) || (i > CLC_TTS_HISTORY_BUFFER_MAXSIZE - 1)){
      alert("Out of bounds of the Read History Buffer.");
      return;
      }
   return CLC_TTS_HISTORY_BUFFER[i];
   }

//------------------------------------------

//This function is intended to allow developers direct
//access to the SAPI 5 speak function and use strings
//that are formatted with SAPI 5 grammar.
//
//Since the SAPI 5 grammar is specifically for SAPI 5 and
//no other TTS engines, developers are advised to avoid using
//this function whenever possible because programs that use this
//function will not be portable to other TTS engines.
//
//"sapi5xmlstring" is a text string that is formatted with SAPI 5 XML tags.
//"speakflags" are as enumerated in the Microsoft SAPI 5.1 SDK documentation.
//
//Quoted from the Microsoft SAPI 5.1 SDK help file:
//typedef enum SPEAKFLAGS
//{
//    //--- SpVoice flags
//    SPF_DEFAULT,          
//    SPF_ASYNC,            
//    SPF_PURGEBEFORESPEAK, 
//    SPF_IS_FILENAME,      
//    SPF_IS_XML,           
//    SPF_IS_NOT_XML,       
//    SPF_PERSIST_XML,      
//
//    //--- Normalizer flags
//    SPF_NLP_SPEAK_PUNC,   
//
//    //--- Masks
//    SPF_NLP_MASK,        
//    SPF_VOICE_MASK,      
//    SPF_UNUSED_FLAGS     
//} SPEAKFLAGS;
//
//Note: Based on my experimentation, these flags are actually a bit enum.
//This means that it is not 0,1,2,3,4,5,... but rather 0,1,2,4,8,16,...
//
//So the first one SPF_DEFAULT has a value of 0,
//the second one SPF_ASYNC has a value of 1,
//the next one SPF_PURGEBEFORESPEAK has a value of 2,
//the next one SPF_IS_FILENAME has a value of 4,
//the next one SPF_IS_XML has a value of 8,
//the next one SPF_IS_NOT_XML has a value of 16, etc etc etc.
//
//To set multiple flags, add them together.
//(If you wanted async and to treat it as not XML, you would set it to 17.)
//
function CLC_SAPI5_Direct_Speak(sapi5xmlstring, speakflags) {
   if (CLC_TTS_ENGINE != 1){
      alert("Must use the SAPI 5 TTS engine to use the CLC_SAPI5_Direct_Speak function.");
      return;
      }
   CLC_SAPI5_OBJ.Speak(sapi5xmlstring,speakflags);
   }

//------------------------------------------

//This function is intended to allow developers to
//make the speech engine spell out a message. Possible uses
//include (but are definitely not limited to) clarifying
//a specific word if it is unclear when spoken normally and 
//for spelling out abbreivations
//
//Makes the speech engine spell the "messagestring" 
//using the specified "pitch."
//
//"messagestring" is a text string.
//"pitch" can be any one of the following integer values:
//   -2 = very low
//   -1 = low
//    0 = normal
//    1 = high
//    2 = very high
//
//CLC_Spell will NOT interrupt the currently spoken string.
//
function CLC_Spell(messagestring, pitch) {
   if (CLC_TTS_ENGINE == 0){
      return;
      }
   if ((pitch > 2) || (pitch < -2)){
      alert("Invalid pitch");
      return;
      }
   if (CLC_TTS_ENGINE == 1){
      pitch = pitch * 5;
      messagestring = CLC_SAPI5_FixMessage(messagestring);
      messagestring = CLC_SAPI5_ForceSpaceInSpell(messagestring);
      var SAPI5_XML_STR = '<rate absspeed="-3"><pitch middle="' + pitch + '"><spell>' + messagestring + '</spell></pitch></rate>';
      //Set language
      var langid = CLC_SAPI5_FindLangID(CLC_LANG);
      if (langid){
         SAPI5_XML_STR = '<lang langid="' + langid + '">' + SAPI5_XML_STR + '</lang>'; 
         }
      CLC_SAPI5_OBJ.Speak(SAPI5_XML_STR,1);
      }
   if (CLC_TTS_ENGINE == 2){
      messagestring = CLC_FREETTS_InsertSpaces(messagestring);
      pitch = (pitch * 25) + 100;      
      CLC_FREETTS_OBJ.Speak(messagestring, pitch, CLC_FreeTTS_DefaultRange, CLC_FreeTTS_DefaultRate, CLC_FreeTTS_DefaultVolume, "");
      }
   if (CLC_TTS_ENGINE == 3){
      //Orca cannot do pitch, just ignore that for now
      messagestring = CLC_FREETTS_InsertSpaces(messagestring);
      CLC_Orca_Prep();
      CLC_ORCA_OBJ.send("speak: " + messagestring);     
      }
   if (CLC_TTS_ENGINE == 4){
      //Emacspeak cannot do pitch, just ignore that for now
      messagestring = CLC_FREETTS_InsertSpaces(messagestring);
      CLC_Emacspeak_Prep();
      CLC_EMACSPEAK_OBJ.send("speak: " + messagestring);     
      }
   if (CLC_TTS_ENGINE == 5){
      messagestring = CLC_FREETTS_InsertSpaces(messagestring);      
      CLC_Say(messagestring, pitch);     
      }
   }


//------------------------------------------
//This function is intended to allow developers to
//make the speech engine say a message that has immediate
//priority over everything else. Possible uses
//include (but are definitely not limited to) announcing
//events to the user and echoing back hotkey commands.
//
//Makes the speech engine say the "messagestring" 
//using the specified "pitch."
//
//"messagestring" is a text string.
//"pitch" can be any one of the following integer values:
//   -2 = very low
//   -1 = low
//    0 = normal
//    1 = high
//    2 = very high
//
//CLC_Shout WILL interrupt the currently spoken string.
//
function CLC_Shout(messagestring, pitch) {
   if (CLC_TTS_ENGINE == 0){
      return;
      }
   if ((pitch > 2) || (pitch < -2)){
      alert("Invalid pitch");
      return;
      }
   if (CLC_TTS_ENGINE == 1){
      pitch = pitch * 5;
      messagestring = CLC_SAPI5_FixMessage(messagestring);
      var SAPI5_XML_STR = '<pitch middle="' + pitch + '">' + messagestring + '</pitch>';
      //Set language
      var langid = CLC_SAPI5_FindLangID(CLC_LANG);
      if (langid){
         SAPI5_XML_STR = '<lang langid="' + langid + '">' + SAPI5_XML_STR + '</lang>'; 
         }
      CLC_SAPI5_OBJ.Speak(SAPI5_XML_STR,3);
      }
   if (CLC_TTS_ENGINE == 2){
      pitch = (pitch * 25) + 100;      
      CLC_FREETTS_SPEECHBUFFER = messagestring;
      CLC_FREETTS_PITCHBUFFER = pitch;
      window.setTimeout('CLC_FREETTS_OBJ.Shout(CLC_FREETTS_SPEECHBUFFER, CLC_FREETTS_PITCHBUFFER, CLC_FreeTTS_DefaultRange, CLC_FreeTTS_DefaultRate, CLC_FreeTTS_DefaultVolume, "")',0);
      }
   if (CLC_TTS_ENGINE == 3){
      //Orca cannot do pitch, just ignore that for now
      CLC_Interrupt();
      CLC_Orca_Prep();
      CLC_ORCA_OBJ.send("speak: " + messagestring);     
      }
   if (CLC_TTS_ENGINE == 4){
      //Emacspeak cannot do pitch, just ignore that for now
      CLC_Interrupt();
      CLC_Emacspeak_Prep();
      CLC_EMACSPEAK_OBJ.send("speak: " + messagestring);     
      }
   if (CLC_TTS_ENGINE == 5){
      CLC_MACTTS_SPEECHQUEUE = new Array();
      CLC_MacTTS_SendToTTS(messagestring);
      }
   }

//------------------------------------------
//This function is intended to allow developers to
//make the speech engine "spell" a message that has immediate
//priority over everything else. Possible uses
//include (but are definitely not limited to) announcing
//keys that the user has typed. ShoutSpell should be used
//rather than Shout in order to announce punctuation.
//
//Makes the speech engine spell the "messagestring" 
//using the specified "pitch."
//
//"messagestring" is a text string.
//"pitch" can be any one of the following integer values:
//   -2 = very low
//   -1 = low
//    0 = normal
//    1 = high
//    2 = very high
//
//CLC_ShoutSpell WILL interrupt the currently spoken string.
//
function CLC_ShoutSpell(messagestring, pitch) {
   if (CLC_TTS_ENGINE == 0){
      return;
      }
   if ((pitch > 2) || (pitch < -2)){
      alert("Invalid pitch");
      return;
      }
   if (CLC_TTS_ENGINE == 1){
      pitch = pitch * 5;
      messagestring = CLC_SAPI5_FixMessage(messagestring);
      messagestring = CLC_SAPI5_ForceSpaceInSpell(messagestring);
      var SAPI5_XML_STR = '<pitch middle="' + pitch + '"><spell>' + messagestring + '</spell></pitch>';
      //Set language
      var langid = CLC_SAPI5_FindLangID(CLC_LANG);
      if (langid){
         SAPI5_XML_STR = '<lang langid="' + langid + '">' + SAPI5_XML_STR + '</lang>'; 
         }
      CLC_SAPI5_OBJ.Speak(SAPI5_XML_STR,3);
      }
   if (CLC_TTS_ENGINE == 2){
      messagestring = CLC_FREETTS_InsertSpaces(messagestring);
      pitch = (pitch * 25) + 100;      
      CLC_FREETTS_SPEECHBUFFER = messagestring;
      CLC_FREETTS_PITCHBUFFER = pitch;
      window.setTimeout('CLC_FREETTS_OBJ.Shout(CLC_FREETTS_SPEECHBUFFER, CLC_FREETTS_PITCHBUFFER, CLC_FreeTTS_DefaultRange, CLC_FreeTTS_DefaultRate, CLC_FreeTTS_DefaultVolume, "")',0);
      }
   if (CLC_TTS_ENGINE == 3){
      //Orca cannot do pitch, just ignore that for now
      CLC_Interrupt();
      messagestring = CLC_FREETTS_InsertSpaces(messagestring);
      CLC_Orca_Prep();
      CLC_ORCA_OBJ.send("speak: " + messagestring);     
      }
   if (CLC_TTS_ENGINE == 4){
      //Emacspeak cannot do pitch, just ignore that for now
      CLC_Interrupt();
      messagestring = CLC_FREETTS_InsertSpaces(messagestring);
      CLC_Emacspeak_Prep();
      CLC_EMACSPEAK_OBJ.send("speak: " + messagestring);     
      }
   if (CLC_TTS_ENGINE == 5){
      messagestring = CLC_FREETTS_InsertSpaces(messagestring);
      CLC_Shout(messagestring, pitch);   
      }
   }

//------------------------------------------
//Sets the synthesizer language. Whether this works depends on 
//whether the synthesizer supports the specified language.
//The specified language should be a string that represents a
//language using the same abbreviations as an HTML lang attribute.
//For example, use "ja" for Japanese and not jp, japan, etc. since ja
//is the proper value to use for a lang attribute in HTML.
//See http://www.w3.org/TR/html4/struct/dirlang.html
//
function CLC_SetLanguage(theLanguage) {
   CLC_LANG = theLanguage;
   }

//------------------------------------------