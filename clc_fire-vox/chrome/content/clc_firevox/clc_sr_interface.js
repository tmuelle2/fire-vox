

//This file is only for functions which are interfaces (ie they have a mapping
//to something in the clc_firevoxOverlay.xul file).
//Functions here should perform a minimal amount of processing;
//processing tasks should be left to the functions in the other files.



//-----------------------------------------------
//Reads through the content in the direction
//specified. -1 to go backwards, +1 to go forwards.
//
function CLC_SR_ReadContent(direction){
   //Do the "by sentences" version if the user has that option selected
   if(CLC_SR_Query_ReadBySentences()){
      CLC_SR_ReadContentBySentence(direction);
      return;
      }

   //Otherwise do the normal "by chunks" version
   CLC_SR_CurrentLevel = 0;
   CLC_CaretModeOn();
   if (!CLC_Ready()){
      CLC_Interrupt();
      }
   CLC_Unhighlight();
   CLC_SR_SetCurrentAtomicObject(direction);
   if (CLC_SR_CurrentAtomicObject){
      //Cursor matching is known to be risky and can 
      //lead to unintentional looping. 
      //Until the user intentionally moves the cursor, 
      //this should be false.
      CLC_SR_UseCursorMatching = false;

      CLC_SR_AdjustScreen();
      CLC_SR_AnnounceCurrentObj();

      //Find the language of the content and set the synthesizer
      if (CLC_SR_Query_AutodetectLang()){
         var currentObjLang = CLC_Content_FindLanguage(CLC_SR_CurrentAtomicObject);
         CLC_SetLanguage(currentObjLang);
         }
      //Read out the object's content
      if (CLC_SR_Query_UseCSSSpeechProperties()){
         CLC_SR_ReadUsingProperties(CLC_SR_CurrentAtomicObject);
         }
      else {
         CLC_Read(CLC_SR_CurrentAtomicObject,CLC_GetTextContent(CLC_SR_CurrentAtomicObject), 0);
         }

      //Reset to the default language
      if (CLC_SR_Query_AutodetectLang()){
         CLC_SetLanguage(CLC_SR_DefaultLanguage);
         }

      //Say the object's status if it has a status
      var CurrentAtomicObjectStatus = CLC_GetStatus(CLC_SR_CurrentAtomicObject);
      if (CurrentAtomicObjectStatus){
         CLC_Say(CurrentAtomicObjectStatus, 0);
         }
       
      CLC_MoveCaret(CLC_SR_CurrentAtomicObject); //Make sure the cursor is placed properly
      }
   else {
      CLC_Say(CLC_SR_MSG0001, 0); 
      }
   }

//-----------------------------------------------
//Retrieves additional information about the current object
//Each time this is invoked, it will go up a level in the DOM
//
function CLC_SR_GetMoreInfo(){
   if (!CLC_SR_CurrentAtomicObject){
      return "";
      }
   CLC_Interrupt();
   var reversed_lineage = CLC_GetLogicalLineage(CLC_SR_CurrentAtomicObject).reverse();
   var place_in_lineage = 0;
   for (var i = 0; (reversed_lineage[place_in_lineage] && (i < CLC_SR_CurrentLevel) ); i++){
      place_in_lineage++;
      }   
   var detailed_text = "";
   while (reversed_lineage[place_in_lineage] && !detailed_text){
      detailed_text = CLC_GenerateDetailedInfo(reversed_lineage[place_in_lineage]);
      var additionalLabelText = "";
      var additionalLabelObjArray = CLC_GetAssociatedLabels(reversed_lineage[place_in_lineage]);
      for (var i=0; i<additionalLabelObjArray.length; i++){
         additionalLabelText = additionalLabelText + CLC_GetTextContent(additionalLabelObjArray[i]);
         }
      if (additionalLabelText){
         additionalLabelText = CLC_SR_MSG0036 + additionalLabelText;
         }
      var additionalDescText = "";
      var additionalDescObjArray = CLC_GetAssociatedDescriptions(reversed_lineage[place_in_lineage]);
      for (var i=0; i<additionalDescObjArray.length; i++){
         additionalDescText = additionalDescText + CLC_GetTextContent(additionalDescObjArray[i]);
         }
      if (additionalDescText){
         additionalDescText = CLC_SR_MSG0037 + additionalDescText;
         }
      detailed_text = additionalLabelText + detailed_text + additionalDescText;
      CLC_SR_CurrentLevel++;
      place_in_lineage++;
      }
   if (!detailed_text){
      CLC_SR_CurrentLevel = 0;
      CLC_Say(CLC_SR_MSG0002, 0);
      }
   else {
      CLC_Say(detailed_text, 0);
      }
   }

//-----------------------------------------------
//Spells out what is at the cursor
//This function is a work-in-progress - it should
//be restricted to just one word, not the entire contents.
//
function CLC_SR_SpellOut(){
   if (!CLC_SR_CurrentAtomicObject){
      return "";
      }
   CLC_Interrupt();
   CLC_Spell(CLC_GetTextContent(CLC_SR_CurrentAtomicObject), 0);
   }



//-----------------------------------------------
//Speaks the selected text

function CLC_SR_SaySelected(){
   var selectedText = CLC_GetSelectedText();
   try{
      //Find the language of the content and set the synthesizer
      if (CLC_SR_Query_AutodetectLang()){
         var currentObjLang = CLC_Content_FindLanguage(CLC_Window().getSelection().focusNode);
         CLC_SetLanguage(currentObjLang);
         }
      }
   catch(e){}
   CLC_Shout(selectedText,0);
   //Reset to the default language
   if (CLC_SR_Query_AutodetectLang()){
      CLC_SetLanguage(CLC_SR_DefaultLanguage);
      }
   }

//-----------------------------------------------
//Repeats the last thing that was just read

function CLC_SR_Repeat(){
   if(CLC_Recently_Read(0)){
      CLC_Interrupt();
      CLC_Say(CLC_GetTextContent(CLC_Recently_Read(0)), 0);      
      }
   }

//-----------------------------------------------
//Initializes the screen reader
//
function CLC_SR_Init(){   
   CLC_SR_InitPref();
   if (window.location == "chrome://global/content/commonDialog.xul"){
      CLC_SR_Init_CommonDialog();
      }
   else if (window.location == "chrome://browser/content/preferences/preferences.xul"){
      CLC_SR_Init_OptionsDialog();
      }
   else{
      window.clearTimeout(CLC_SR_LastProcessMutationWindowTimeoutID);
      CLC_ClearMutationEvents();
      CLC_SR_Hotkey_Init();
      CLC_SR_Mouseclick_Init();
      CLC_SR_Init_MainBrowser();
      window.setTimeout("CLC_SR_DOMMutationProcessor_Init();", 5000); //Do not start monitoring mutation events 
                                                                      //until after a delay to prevent announcing ads 
                                                                      //being injected into the page when it first loads
      }
   }

//-----------------------------------------------
function CLC_SR_StopSpeaking(){
   CLC_SR_Stop = true;
   CLC_Interrupt();
   }   

//-----------------------------------------------
function CLC_SR_LaunchAutoReader(){
   CLC_Interrupt();
   CLC_SR_Stop = false;
   window.setTimeout("CLC_SR_AutoRead();", 0);     
   } 


//-----------------------------------------------

function CLC_SR_ReadCurrentAtomicObject(){
   CLC_SR_CurrentLevel = 0;
   CLC_CaretModeOn();
   CLC_Interrupt();
   CLC_Unhighlight();

   if (CLC_SR_CurrentAtomicObject){
      if (CLC_SR_ForcedScreenAdjust || CLC_SR_Query_AdjustOnFocus()){
         CLC_SR_AdjustScreen();
         }
      else{
         1+1;
         }
      CLC_SR_BriefAnnounceCurrentObj();

      //Find the language of the content and set the synthesizer
      if (CLC_SR_Query_AutodetectLang()){
         var currentObjLang = CLC_Content_FindLanguage(CLC_SR_CurrentAtomicObject);
         CLC_SetLanguage(currentObjLang);
         }

      //Read out the object's content
      if (CLC_SR_Query_UseCSSSpeechProperties()){
         CLC_SR_ReadUsingProperties(CLC_SR_CurrentAtomicObject);
         }
      else {
         CLC_Read(CLC_SR_CurrentAtomicObject,CLC_GetTextContent(CLC_SR_CurrentAtomicObject), 0);
         }

      //Reset to the default language
      if (CLC_SR_Query_AutodetectLang()){
         CLC_SetLanguage(CLC_SR_DefaultLanguage);
         }

      CLC_Say(CLC_GetStatus(CLC_SR_CurrentAtomicObject), 0);
      }
   else {
      CLC_Say(CLC_SR_MSG0001, 0); 
      }
   CLC_SR_ForcedScreenAdjust = false;
   }


//-----------------------------------------------

function CLC_SR_ReadCurrentPosition(){
   CLC_SR_CurrentLevel = 0;
   CLC_CaretModeOn();
   CLC_Interrupt();
   CLC_Unhighlight();
   try{ 
      CLC_SR_MatchCurrentObjWithCaret();
      }
   catch(e){};
   if (CLC_SR_CurrentAtomicObject){
      if (CLC_SR_ForcedScreenAdjust || CLC_SR_Query_AdjustOnFocus()){
         CLC_SR_AdjustScreen();
         }
      else{
         1+1;
         }
      CLC_SR_BriefAnnounceCurrentObj();

      //Find the language of the content and set the synthesizer
      if (CLC_SR_Query_AutodetectLang()){
         var currentObjLang = CLC_Content_FindLanguage(CLC_SR_CurrentAtomicObject);
         CLC_SetLanguage(currentObjLang);
         }

      //Read out the object's content
      if (CLC_SR_Query_UseCSSSpeechProperties()){
         CLC_SR_ReadUsingProperties(CLC_SR_CurrentAtomicObject);
         }
      else {
         CLC_Read(CLC_SR_CurrentAtomicObject,CLC_GetTextContent(CLC_SR_CurrentAtomicObject), 0);
         }

      //Reset to the default language
      if (CLC_SR_Query_AutodetectLang()){
         CLC_SetLanguage(CLC_SR_DefaultLanguage);
         }

      CLC_Say(CLC_GetStatus(CLC_SR_CurrentAtomicObject), 0);
      }
   else {
      CLC_Say(CLC_SR_MSG0001, 0); 
      }
   CLC_SR_ForcedScreenAdjust = false;
   }



//-----------------------------------------------
function CLC_SR_Init_MainBrowser(){
   //Cause Fire Vox to ignore the auto refresh on a page
   if (window._content.document.baseURI == CLC_SR_CurrentURI){
      return;
      }
   CLC_SR_CurrentURI = window._content.document.baseURI;

   if (!CLC_SR_Started){
      CLC_SR_Started = true;      
      CLC_SR_StartTTSEngine();
      CLC_SR_SpeakEvents_Init();
      CLC_SR_EchoKeys_Init();
      }
   CLC_SR_StopSpeaking();
   CLC_SR_BrowserWindowHasBeenSet = false;
   CLC_SR_CurrentAtomicObject = 0;
   CLC_SR_PrevAtomicObject = 0;   
   CLC_SR_LastHighlightable = 0;  //Last object that was determined to be highlightable
   CLC_SR_LastFocusable = 0;      //Last object that was determined to be focusable

   //Insert site specific scripts if appropriate
   if (CLC_SR_Query_UseSiteSpecificEnhancements()){
      CLC_SR_InsertSiteSpecificEnhancements(window._content.document);
      }

   //Initialize the CSS Speech Property Rules
   if (CLC_SR_Query_UseCSSSpeechProperties()){
      try{
         CLC_SR_InitSPCSSRules();
         } catch(e){
         CLC_SR_SPCSSRules = 0;  //Something went wrong, don't use speech properties
         }
      }
   else {
      CLC_SR_SPCSSRules = 0;
      }

   if (CLC_SR_Query_SpeakEvents()){
      if (CLC_Ready()){
        CLC_SR_SpeakEventBuffer = CLC_GenerateIDInfo(window._content.document.documentElement);
        if (CLC_SR_Query_AnnounceDOMMutationEventsMode() == 0){
           CLC_SR_SpeakEventBuffer = CLC_SR_SpeakEventBuffer + " " + CLC_SR_MSG0030;
           }
        else if (CLC_SR_Query_AnnounceDOMMutationEventsMode() == 1){
           CLC_SR_SpeakEventBuffer = CLC_SR_SpeakEventBuffer + " " + CLC_SR_MSG0031;
           }
        else if (CLC_SR_Query_AnnounceDOMMutationEventsMode() == 2){
           CLC_SR_SpeakEventBuffer = CLC_SR_SpeakEventBuffer + " " + CLC_SR_MSG0029;
           }
        window.setTimeout("CLC_Shout(CLC_SR_SpeakEventBuffer, 0);", 10);
        }
      }   
   }


//-----------------------------------------------
//This monitors for when iframes are added into a page
//
function CLC_SR_DOMNodeInsertedHandler_NewIFrame(event){
  var target = event.target;
  if (target.tagName && (target.tagName.toLowerCase() == "iframe")){   
    target.addEventListener('load', CLC_SR_NewIFrameLoaded, true);
    }
  }


//-----------------------------------------------
//When a new iframe is loaded, do AxsJAX insertion on all iframes.
//Unfortunately, the load event does not have target, orginalTarget, or
//relatedTarget, so the only thing to do is insert AxsJAX into all
//iframes on the page.
//AxsJAX will not load when it has already loaded, so this is at least safe.
//
function CLC_SR_NewIFrameLoaded(event){
  var iframesArray = window._content.document.getElementsByTagName("iframe");
  for (var i=0; i < iframesArray.length; i++){
    CLC_SR_InsertSiteSpecificEnhancements(iframesArray[i].contentDocument);
    }
  }


//-----------------------------------------------
//This inserts site specific enhancements into the targetDocument
function CLC_SR_InsertSiteSpecificEnhancements(targetDocument){
  var theScript = targetDocument.createElement('script');
  theScript.type = 'text/javascript';
  theScript.src = 'http://google-axsjax.googlecode.com/svn/trunk/common/axsScriptChooser.js';
  targetDocument.getElementsByTagName('head')[0].appendChild(theScript);
  targetDocument.addEventListener('DOMNodeInserted', CLC_SR_DOMNodeInsertedHandler_NewIFrame, true);
  var framesArray = targetDocument.getElementsByTagName("frame");
  for (var i=0; i < framesArray.length; i++){
    CLC_SR_InsertSiteSpecificEnhancements(framesArray[i].contentDocument);
    }
  var iframesArray = targetDocument.getElementsByTagName("iframe");
  for (var i=0; i < iframesArray.length; i++){
    CLC_SR_InsertSiteSpecificEnhancements(iframesArray[i].contentDocument);
    }
  }


//-----------------------------------------------
//This is for the popup boxes like the Javascript alert popups
function CLC_SR_Init_CommonDialog(){
   CLC_SR_StartTTSEngine();
   CLC_SR_CommonDialogEvents_Enable();
   }

//-----------------------------------------------
//This is for the Firefox options dialog window
//This function is commented out and not used until the bugs can be fixed.
function CLC_SR_Init_OptionsDialog(){
//   CLC_SR_StartTTSEngine();
//   CLC_SR_OptionsDialogEvents_Enable();
   }

//-----------------------------------------------
//Adds the focus event listeners that are needed
function CLC_SR_PageInit(){
   CLC_SR_SpeakHTMLFocusEvents_Init();
   CLC_SR_SpeakARIAWidgetEvents_Init();
   }

//-----------------------------------------------
//Builds a popup context menu of the specified type and brings it up
//
function CLC_SR_popUpMenu(menuType){
  var popupMenu;
  if (menuType == "HEADINGS"){
     popupMenu = document.getElementById("CLC_SR_PopUpMenu_01");
     }
  else{
     popupMenu = document.getElementById("CLC_SR_PopUpMenu_00");
     }
  var x = 10;
  var y = 20;
  popupMenu.maxHeight = 400;
  popupMenu.showPopup(popupMenu.parentNode, x, y, 'popup', null, null);
  if (popupMenu.boxObject.screenX != x || popupMenu.boxObject.screenY != y){
    popupMenu.moveTo(x, y);
    }
  popupMenu.focus();
  popupMenu.enableKeyboardNavigator(true);
  }

//-----------------------------------------------
//Brings up the Fire Vox Options menu
//
function CLC_SR_FireVoxOptionsMenu(){
   window.open("chrome://clc_firevox/content/clc_firevox_pref_ui.xul","firevox_options","chrome");
   }

//-----------------------------------------------
//Says the textContent of the parentNode of the element that contains the CLC_SR_CurrentAtomicObject.
//Example: If the CLC_SR_CurrentAtomicObject were the text node of a <a href> which was inside a <p>,
//the thing being said would be the textContent of <p>.
//
function CLC_SR_SayParentTextContent(){
   if (CLC_SR_CurrentAtomicObject){
      var tempObj = CLC_SR_CurrentAtomicObject;
      while (tempObj.nodeType == 3){
         tempObj = tempObj.parentNode;
         if (!tempObj){
            CLC_Shout(CLC_SR_MSG0023, 0); 
            return;
            }
         }
      tempObj = tempObj.parentNode;
      if (!tempObj){
         CLC_Shout(CLC_SR_MSG0023, 0); 
         return;
         }

      //Find the language of the content and set the synthesizer
      if (CLC_SR_Query_AutodetectLang()){
         var currentObjLang = CLC_Content_FindLanguage(tempObj);
         CLC_SetLanguage(currentObjLang);
         }

      CLC_Shout(tempObj.textContent, 0);

      //Reset to the default language
      if (CLC_SR_Query_AutodetectLang()){
         CLC_SetLanguage(CLC_SR_DefaultLanguage);
         }
      }
   else {
      CLC_Shout(CLC_SR_MSG0001, 0); 
      }
   }


//-----------------------------------------------
//Toggles DOM mutation event Announcements on or off.
//
function CLC_SR_ToggleDOMMutationEventAnnouncements(){
   //Don't try toggling if a toggle is already in progress
   if (CLC_SR_MutationEventAnnouncementIsToggling){
      return;
      }
   CLC_SR_MutationEventAnnouncementIsToggling = true;
   //System is default, change it to strict
   if (CLC_SR_Query_AnnounceDOMMutationEventsMode() == 1){
      CLC_Shout(CLC_SR_MSG0029, 0); 
      CLC_SR_SetPref_AnnounceDOMMutationEventsMode(2);
      }
   //System is strict, turn it off.
   else if (CLC_SR_Query_AnnounceDOMMutationEventsMode() == 2){
      CLC_Shout(CLC_SR_MSG0030, 0); 
      CLC_SR_SetPref_AnnounceDOMMutationEventsMode(0);
      }
   //System is off, turn it on to default.
   else{
      CLC_Shout(CLC_SR_MSG0031, 0); 
      //Restart the DOM mutation watcher to clear the event queue
      optionsArray = new Array();
      optionsArray.push(1);
      CLC_InitMutationEventsSystem(CLC_Window().document,optionsArray);
      //Use timeouts here to eliminate the possibility of having more 
      //than one CLC_SR_ProcessMutationEvents thread
      window.setTimeout("CLC_SR_SetPref_AnnounceDOMMutationEventsMode(1);", CLC_SR_MutationEventQueuePollInterval*2);
      window.setTimeout("CLC_SR_ProcessMutationEvents();", CLC_SR_MutationEventQueuePollInterval*3);
      }
   window.setTimeout("CLC_SR_MutationEventAnnouncementIsToggling = false;", CLC_SR_MutationEventQueuePollInterval*5);
   }

//-----------------------------------------------
//Debug use only - pops up information about the current
//atomic object to aid in figuring out where FireVox is.
//
function CLC_Debug_CharCode(){
   alert(CLC_SR_CurrentAtomicObject.textContent.charCodeAt(0) + '\n' + CLC_SR_CurrentAtomicObject.textContent);
   }