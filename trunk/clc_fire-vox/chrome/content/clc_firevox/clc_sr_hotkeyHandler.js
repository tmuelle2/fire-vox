//------------------------------------------
//Function used to handle hotkeys when 
//keypress events are caught.
//
//This function is trickier than it seems - 
//the way it is done now is one of the few ways
//that actually work, so tweak at your own risk.
//
//The input arg MUST be named "event" for this to work correctly
//with the event handler.
//
//Uses the setTimeout function to immediately dispatch the 
//functions as independent threads to reduce browser lag.
//
//A global SpeakEventBuffer MUST be used! Else the function
//ends soon as CLC_Shout is launched, the local string will disappear
//and NOTHING will be said. Global buffer solves this problem.
//
function CLC_SR_Hotkey_Handler(event){
   var keypressed = String.fromCharCode(event.charCode);

   //User has done something; stop the auto read here immediately just to be safe.
   //Also, reset the user activity level since the user actively tried to do something, 
   //and set the last spoken mutation type to null since the user could do something
   //which causes something which is not a live region to speak.
   CLC_SR_Stop = true;
   CLC_SR_UserActivityLevel = CLC_SR_MaxUserActivityLevel;
   CLC_SR_LastSpokenMutationType = "";

   //Special case for page reload - clear CLC_SR_CurrentURI so that the page will start over.
   //Starting over means the page will be announced and the highlighting will be ok.
   if ((event.ctrlKey && (keypressed.toLowerCase() == "r"))){
      //Page was reloaded, so turn cursor matching back on.   
      CLC_SR_UseCursorMatching = true;
      CLC_SR_CurrentURI = "";
      return;
      }

   //If the user is in the URL bar, then they must be typing and NOT trying to navigate the page.
   //If they wanted to navigate, they would have switched focus to the page.
   if (event.target.id && event.target.id.toLowerCase()=="urlbar"){
      return;
      }

   //Toggle virtual mod key - hard coded to pause/break (at least for now)
   if ((event.keyCode == 19) && CLC_SR_Query_UseStickyMod()){
     if (CLC_SR_StickyModOn){
        CLC_SR_StickyModOn = false;
        window.setTimeout("CLC_Shout(CLC_SR_MSG0038,0);", 0);
        }
     else{
        CLC_SR_StickyModOn = true;
        window.setTimeout("CLC_Shout(CLC_SR_MSG0039,0);", 0);
        }
     return;
     }

   if (!(event.ctrlKey && event.shiftKey) && !(CLC_SR_StickyModOn && CLC_SR_Query_UseStickyMod())){
      //User may be attempting cursor navigation, so turn cursor matching back on.   
      CLC_SR_UseCursorMatching = true;
      return;
      }

   //Handle context controls
   if (event.keyCode == 37){
     window.setTimeout("CLC_SR_ContextControls('left');", 0);
     return;
     }
   if (event.keyCode == 38){
     window.setTimeout("CLC_SR_ContextControls('up');", 0);
     return;
     }
   if (event.keyCode == 39){
     window.setTimeout("CLC_SR_ContextControls('right');", 0);
     return;
     }
   if (event.keyCode == 40){
     window.setTimeout("CLC_SR_ContextControls('down');", 0);
     return;
     }

   //Give options menu highest priority for safety. 
   //Solves worst possible scenario where user has accidentally disabled speak events
   //and also assigned the menu key to two things. This way, if a function other than
   //the options menu has the same key as the options menu, the options menu will win.
   if (keypressed.toLowerCase() == CLC_SR_QueryKey_FireVoxOptionsMenu().toLowerCase() ){
      window.setTimeout("CLC_SR_FireVoxOptionsMenu();", 0);
      return;
      } 

   //These functions cannot have moved the cursor, so do not re-enable cursor matching here.
   if (keypressed.toLowerCase() == CLC_SR_QueryKey_StopSpeaking().toLowerCase() ){
      window.setTimeout("CLC_SR_StopSpeaking();", 0);
      return;
      } 
   if (keypressed.toLowerCase() == CLC_SR_QueryKey_ReadBackward().toLowerCase() ){
      window.setTimeout("CLC_SR_ReadContent(-1);", 0);
      return;
      }
   if (keypressed.toLowerCase() == CLC_SR_QueryKey_ReadForward().toLowerCase() ){
      window.setTimeout("CLC_SR_ReadContent(1);", 0);
      return;
      } 
   if (keypressed.toLowerCase() == CLC_SR_QueryKey_LaunchAutoReader().toLowerCase() ){
      window.setTimeout("CLC_SR_LaunchAutoReader();", 0);
      return;
      } 
   if (keypressed.toLowerCase() == CLC_SR_QueryKey_Repeat().toLowerCase() ){
      window.setTimeout("CLC_SR_Repeat();", 0);
      return;
      } 
   if (keypressed.toLowerCase() == CLC_SR_QueryKey_GetMoreInfo().toLowerCase() ){
      window.setTimeout("CLC_SR_GetMoreInfo();", 0);
      return;
      } 
   if (keypressed.toLowerCase() == CLC_SR_QueryKey_SpellOut().toLowerCase() ){
      window.setTimeout("CLC_SR_SpellOut();", 0);
      return;
      } 
   if (keypressed.toLowerCase() == CLC_SR_QueryKey_ReadCurrentPosition().toLowerCase() ){
      CLC_SR_ForcedScreenAdjust = true;
      window.setTimeout("CLC_SR_ReadCurrentPosition();", 0);
      return;
      } 
   if (keypressed.toLowerCase() == CLC_SR_QueryKey_SayParentTextContent().toLowerCase() ){
      window.setTimeout("CLC_SR_SayParentTextContent();", 0);
      return;
      } 
   if (keypressed.toLowerCase() == CLC_SR_QueryKey_ToggleDOMMutationEventAnnouncements().toLowerCase() ){
      window.setTimeout("CLC_SR_ToggleDOMMutationEventAnnouncements();", 0);
      return;
      } 

   //These could move the cursor, so turn cursor matching back on.   
   CLC_SR_UseCursorMatching = true;
   if (keypressed.toLowerCase() == CLC_SR_QueryKey_SaySelected().toLowerCase() ){
      window.setTimeout("CLC_SR_SaySelected();", 0);
      return;
      } 
   if (keypressed.toLowerCase() == CLC_SR_QueryKey_HeadingsList().toLowerCase() ){
      window.setTimeout("CLC_Shout(CLC_SR_MSG0014,0);", 0);
      window.setTimeout("CLC_SR_popUpMenu('HEADINGS');", 0);
      return;
      } 
   if (keypressed.toLowerCase() == CLC_SR_QueryKey_ElementsList().toLowerCase() ){
      window.setTimeout("CLC_Shout(CLC_SR_MSG0019,0);", 0);
      window.setTimeout("CLC_SR_popUpMenu('GENERIC');", 0);
      return;
      }
   return;
   }



//------------------------------------------
//Sets the event listener to catch keypress events
//
function CLC_SR_Hotkey_Init(){   
   window.addEventListener("keypress", CLC_SR_Hotkey_Handler, false);
   }

//------------------------------------------
