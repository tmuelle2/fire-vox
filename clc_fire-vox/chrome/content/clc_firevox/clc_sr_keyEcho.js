

//------------------------------------------
//Function used to echo keys when 
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
//CLC_ShoutSpell function as an independent thread to reduce browser lag.
//
//A global SpeakEventBuffer MUST be used! Else the function
//ends soon as CLC_Shout is launched, the local string will disappear
//and NOTHING will be said. Global buffer solves this problem.
//
function CLC_SR_EchoKeys_EventAnnouncer(event){
   if (!CLC_SR_Query_EchoKeys()){
      return;
      }
   if (CLC_SR_KeyEchoHandledByARIA(event)){
      return;
      }
   CLC_SR_SpellTheEvent = true;
   CLC_SR_SpeakKeyEventBuffer = String.fromCharCode(event.charCode);
   if (CLC_SR_ShouldEchoKeys(event)){
      CLC_SR_Stop = true; 
      if (CLC_SR_SpellTheEvent){
         if (CLC_IsUpper(CLC_SR_SpeakKeyEventBuffer)){
            window.setTimeout("CLC_ShoutSpell(CLC_SR_SpeakKeyEventBuffer,2);", 0);
            return;
            }
         window.setTimeout("CLC_ShoutSpell(CLC_SR_SpeakKeyEventBuffer,0);", 0);  
         }
      else{
         window.setTimeout("CLC_Shout(CLC_SR_SpeakKeyEventBuffer,0);", 0);  
         }
      }
   }



//------------------------------------------
//Sets the event listeners to catch events
//
function CLC_SR_EchoKeys_Init(){   
   //Echo Keys
   window.addEventListener("keypress", CLC_SR_EchoKeys_EventAnnouncer, false);   
   }

//------------------------------------------


function CLC_SR_ShouldEchoKeys(event){  
   if (!event.target){
      return false;
      }
   //Check and see if the user was trying to use an Accesskey
   if (event.altKey){
      return false;
      }
   //Check and see if the user was trying to move OUT of the input and onto the next object
   if (event.ctrlKey && event.shiftKey){
      return false;
      }
   //Sticky mod has same effect as ctrl+shift
   if (CLC_SR_StickyModOn && CLC_SR_Query_UseStickyMod()){
      return false;
      }
   //Check and see if the user was trying to tab OUT of the input and onto the next object
   if (event.keyCode == 9){
      return false;
      }
   if (event.target.id && event.target.id.toLowerCase()=="urlbar"){
      return true;
      }
   if (event.target.localName && event.target.localName.toLowerCase()=="input"){
      if (event.target.type && event.target.type.toLowerCase() == "password"){
         CLC_SR_SpeakKeyEventBuffer = '*';
         }
      else if (event.target.type && event.target.type.toLowerCase() == "text"){
        if (CLC_SR_SpeakKeyEventBuffer == ' '){
          var start = event.target.value.lastIndexOf(' ');
          if (start == -1){
            start = 0;
            }
          var word = event.target.value.substring(start);
          if (word.length > 1){
            CLC_SR_SpeakKeyEventBuffer = event.target.value.substring(start);    
            CLC_SR_SpellTheEvent = false;          
            }
          }
        }
      return true;
      }
   if (event.target.localName && event.target.localName.toLowerCase()=="select"){
      CLC_SR_SpeakKeyEventBuffer = event.target.options[event.target.options.selectedIndex].textContent;       
      CLC_SR_SpellTheEvent = false;
      return true;
      }
   if (event.target.localName && event.target.localName.toLowerCase()=="textarea"){
      return true;
      }

   //For Chatzilla
   if (event.target.id && event.target.id.toLowerCase()=="input"){
      return true;
      }
   if (event.target.id && event.target.id.toLowerCase()=="multiline-input"){
      return true;
      }
   return false;
   }



//------------------------------------------
function CLC_SR_KeyEchoHandledByARIA(event){
   if ( CLC_GetClosestAncestorWithRole(event.target, "slider") ||
        CLC_GetClosestAncestorWithRole(event.target, "checkbox") ||
        CLC_GetClosestAncestorWithRole(event.target, "checkboxtristate") ||
        CLC_GetClosestAncestorWithRole(event.target, "radio") ||
        CLC_GetClosestAncestorWithRole(event.target, "treeitem") ||
        CLC_GetClosestAncestorWithRole(event.target, "listbox") ||
        CLC_GetClosestAncestorWithRole(event.target, "menuitem")    ){
      return true;
      }

   return false;
   }