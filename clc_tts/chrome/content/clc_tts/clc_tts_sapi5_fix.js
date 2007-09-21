//Copyright (C) 2005
//CLC-4-TTS Firefox Extension:
//Core Library Components for Text-To-Speech for Firefox
//Special functions for dealing with SAPI 5 quirks
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
 

//Last Modified Date 2/5/2005


//------------------------------------------
//SAPI5 XML grammar causes anything found after a '<' to be ignored.
//CLC_SAPI5_FixMessage gets around this by replacing any '<'
//that is found in messagestring with "&lt" before it speaks.
//Interestingly enough, '&' and '>' are ok and do not need this fix.
//This function returns the fixed string.
//
function CLC_SAPI5_FixMessage(messagestring){
   if(!messagestring || !messagestring.replace || !messagestring.search){
      return messagestring;
      }
   var fixedstr = messagestring;
   while (fixedstr.search('<') != -1){
      fixedstr = fixedstr.replace('<', '&lt');
      }
   return fixedstr;
   }

//------------------------------------------
//SAPI5 refuses to speak the space character even when
//in spelling mode. To force "space" to be spoken in spelling
//mode, use CLC_SAPI5_ForceSpaceInSpell to add in the
//necessary SAPI5 XML code.
//This function returns the fixed string.
//
//Be sure that you have already fixed any '<' that you want to make
//speakable BEFORE you call this function! If you call it after this
//function, the resulting string will be messed up since the <spell>
//XML command tags will be destroyed if the '<' are replaced accidentally!
//
function CLC_SAPI5_ForceSpaceInSpell(messagestring){
   if(!messagestring || !messagestring.replace || !messagestring.search){
      return messagestring;
      }
   var fixedstr = messagestring;
   while (fixedstr.search(' ') != -1){
      fixedstr = fixedstr.replace(' ', '</spell>space<spell>');
      }
   return fixedstr;
   }

//------------------------------------------
//Returns the langid to be used for the specified language.
//The specified language should be a string that represents a
//language using the same abbreviations as an HTML lang attribute.
//For example, use "ja" for Japanese and not jp, japan, etc. since ja
//is the proper value to use for a lang attribute in HTML.
//See http://www.w3.org/TR/html4/struct/dirlang.html
//
//Tries to find the precise dialect, but if it is not found, 
//it will try to get language in general.
//
//This is really just one big lookup table; langids will be adjusted
//as I discover which langid codes the most prevalent synthesizers
//are using.
//
//Returns "" if no ID could be found.
//
function CLC_SAPI5_FindLangID(language){
  var answer = CLC_SAPI5_FindLangIDPreciseDialect(language);
  if (answer == ""){
    answer = CLC_SAPI5_FindLangIDGeneral(language);
    }
  return answer;
  }

//------------------------------------------
//Tries to find the langid of the precise dialect.
//
function CLC_SAPI5_FindLangIDPreciseDialect(language){
  if (language.toLowerCase() == "en-us"){
     return "409";
     }
  if (language.toLowerCase() == "en-gb"){
     return "809";
     }
  if (language.toLowerCase() == "en-au"){
     return "C09";
     }
  if (language.toLowerCase() == "zh-cn"){
     return "804";
     }
  return "";
  }

//------------------------------------------
//Tries to find the langid of the language in general.
//
function CLC_SAPI5_FindLangIDGeneral(language){
  language = language.substring(0,2);
  if (language.toLowerCase() == "en"){
     return "409";
     }
  if (language.toLowerCase() == "ja"){
     return "411";
     }
  if (language.toLowerCase() == "zh"){
     return "804";
     }
  if (language.toLowerCase() == "fr"){
     return "40C";
     }
  if (language.toLowerCase() == "es"){
     return "C0A";
     }
  if (language.toLowerCase() == "it"){
     return "410";
     }
  if (language.toLowerCase() == "de"){
     return "407";
     }
  if (language.toLowerCase() == "el"){
     return "408";
     }
  return "";
  }
//------------------------------------------