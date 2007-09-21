//Functions for handling Common Dialog boxes (JavaScript alert boxes, etc.)


//------------------------------------------
//Sets the event listeners to catch events
//
function CLC_SR_CommonDialogEvents_Enable(){   
   window.addEventListener("keypress", CLC_SR_Keyboard_CD_EventAnnouncer, false);
   window.addEventListener("unload", CLC_SR_StopSpeaking, false);
   var message = CLC_SR_MSG0011 + window.document.documentElement.textContent;
   CLC_Shout(message,0);   
   CLC_SR_CD_AddButtonFocusListeners();
   }


//------------------------------------------
function CLC_SR_Keyboard_CD_EventAnnouncer(event){
   var key = String.fromCharCode(event.charCode);
   if (!(event.ctrlKey && event.shiftKey)){
      return;
      }
   if (key.toLowerCase() == CLC_SR_QueryKey_ReadCurrentPosition().toLowerCase()){
      CLC_SR_ReadContents_CD();  
      }
   else if (key.toLowerCase() == CLC_SR_QueryKey_ReadForward().toLowerCase()){
      CLC_SR_ForceFocus_CD()
      }
   }


//------------------------------------------
function CLC_SR_ForceFocus_CD(){
   var cd_buttons = window.document.documentElement._buttons;
   if (CLC_SR_CD_ButtonActive(cd_buttons.accept)){
      cd_buttons.accept.focus();
      var message = cd_buttons.accept.label + CLC_SR_MSG0012;
      CLC_Shout(message,0);
      return;
      }
   if (CLC_SR_CD_ButtonActive(cd_buttons.cancel)){
      cd_buttons.cancel.focus();
      var message = cd_buttons.cancel.label + CLC_SR_MSG0012;
      CLC_Shout(message,0);
      return;
      }
   if (CLC_SR_CD_ButtonActive(cd_buttons.extra1)){
      cd_buttons.extra1.focus();
      var message = cd_buttons.extra1.label + CLC_SR_MSG0012;
      CLC_Shout(message,0);
      return;
      }
   if (CLC_SR_CD_ButtonActive(cd_buttons.extra2)){
      cd_buttons.extra2.focus();
      var message = cd_buttons.extra2.label + CLC_SR_MSG0012;
      CLC_Shout(message,0);
      return;
      }
   if (CLC_SR_CD_ButtonActive(cd_buttons.help)){
      cd_buttons.help.focus();
      var message = cd_buttons.help.label + CLC_SR_MSG0012;
      CLC_Shout(message,0);
      return;
      }
   if (CLC_SR_CD_ButtonActive(cd_buttons.disclosure)){
      cd_buttons.disclosure.focus();
      var message = cd_buttons.disclosure.label + CLC_SR_MSG0012;
      CLC_Shout(message,0);
      return;
      }
   }


//------------------------------------------
function CLC_SR_ReadContents_CD(){
   CLC_Shout(window.document.documentElement.textContent, 0);
   }


//------------------------------------------
function CLC_SR_CD_ButtonActive(button){
   if (button.hidden){
      return false;
      }
   if (button.disabled){
      return false;
      }
   return true;
   }


//------------------------------------------
function CLC_SR_CD_AddButtonFocusListeners(){
   var cd_buttons = window.document.documentElement._buttons;
   cd_buttons.accept.addEventListener("focus", CLC_SR_Focus_CD_EventAnnouncer,false);
   cd_buttons.cancel.addEventListener("focus", CLC_SR_Focus_CD_EventAnnouncer,false);
   cd_buttons.extra1.addEventListener("focus", CLC_SR_Focus_CD_EventAnnouncer,false);
   cd_buttons.extra2.addEventListener("focus", CLC_SR_Focus_CD_EventAnnouncer,false);
   cd_buttons.help.addEventListener("focus", CLC_SR_Focus_CD_EventAnnouncer,false);
   cd_buttons.disclosure.addEventListener("focus", CLC_SR_Focus_CD_EventAnnouncer,false);
   }

//------------------------------------------
function CLC_SR_Focus_CD_EventAnnouncer(event){
   CLC_Shout((event.target.label + CLC_SR_MSG0012),0);
   }

