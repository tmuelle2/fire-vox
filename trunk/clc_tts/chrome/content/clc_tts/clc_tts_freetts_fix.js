//Copyright (C) 2005
//CLC-4-TTS Firefox Extension:
//Core Library Components for Text-To-Speech for Firefox
//Special functions for dealing with FreeTTS quirks
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
 

//Last Modified Date 1/31/2006


//------------------------------------------
//Inserts spaces between letters to force spelling mode.
//
function CLC_FREETTS_InsertSpaces(target){
   var return_val = "";
   for(var i=0; i < target.length; i++){
      return_val = return_val + target.charAt(i) + " ";
      }
   return return_val;
   }



//------------------------------------------
//Alternate Java object instantiation method
//
//The obvious way to intantiate a Java object is to do:
//   CLC_FREETTS_OBJ = new Packages.CLC4TTS_Java();	
//
//However, Linux doesn't like this for some strange reason.
//(LiveConnect in Linux may be broken...)
//
//This alternate instantiation method is less intuitive,
//but it is an effective workaround for this problem
//
function CLC_FREETTS_CreateFreeTTSJavaObjectInstance(){
   //Just put whatever here for the file as that is not 
   //important, just trying to get a class loader up.
   var cl = new java.net.URLClassLoader(
                [ new java.net.URL('file://C:/whatever.jar') ]
                );
   //This forName part is where the actual loading happens.
   //CLC4TTS_Java.jar must be in the lib/ext subdirectory of the main Java directory.
   return java.lang.Class.forName("CLC4TTS_Java", true, cl).newInstance();
   }



