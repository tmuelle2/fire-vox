//Copyright (C) 2008 Google Inc.
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
 

//Last Modified Date 6/13/2008


//For all the functions that use properties:
//"speechProperties_array" is an array of arrays of two integers, 
//the first integer being the value and the second integer 
//being the mode.
//"additionalProperties_array" is an array of text strings.
//
//In general, "speechProperties_array" are those that 
//have a predefined number of values that can be 
//quantified along with a mode. A good example would be 
//the pitch. It can be treated as absolute (an absolute 
//pitch of 120 KHz), a percentage (120% of the default),
//or an enumeration (-2 as xlow, -1 as low, 0 as normal,
//1 as high, 2 as xhigh).
//
//In general, "additionalProperties_array" are those that 
//which can not be enumerated. 
//At this point, I am still not completely sure if I can
//fully enumerate the speech family (for example, what if
//there is a request for a particular voice by name?),
//so I am just going to have this in as an escape hatch.
//
//The standard modes are:
//-1 = undefined; this is used to indicate that a 
//     property should be skipped
// 0 = absolute
// 1 = percentage (assumes % sign: 50% is integer 50, etc.)
// 2 = enumeration (0 is the medium level, negative numbers 
//     for lower, positive numbers for higher - total number 
//     of levels are same as defined in CSS)
//
//The boolean modes are:
//-1 = undefined; this is used to indicate that a 
//     property should be skipped
// 0 = boolean: value of 1 is true, else false.
//
//Since this is a work in progress, to avoid forcing people
//who use this function to modify their programs any time
//a new speech property is added, the properties will
//be processed in the following defined order:
//0 = pitch; standard modes
//1 = pitch range; standard modes
//2 = speaking rate; standard modes
//3 = volume; standard modes
//4 = spell out; boolean modes
//
//The property lists may be shorter than defined; any
//property that is past the end of the given array will 
//simply have its default value used. 


//------------------------------------------
//
//This function takes a pitch value and converts 
//it to a reasonable SAPI5 pitch level.
//SAPI 5.1 XML does not give the ability to specify a 
//pitch in terms of a number. Thus, this is a hackaround 
//that is designed to sound somewhat reasonable but 
//is by no means accurate.

function CLC_SAPI5_PitchValueToLevel(pitch){
   var pitchLevel = Math.round( (pitch - 120) / 10 );
   if (pitchLevel < -10){
      return -10;
      }
   if (pitchLevel > 10){
      return 10;
      }
   return pitchLevel;
   }

//------------------------------------------
//
//This function generates a SAPI5 XML string that 
//will satisfy the speech properties.
//
function CLC_GenerateSAPI5XMLWithProperties(messagestring, speechProperties_array, additionalProperties_array){
   var SAPI5_XML_STR = CLC_SAPI5_FixMessage(messagestring);

   //Set pitch
   if (speechProperties_array.length > 0){
      //Make sure pitch property was valid
      if (speechProperties_array[0].length == 2){
         //Undefined - Use default
         if (speechProperties_array[0][1] == -1){ 
            var pitch = CLC_SAPI5_DefaultMiddle;      
            SAPI5_XML_STR = '<pitch absmiddle="' + pitch + '">' + SAPI5_XML_STR + '</pitch>';
            }
         //Absolute 
         if (speechProperties_array[0][1] == 0){ 
            var pitch = CLC_SAPI5_PitchValueToLevel(speechProperties_array[0][0]);      
            SAPI5_XML_STR = '<pitch absmiddle="' + pitch + '">' + SAPI5_XML_STR + '</pitch>';
            }
         //Percentage 
         if (speechProperties_array[0][1] == 1){ 
            var pitch = (speechProperties_array[0][0] / 100) * (CLC_SAPI5_DefaultMiddle + 10) * 5; 
            pitch = Math.round( (pitch / 5) - 10 );
            SAPI5_XML_STR = '<pitch middle="' + pitch + '">' + SAPI5_XML_STR + '</pitch>';
            }
         //Enumeration
         if (speechProperties_array[0][1] == 2){ 
            if ((speechProperties_array[0][0] < 3) && (speechProperties_array[0][0] > -3)){
               var pitch = speechProperties_array[0][0] * 5; 
               SAPI5_XML_STR = '<pitch middle="' + pitch + '">' + SAPI5_XML_STR + '</pitch>';
               }
            }
         }
      }

   //Ignore pitch range since SAPI 5 does not support this property

   //Set rate
   if (speechProperties_array.length > 2){
      //Make sure rate property was valid
      if (speechProperties_array[2].length == 2){
         //Undefined - Use default
         if ((speechProperties_array[2][1] == -1) || (speechProperties_array[2][1] == 0)){ 
            var rate = CLC_SAPI5_DefaultRate;      
            SAPI5_XML_STR = '<rate speed="' + rate + '">' + SAPI5_XML_STR + '</rate>';
            }
         //Absolute - No absolute for rate since it is not defined in CSS3
         //Percentage
         if (speechProperties_array[2][1] == 1){ 
            var rate = (speechProperties_array[2][0] / 100) * (CLC_SAPI5_DefaultRate + 10) * 5; 
            rate = Math.round( (rate / 5) - 10 );
            SAPI5_XML_STR = '<rate speed="' + rate + '">' + SAPI5_XML_STR + '</rate>';
            }
         //Enumeration
         if (speechProperties_array[2][1] == 2){ 
            if ((speechProperties_array[2][0] < 3) && (speechProperties_array[2][0] > -3)){
               var rate = speechProperties_array[2][0] * 5; 
               SAPI5_XML_STR = '<rate speed="' + rate + '">' + SAPI5_XML_STR + '</rate>'; 
               }
            }
         }
      }

   //Set volume
   if (speechProperties_array.length > 3){
      //Make sure volume property was valid
      if (speechProperties_array[3].length == 2){
         //Undefined - Use default
         if (speechProperties_array[3][1] == -1){ 
            var volume = CLC_SAPI5_DefaultVolume;      
            SAPI5_XML_STR = '<volume level="' + volume + '">' + SAPI5_XML_STR + '</volume>';
            }
         //Absolute 
         if (speechProperties_array[3][1] == 0){ 
            var volume = speechProperties_array[3][0]; 
            SAPI5_XML_STR = '<volume level="' + volume + '">' + SAPI5_XML_STR + '</volume>';
            }
         //Percentage
         if (speechProperties_array[3][1] == 1){ 
            var volume = Math.round( (speechProperties_array[3][0] / 100) * CLC_SAPI5_DefaultVolume ); 
            SAPI5_XML_STR = '<volume level="' + volume + '">' + SAPI5_XML_STR + '</volume>';
            }
         //Enumeration
         if (speechProperties_array[3][1] == 2){ 
            if ((speechProperties_array[3][0] < 3) && (speechProperties_array[3][0] > -4)){
               var volume = ((speechProperties_array[3][0] + 3) * 20); 
               SAPI5_XML_STR = '<volume level="' + volume + '">' + SAPI5_XML_STR + '</volume>'; 
               }
            }
         }
      }

   return SAPI5_XML_STR;
   }


//------------------------------------------
//
//This function returns an array of floats to be used
//as the FreeTTS properties that will be passed directly to
//FreeTTS. The order is:
// [0] = pitch_middle
// [1] = pitch_range
// [2] = rate
// [3] = volume
//
function CLC_FreeTTS_CalcProperties(speechProperties_array, additionalProperties_array){
   var answer = new Array(4);
   var pitch_middle = CLC_FreeTTS_DefaultMiddle;
   var pitch_range = CLC_FreeTTS_DefaultRange;
   var rate = CLC_FreeTTS_DefaultRate;
   var volume = CLC_FreeTTS_DefaultVolume;

   //Set pitch middle
   if (speechProperties_array.length > 0){
      //Make sure pitch property was valid
      if (speechProperties_array[0].length == 2){
         //Undefined - Use default
         if (speechProperties_array[0][1] == -1){ 
            pitch_middle = CLC_FreeTTS_DefaultMiddle;
            }
         //Absolute 
         if (speechProperties_array[0][1] == 0){ 
            pitch_middle = speechProperties_array[0][0];
            }
         //Percentage 
         if (speechProperties_array[0][1] == 1){ 
            pitch_middle = (speechProperties_array[0][0] / 100) * CLC_FreeTTS_DefaultMiddle; 
            }
         //Enumeration
         if (speechProperties_array[0][1] == 2){ 
            if ((speechProperties_array[0][0] < 3) && (speechProperties_array[0][0] > -3)){
               pitch_middle = (speechProperties_array[0][0] * 30) + CLC_FreeTTS_DefaultMiddle;
               }
            }
         }
      }

   //Set pitch range
   if (speechProperties_array.length > 1){
      //Make sure pitch range property was valid
      if (speechProperties_array[1].length == 2){
         //Undefined - Use default
         if (speechProperties_array[1][1] == -1){ 
            pitch_range = CLC_FreeTTS_DefaultRange;
            }
         //Absolute 
         if (speechProperties_array[1][1] == 0){ 
            pitch_range = speechProperties_array[1][0];
            }
         //Percentage 
         if (speechProperties_array[1][1] == 1){ 
            pitch_range = (speechProperties_array[1][0] / 100) * CLC_FreeTTS_DefaultRange; 
            }
         //Enumeration - FIX THIS
         if (speechProperties_array[1][1] == 2){ 
            if ((speechProperties_array[1][0] < 3) && (speechProperties_array[1][0] > -3)){
               pitch_range = (speechProperties_array[1][0] + 2) * (.4 * CLC_FreeTTS_DefaultMiddle);
               }
            }
         }
      }

   //Set rate
   if (speechProperties_array.length > 2){
      //Make sure rate property was valid
      if (speechProperties_array[2].length == 2){
         //Undefined - Use default
         if ((speechProperties_array[2][1] == -1) || (speechProperties_array[2][1] == 0)){ 
            rate = CLC_FreeTTS_DefaultRate; 
            }
         //Absolute - No absolute for rate since it is not defined in CSS3
         //Percentage
         if (speechProperties_array[2][1] == 1){ 
            rate = (speechProperties_array[2][0] / 100) * CLC_FreeTTS_DefaultRate; 
            }
         //Enumeration 
         if (speechProperties_array[2][1] == 2){ 
            if ((speechProperties_array[2][0] < 3) && (speechProperties_array[2][0] > -3)){
               rate = ( (CLC_FreeTTS_DefaultRate / 4) * speechProperties_array[2][0] ) + CLC_FreeTTS_DefaultRate; 
               }
            }
         }
      }

   //Set volume
   if (speechProperties_array.length > 3){
      //Make sure volume property was valid
      if (speechProperties_array[3].length == 2){
         //Undefined - Use default
         if (speechProperties_array[3][1] == -1){ 
            volume = CLC_FreeTTS_DefaultVolume; 
            }
         //Absolute - CHECK THIS
         if (speechProperties_array[3][1] == 0){ 
            volume = speechProperties_array[3][0] / 100; 
            }
         //Percentage
         if (speechProperties_array[3][1] == 1){ 
            volume = (speechProperties_array[3][0] / 100) * CLC_FreeTTS_DefaultVolume; 
            }
         //Enumeration 
         if (speechProperties_array[3][1] == 2){ 
            if (speechProperties_array[3][0] == -3){
               volume = 0;
               }
            if ((speechProperties_array[3][0] < 3) && (speechProperties_array[3][0] > -3)){
               volume = ((CLC_FreeTTS_DefaultVolume / 6) * speechProperties_array[3][0]) + ((CLC_FreeTTS_DefaultVolume * 3) / 4);
               }
            }
         }
      }
   answer[0] = pitch_middle;
   answer[1] = pitch_range;
   answer[2] = rate;
   answer[3] = volume;
   return answer;
   }


//------------------------------------------
//
function CLC_MacTTS_PitchValueToLevel(pitch){
  var pitchLevel = Math.round( (pitch - 120) / 10 );
  if (pitchLevel < -10){
     return -10;
     }
  if (pitchLevel > 10){
     return 10;
     }
  return pitchLevel;
  }

//------------------------------------------
//
//This function generates a string with Mac TTS 
//embedded speech properties.
//
function CLC_GenerateMacTTSStringWithProperties(messagestring, speechProperties_array, additionalProperties_array){
   var MACTTS_STR = CLC_MacTTS_SanitizeInput(messagestring);

  if (CLC_MACTTS_USEOLDTTS){
    return MACTTS_STR;
    }

  //Set pitch
  if (speechProperties_array.length > 0){
    //Make sure pitch property was valid
    if (speechProperties_array[0].length == 2){
      var pitch = 0;
      //Undefined - Use default by doing nothing
      if (speechProperties_array[0][1] == -1){   
        pitch = CLC_MACTTS_DefaultMiddle;             
        }
      //Absolute 
      if (speechProperties_array[0][1] == 0){ 
        pitch = CLC_MacTTS_PitchValueToLevel(speechProperties_array[0][0]);      
        }
      //Percentage 
      if (speechProperties_array[0][1] == 1){ 
        pitch = (speechProperties_array[0][0] / 100) * (CLC_MACTTS_DefaultMiddle + 10) * 5; 
        pitch = Math.round( (pitch / 5) - 10 );
        }
      //Enumeration
      if (speechProperties_array[0][1] == 2){ 
        if ((speechProperties_array[0][0] < 3) && (speechProperties_array[0][0] > -3)){
          pitch = speechProperties_array[0][0] * 5; 
          }
        }
      //Apply the pitch
      if (pitch < 0){
        MACTTS_STR = '[[pbas ' + pitch + ']]' + MACTTS_STR;
        } else {
        MACTTS_STR = '[[pbas +' + pitch + ']]' + MACTTS_STR;
        }
      }
    }

   //Ignore pitch range since SAPI 5 does not support this property

   //Set rate
   if (speechProperties_array.length > 2){
      //Make sure rate property was valid
      if (speechProperties_array[2].length == 2){
         var rate = 0;
         //Undefined - Use default
         if ((speechProperties_array[2][1] == -1) || (speechProperties_array[2][1] == 0)){ 
            rate = CLC_MACTTS_DefaultRate;   
            }
         //Absolute - No absolute for rate since it is not defined in CSS3
         //Percentage
         if (speechProperties_array[2][1] == 1){ 
            var rate = (speechProperties_array[2][0] / 100) * (CLC_SAPI5_DefaultRate + 10) * 5; 
            rate = Math.round( (rate / 5) - 10 );
            }
         //Enumeration
         if (speechProperties_array[2][1] == 2){ 
            if ((speechProperties_array[2][0] < 3) && (speechProperties_array[2][0] > -3)){
               rate = speechProperties_array[2][0] * 75; 
               }
            }
         //Apply the rate
         if (rate < 0){
           MACTTS_STR = '[[rate ' + rate + ']]' + MACTTS_STR;
           }
         else {
           MACTTS_STR = '[[rate +' + rate + ']]' + MACTTS_STR;
           }
         }
      }

   //Set volume
   if (speechProperties_array.length > 3){
      //Make sure volume property was valid
      if (speechProperties_array[3].length == 2){
         var volume = 1;
         //Undefined - Use default
         if (speechProperties_array[3][1] == -1){ 
            volume = CLC_MACTTS_DefaultVolume;      
            }
         //Absolute 
         if (speechProperties_array[3][1] == 0){ 
            volume = speechProperties_array[3][0] / 100; 
            }
         //Percentage
         if (speechProperties_array[3][1] == 1){ 
            volume = Math.round( (speechProperties_array[3][0] / 100) * CLC_MACTTS_DefaultVolume ); 
            }
         //Enumeration
         if (speechProperties_array[3][1] == 2){ 
            if ((speechProperties_array[3][0] < 3) && (speechProperties_array[3][0] > -4)){
               volume = ((speechProperties_array[3][0] + 3) * 20) / 100; 
               }
            }
         //Apply the volume
         MACTTS_STR = '[[volm ' + volume + ']]' + MACTTS_STR;
         }
      }

   //Set normal or spelling mode
   if (speechProperties_array.length > 4){
      //Make sure spell out property was valid
      if (speechProperties_array[4].length == 2){
         //Boolean mode and true
         if ( (speechProperties_array[4][1] == 0) && (speechProperties_array[4][0] == 1) ){
            MACTTS_STR = "[[char LTRL]]" + MACTTS_STR + "[[char NORM]]";
            }
         }
      }

   return MACTTS_STR;
   }


//------------------------------------------
//
//This function is intended to allow developers to
//make the speech engine say a message. Possible uses
//include (but are definitely not limited to) announcing
//events to the user and echoing back hotkey commands.
//
//Makes the speech engine say the "messagestring" 
//using the specified "speech_properties" and 
//"additional_properties". 
//
//"messagestring" is a text string.
//
//CLC_SayWithProperties will NOT interrupt the currently spoken string.
//
function CLC_SayWithProperties(messagestring, speechProperties_array, additionalProperties_array){
   if (CLC_TTS_ENGINE == 0){
      return;
      }

   if (CLC_TTS_ENGINE == 1){
      var SAPI5_XML_STR = CLC_GenerateSAPI5XMLWithProperties(messagestring, speechProperties_array, additionalProperties_array);
      //Set language
      var langid = CLC_SAPI5_FindLangID(CLC_LANG);
      if (langid){
         SAPI5_XML_STR = '<lang langid="' + langid + '">' + SAPI5_XML_STR + '</lang>'; 
         }
      CLC_SAPI5_OBJ.Speak(SAPI5_XML_STR,1);
      return;
      }

   if (CLC_TTS_ENGINE == 2){  
      var freettsProperties = CLC_FreeTTS_CalcProperties(speechProperties_array, additionalProperties_array);
      CLC_FREETTS_OBJ.Speak(messagestring, freettsProperties[0], freettsProperties[1], freettsProperties[2], freettsProperties[3], "");
      return;
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
      var MACTTS_STR = CLC_GenerateMacTTSStringWithProperties(messagestring, speechProperties_array, additionalProperties_array);
      //Put in speech queue management for Mac   
      CLC_MACTTS_SPEECHQUEUE.push(MACTTS_STR);
      if (!CLC_MACTTS_PROCESSINGQUEUE){
        CLC_MacTTS_ProcessSpeechQueue();
        } 
      }
   }



//------------------------------------------
//
//This function is intended to allow developers to
//make the speech engine read content displayed within the 
//browser. The object that generated the string is stored
//to allow users to go back to the last object that was read.
//
//Makes the speech engine read the "contentstring" 
//using the specified "pitch." It also stores the "contentobject"
//in a history buffer of the most recently read objects.
//
//"contentobject" should be the object on the page that generated the "contentstring"
//
//CLC_ReadWithProperties will NOT interrupt the currently spoken string.
//
function CLC_ReadWithProperties(contentobject, messagestring, speechProperties_array, additionalProperties_array) {
   CLC_SayWithProperties(messagestring, speechProperties_array, additionalProperties_array);
   for(var i = CLC_TTS_HISTORY_BUFFER_MAXSIZE; i > 1; i--){
      CLC_TTS_HISTORY_BUFFER[i-1] = CLC_TTS_HISTORY_BUFFER[i-2];
      } 
   CLC_TTS_HISTORY_BUFFER[0] = contentobject;
   return;
   }




//------------------------------------------
//This function is intended to allow developers to
//make the speech engine say a message that has immediate
//priority over everything else. Possible uses
//include (but are definitely not limited to) announcing
//events to the user and echoing back hotkey commands.
//
//CLC_ShoutWithProperties WILL interrupt the currently spoken string.
//
function CLC_ShoutWithProperties(messagestring, speechProperties_array, additionalProperties_array) {
   if (CLC_TTS_ENGINE == 0){
      return;
      }
   if (CLC_TTS_ENGINE == 1){
      var SAPI5_XML_STR = CLC_GenerateSAPI5XMLWithProperties(messagestring, speechProperties_array, additionalProperties_array);
      //Set language
      var langid = CLC_SAPI5_FindLangID(CLC_LANG);
      if (langid){
         SAPI5_XML_STR = '<lang langid="' + langid + '">' + SAPI5_XML_STR + '</lang>'; 
         }
      CLC_SAPI5_OBJ.Speak(SAPI5_XML_STR,3);
      return;
      }
   if (CLC_TTS_ENGINE == 2){ 
      CLC_FREETTS_SPEECHBUFFER = messagestring;
      CLC_FREETTS_PROPERTYBUFFER = CLC_FreeTTS_CalcProperties(speechProperties_array, additionalProperties_array);
      window.setTimeout('CLC_FREETTS_OBJ.Shout(CLC_FREETTS_SPEECHBUFFER, CLC_FREETTS_PROPERTYBUFFER[0], CLC_FREETTS_PROPERTYBUFFER[1], CLC_FREETTS_PROPERTYBUFFER[2], CLC_FREETTS_PROPERTYBUFFER[3], "")',0);
      return;
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
      var MACTTS_STR = CLC_GenerateMacTTSStringWithProperties(messagestring, speechProperties_array, additionalProperties_array);
      CLC_MACTTS_SPEECHQUEUE = new Array();
      CLC_MacTTS_SendToTTS(MACTTS_STR); 
      }
   }
