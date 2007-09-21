

//------------------------------------------
//Function used to announce menus when 
//DOMMenuItemActive events are caught.
//
//This function is trickier than it seems - 
//the way it is done now is one of the few ways
//that actually work, so tweak at your own risk.
//
//The input arg MUST be named "event" for this to work correctly
//with the event handler.
//
//Uses the setTimeout function to immediately dispatch the 
//CLC_Shout function as an independent thread to reduce browser lag.
//
//A global SpeakEventBuffer MUST be used! Else the function
//ends soon as CLC_Shout is launched, the local string will disappear
//and NOTHING will be said. Global buffer solves this problem.
//
//Radio button status is not announced, but that is a bug in mozilla.
//https://bugzilla.mozilla.org/show_bug.cgi?id=280057
//
function CLC_SR_SpeakMenus_EventAnnouncer(event){
   if (!CLC_SR_Query_SpeakEvents()){
      return;
      }
   CLC_SR_SpeakEventBuffer = event.target.accessible.name;
   if (event.target.accessible.finalState && (event.target.accessible.finalState & event.target.accessible.STATE_HASPOPUP)){
       CLC_SR_SpeakEventBuffer = CLC_SR_SpeakEventBuffer + CLC_SR_MSG0006;
       }  
   if (event.target.accessible.finalState && (event.target.accessible.finalState & event.target.accessible.STATE_UNAVAILABLE)){
       CLC_SR_SpeakEventBuffer = CLC_SR_SpeakEventBuffer + CLC_SR_MSG0005;
       }  
   if (event.target.accessible.finalState && (event.target.accessible.finalState & event.target.accessible.STATE_CHECKED)){
       CLC_SR_SpeakEventBuffer = CLC_SR_SpeakEventBuffer + CLC_SR_MSG0009;
       }  
   CLC_SR_Stop = true; 
   window.setTimeout("CLC_Shout(CLC_SR_SpeakEventBuffer,1);", 0);  
   }



//------------------------------------------
//Sets the event listeners to catch events
//
function CLC_SR_SpeakEvents_Init(){   
   //Speak menus
   window.addEventListener("DOMMenuItemActive", CLC_SR_SpeakMenus_EventAnnouncer, false);
   //Speak focused window items when appropriate (ie, URL bar)
   window.addEventListener("focus", CLC_SR_SpeakFocus_EventAnnouncer, false);
   //Not sure about the rest - none for now
   }


//------------------------------------------
//Note that this is only for focused items in the window itself!
//Function used to announce focused items when 
//focus events are caught. This should only be
//used for speaking control items like the URL bar; 
//things on the page should be read back normally.
//
//This function is trickier than it seems - 
//the way it is done now is one of the few ways
//that actually work, so tweak at your own risk.
//
//The input arg MUST be named "event" for this to work correctly
//with the event handler.
//
//Uses the setTimeout function to immediately dispatch the 
//CLC_Shout function as an independent thread to reduce browser lag.
//
//A global SpeakEventBuffer MUST be used! Else the function
//ends soon as CLC_Shout is launched, the local string will disappear
//and NOTHING will be said. Global buffer solves this problem.
//

function CLC_SR_SpeakFocus_EventAnnouncer(event){ 
   if (!CLC_SR_Query_SpeakEvents()){
      return;
      }
   //Announce the URL bar when focused
   if (event.target.id=="urlbar"){
      CLC_SR_SpeakEventBuffer = event.target.value;
      CLC_SR_SpeakEventBuffer = CLC_SR_MSG0010 + CLC_SR_SpeakEventBuffer;      
      CLC_SR_Stop = true; 
      window.setTimeout("CLC_Shout(CLC_SR_SpeakEventBuffer,1);", 0);
      return;
      }      
   //Not sure about the rest - none for now
   }


//------------------------------------------
//Note that this is for focused HTML elements only!
//
function CLC_SR_SpeakHTMLFocusEvents_Init(){
   var framesArray = window._content.document.documentElement.getElementsByTagName("frame"); 
   for(i =0; i < framesArray.length; i++){
      framesArray[i].contentWindow.document.body.addEventListener("focus", CLC_SR_SpeakHTMLFocus_EventAnnouncer, true);
      }
   CLC_Window().document.body.addEventListener("focus", CLC_SR_SpeakHTMLFocus_EventAnnouncer, true);
   }

//------------------------------------------
//Note that this is for focused HTML elements only!
//
//The purpose of this function is to keep the focus 
//synchronized between the Fire Vox current object
//and what the user is focusing on.
//
function CLC_SR_SpeakHTMLFocus_EventAnnouncer(event){
   if (!CLC_SR_Query_SpeakEvents()){
      return;
      }
   if (CLC_SR_ActOnFocusedElements){
      var temp;
      try{
         temp = CLC_GetFirstAtomicObject(event.target);
         if (temp){
            CLC_SR_PrevAtomicObject = CLC_SR_CurrentAtomicObject;
            CLC_SR_CurrentAtomicObject = temp;
            CLC_MoveCaret(CLC_SR_CurrentAtomicObject);
            window.setTimeout("CLC_SR_ReadCurrentAtomicObject();", 0);
            }
         }
      catch(e){};
      }
   }

//------------------------------------------
//WAI-ARIA widgets will modify DOM attributes when they are 
//activated, so watch for those events.
//
function CLC_SR_SpeakARIAWidgetEvents_Init(){
   var framesArray = window._content.document.documentElement.getElementsByTagName("frame"); 
   for(i =0; i < framesArray.length; i++){
      framesArray[i].contentWindow.document.body.addEventListener("DOMAttrModified", CLC_SR_SpeakARIAWidgetEvents_EventAnnouncer, true);
      }
   CLC_Window().document.body.addEventListener("DOMAttrModified", CLC_SR_SpeakARIAWidgetEvents_EventAnnouncer, true);
   }


//------------------------------------------
//Process the various WAI-ARIA widget events when they are caught.
//
function CLC_SR_SpeakARIAWidgetEvents_EventAnnouncer(event){
   if (!CLC_SR_Query_SpeakEvents()){
      return;
      }
   //For an element that the user has to be focused on to control,
   //then if the user has speak events turned on it means that the 
   //element will be the CLC_SR_CurrentAtomicObject since that is
   //updated when a focused object is spoken. Therefore, if the
   //event target is the same as CLC_SR_CurrentAtomicObject,
   //then an attr change was probably caused by the user and the 
   //change should be announced.
   if ( (CLC_SR_CurrentAtomicObject == event.target) && 
        ((event.attrName == "checked") || (event.attrName == "valuenow") || (event.attrName == "activedescendant")) ){
      CLC_SR_SpeakEventBuffer = CLC_GetStatusFromRole(event.target);
      CLC_SR_Stop = true; 
      window.setTimeout("CLC_Shout(CLC_SR_SpeakEventBuffer,1);", 0);
      }

   //Try to do something more elegant with tree items, but this works for now.
   if (event.attrName == "expanded"){
      CLC_SR_GoToAndRead(event.target);
      }
   }
