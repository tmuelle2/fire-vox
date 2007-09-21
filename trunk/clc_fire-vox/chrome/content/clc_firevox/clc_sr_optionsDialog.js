//Functions for handling the Firefox Options Dialog window


//------------------------------------------
//Sets the event listeners to catch events
//
function CLC_SR_OptionsDialogEvents_Enable(){
   window.addEventListener("unload", CLC_SR_StopSpeaking, false);
   CLC_Shout(CLC_SR_MSG0024,0);   
   window.addEventListener("focus", CLC_SR_OD_FocusAnnouncer, false);
   window.addEventListener("select", CLC_SR_OD_SelectAnnouncer, false);
   window.addEventListener("keypress", CLC_SR_Keyboard_OD_EventAnnouncer, false);
   }


//------------------------------------------
function CLC_SR_Keyboard_OD_EventAnnouncer(event){
   CLC_SR_SpeakEventBuffer = String.fromCharCode(event.charCode);
   CLC_Shout(CLC_SR_SpeakEventBuffer,0);
   }



//------------------------------------------
function CLC_SR_OD_FocusAnnouncer(event){
   CLC_SR_DumpToJSConsole(event.target.nodeName);
   //Handle the tabs
   if (event.target.nodeName && (event.target.nodeName == "xul:radiogroup")){
      CLC_SR_SpeakEventBuffer = CLC_SR_MSG0025 + event.target.selectedItem.label;
      }
   else if (event.target.accessible){
      CLC_SR_SpeakEventBuffer = event.target.accessible.name;
      if (event.target.accessible.description){
         CLC_SR_SpeakEventBuffer = CLC_SR_SpeakEventBuffer + event.target.accessible.description;
         }
      }
   else {
      if (event.target.value){
         CLC_SR_SpeakEventBuffer = event.target.value;
         } 
      }
   CLC_Shout(CLC_SR_SpeakEventBuffer,0);
   }

//------------------------------------------
function CLC_SR_OD_SelectAnnouncer(event){
   //Handle the homepage
   if (event.target.nodeName && (event.target.nodeName == "textbox")){
      CLC_SR_SpeakEventBuffer = event.target.accessible.name + " " + event.target.accessible.finalValue;
      }
   CLC_Shout(CLC_SR_SpeakEventBuffer,0);
   }