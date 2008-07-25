//------------------------------------------
//These functions are all designed specifically
//for the "clc_firevox_pref_ui.xul" dialogue.
//------------------------------------------



//------------------------------------------
//Note that this is for keys within the "clc_firevox_pref_ui.xul" dialogue only!
//
function CLC_SR_PrefUI_KeyHandler(event){
   var key = String.fromCharCode(event.charCode);
   if (!CLC_SR_Pref_ValidKey(key)){
      window.setTimeout("CLC_Shout(CLC_SR_MSG0021,0);", 0);
      return;
      }
   CLC_SR_SpeakEventBuffer = key;
   window.setTimeout("CLC_ShoutSpell(CLC_SR_SpeakEventBuffer,0);", 0);     
   }


//------------------------------------------
//Sets the keypress event listener to catch events.
//Focus events are setup in the xul file itself since
//target and originalTarget both fail to retrieve
//the correct information.
//
function CLC_SR_SpeakPrefUI_Init(){   
   //Key presses
   window.addEventListener("keypress", CLC_SR_PrefUI_KeyHandler, false);

   //Not sure about the rest - none for now
   }




//------------------------------------------
//Focus event speaker for textboxes.
//Be sure to set onload in the xul to use this!
//
function CLC_SR_SpeakPrefUI_TextboxFocus(textbox_id){
   var target = document.getElementById(textbox_id);
   if (!target){
      return;
      }
   CLC_SR_SpeakEventBuffer = CLC_SR_MSG0016 + target.label + CLC_SR_MSG0015 + target.value;
   window.setTimeout("CLC_Shout(CLC_SR_SpeakEventBuffer,1);", 0);  
   }  

//------------------------------------------
//Focus event speaker for checkboxes.
//Be sure to set onload in the xul to use this!
//
function CLC_SR_SpeakPrefUI_CheckboxFocus(checkbox_id){
   var target = document.getElementById(checkbox_id);
   if (!target){
      return;
      }
   CLC_SR_SpeakEventBuffer = CLC_SR_MSG0018 + target.label;
   if (target.checked){
      CLC_SR_SpeakEventBuffer = CLC_SR_SpeakEventBuffer + CLC_SR_MSG0009;
      }
   else{
      CLC_SR_SpeakEventBuffer = CLC_SR_SpeakEventBuffer + CLC_SR_MSG0017;
       }
   window.setTimeout("CLC_Shout(CLC_SR_SpeakEventBuffer,1);", 0);  
   }  


//------------------------------------------
//Focus event speaker for buttons.
//Be sure to set onload in the xul to use this!
//
function CLC_SR_SpeakPrefUI_ButtonFocus(button_id){
   var target = document.getElementById(button_id);
   if (!target){
      return;
      }
   CLC_SR_SpeakEventBuffer = target.label + CLC_SR_MSG0012;
   window.setTimeout("CLC_Shout(CLC_SR_SpeakEventBuffer,1);",0); 
   }  


//------------------------------------------
//Resets the CNR URL preference setting in the UI
//
function CLC_SR_ResetCNRUrl_ButtonCommand(){
   var target = document.getElementById("firevoxpref-CNRUrl-TextBox");
   target.value = "http://clcworld.blogspot.com/atom.xml";
   CLC_SR_SpeakEventBuffer = "The content navigation rules U R L has been reset.";
   window.setTimeout("CLC_Shout(CLC_SR_SpeakEventBuffer,1);",0); 
   }  

