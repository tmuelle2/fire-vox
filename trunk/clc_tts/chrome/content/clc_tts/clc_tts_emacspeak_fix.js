//CLC-4-TTS Firefox Extension:
//Core Library Components for Text-To-Speech for Firefox
//Special functions for dealing with Emacspeak quirks
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
//Must prep the OrcaServer before anything can be done.
//
function CLC_Emacspeak_Prep(){
   CLC_EMACSPEAK_OBJ = new XMLHttpRequest();
   CLC_EMACSPEAK_OBJ.overrideMimeType('text/xml');
   CLC_EMACSPEAK_OBJ.open('POST', CLC_EMACSPEAK_URL, true);
   CLC_EMACSPEAK_OBJ.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
   }



function CLC_Emacspeak_CleanUp(){   
   if (CLC_EMACSPEAK_OBJ && CLC_EMACSPEAK_OBJ.abort){
      CLC_EMACSPEAK_OBJ.abort();
      CLC_EMACSPEAK_OBJ = "";
      }
   }
