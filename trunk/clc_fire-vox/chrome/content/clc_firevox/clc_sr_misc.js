//Miscellaneous functions that have not been categorized yet



//-----------------------------------------------
//Determines if the target should not be spoken
//for some reason because of its lineage.
//For example, if it is part of a comment node.
//True if it should NOT be spoken; else false.
//
//Should be using the PHYSICAL lineage here, not the logical one!
//Legends and labels are ignored because they will be spoken by announcement.
//
function CLC_SR_ShouldNotSpeak(lineage){
   //Input should always be spoken - also accounts for implicit labels
   if (lineage[lineage.length-1].tagName && lineage[lineage.length-1].tagName.toLowerCase() == "input"){
      return false;
      }
   if (lineage[lineage.length-1].tagName && lineage[lineage.length-1].tagName.toLowerCase() == "button"){
      return false;
      }
   if (lineage[lineage.length-1].tagName && lineage[lineage.length-1].tagName.toLowerCase() == "select"){
      return false;
      }
   if (lineage[lineage.length-1].tagName && lineage[lineage.length-1].tagName.toLowerCase() == "textarea"){
      return false;
      }
   if (lineage[lineage.length-2].tagName && lineage[lineage.length-2].tagName.toLowerCase() == "textarea"){
      return false;
      }
   for (var i=0; i < lineage.length; i++){
      if (lineage[i].nodeType == 8){
         return true;
         }
      if (lineage[i].tagName && (lineage[i].tagName.toLowerCase() == "script") ) {
         return true;
         }

      //NOSCRIPT elements are tricky
      if (lineage[i].tagName && (lineage[i].tagName.toLowerCase() == "noscript") ) {
         //If javascript is on, then the content of a NOSCRIPT element should be ignored
         if (Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("").getBoolPref("javascript.enabled") ){
            return true;
            }
         //However, if javascript is off, then the content goes into the regular HTML DOM and needs to be used
         return false;
         }
      if (lineage[i].tagName && (lineage[i].tagName.toLowerCase() == "legend") ){
         //Insert some mitigating factors here if needed
         return true;
         }
      if (lineage[i].tagName && (lineage[i].tagName.toLowerCase() == "label") ){       
         //Insert some mitigating factors here later to account for orphaned labels
         return true;
         }
      }
   return false;
   }


//-----------------------------------------------
//Announces the info about the current object
//
function CLC_SR_AnnounceCurrentObj(){
   var lineage = CLC_GetLogicalLineage(CLC_SR_CurrentAtomicObject);
   var i = CLC_CompareLineages(CLC_GetLineage(CLC_SR_PrevAtomicObject), lineage);
   while (lineage[i]){
      //Only call the TTS engine if you have something to say
      var announcement = CLC_GenerateIDInfo(lineage[i]);
      if (announcement){
         CLC_Say(announcement, 1);
         }
      i++;
      }
   }



//-----------------------------------------------
//Announces id info of only the closest thing in the lineage
//
function CLC_SR_BriefAnnounceCurrentObj(){
   var lineage = CLC_GetLogicalLineage(CLC_SR_CurrentAtomicObject);
   for (var i = lineage.length - 1; i >= 0; i--){
      if (CLC_GenerateIDInfo(lineage[i])){
         CLC_Say(CLC_GenerateIDInfo(lineage[i]), 1);
         return;
         }
      }
   }


//-----------------------------------------------
//Goes to a DOM object and reads it. Will adjust the screen.
//
function CLC_SR_GoToAndRead(target){
   if (!target){
      return;
      }
   CLC_SR_ForcedScreenAdjust = true;  
   CLC_SR_CurrentAtomicObject = CLC_GetFirstAtomicObject(target);
   CLC_MoveCaret(CLC_SR_CurrentAtomicObject);   
   CLC_SR_ReadCurrentPosition();
   }



//-----------------------------------------------
//Dumps debug information into the CLC_SR_DebugStringDump global variable.
//
function CLC_SR_DumpToDebug(debug_message){
   CLC_SR_DebugStringDump = CLC_SR_DebugStringDump + debug_message + "\n";
   }


//-----------------------------------------------
//Returns everything in the CLC_SR_DebugStringDump global variable.
//
function CLC_SR_ReadDebugDump(){
   return CLC_SR_DebugStringDump;
   }


//-----------------------------------------------
//Resets the CLC_SR_DebugStringDump global variable.
//
function CLC_SR_ResetDebugDump(){
   CLC_SR_DebugStringDump = "";
   }


//-----------------------------------------------
//Dumps debug information into the JavaScript Console
//
function CLC_SR_DumpToJSConsole(debug_message){  
  var consoleService = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);
  consoleService.logStringMessage(debug_message);
  }

