

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
      framesArray[i].contentWindow.document.body.addEventListener("DOMAttrModified", CLC_SR_BodyActiveDescendant_Announcer, false);
      }
   CLC_Window().document.body.addEventListener("focus", CLC_SR_SpeakHTMLFocus_EventAnnouncer, true);
   CLC_Window().document.body.addEventListener("DOMAttrModified", CLC_SR_BodyActiveDescendant_Announcer, false);
   }

//------------------------------------------
//If a web page is using active descendant on the body, 
//then that should be treated as the focused item and spoken.
//
function CLC_SR_BodyActiveDescendant_Announcer(event){
   if (!CLC_SR_Query_SpeakEvents()){
      return;
      }
   if ( CLC_SR_ActOnFocusedElements && (event.target.tagName.toLowerCase() == "body") 
        && (event.attrName == "aria-activedescendant") && (event.newValue) ){
      var targetNode = CLC_Window().document.getElementById(event.newValue);
      //This should not be necessary, but sometimes Firefox is slow in updating its internal
      //state of IDs, causing getElementById to fail on something where the ID was added 
      //very recently. If there is no targetNode, then this bug is the most likely culprit.
      //Get around this by retrying the operation 1/10 of a second later.
      if (!targetNode){
         CLC_SR_FailedActiveDescendantId = event.newValue;
         window.setTimeout("CLC_SR_RetryBodyActiveDescendant_Announcer();", 100);
         return;
         }
      CLC_SR_SpeakEventBuffer = CLC_GetTextContentOfAllChildren(targetNode); 
      window.setTimeout("CLC_Shout(CLC_SR_SpeakEventBuffer,0);", 10);
      }
   }


//------------------------------------------
//This is a hackaround to the problem of Firefox being slow when updating its internal
//state of IDs that are available. Sometimes, if it is too slow, then a recently IDed node will
//not show up and getElementById will return NULL. If this happens, then the operation
//should be retried later.
//
function CLC_SR_RetryBodyActiveDescendant_Announcer(){
   var targetNode = CLC_Window().document.getElementById(CLC_SR_FailedActiveDescendantId);
   CLC_SR_SpeakEventBuffer = CLC_GetTextContentOfAllChildren(targetNode); 
   window.setTimeout("CLC_Shout(CLC_SR_SpeakEventBuffer,0);", 10);
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
   if (event.target.tagName.toLowerCase() == "body"){ //If the body is focused, it is either an 
                                                      //attempt to defocus something or it is 
                                                      //handled by the active descendant. 
                                                      //Therefore, do not try to speak the 
                                                      //body on focus.
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
            if (CLC_SR_Query_UseBriefMode()){
               CLC_SR_SpeakEventBuffer = CLC_GetTextContentOfAllChildren(CLC_SR_CurrentAtomicObject); 
               window.setTimeout("CLC_Shout(CLC_SR_SpeakEventBuffer,0);", 10);
               }
            else {
               window.setTimeout("CLC_SR_ReadCurrentAtomicObject();", 0);
               }
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