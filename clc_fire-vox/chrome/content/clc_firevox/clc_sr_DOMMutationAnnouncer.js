

//These functions are for handling DOM mutation events.


//------------------
//Move these globals once this works
//
var CLC_SR_LiveRegionAnnouncementTimes;
var CLC_SR_LastProcessMutationWindowTimeoutID = 0;
var CLC_SR_LastSpokenMutationType = ""; //Can be "regular" or "notification" or null
var CLC_SR_AssertiveMutationNotificationWaiting = false;
var CLC_SR_MustSpeakNotification = false;

//-----------------------------------------------
//
function CLC_SR_DOMMutationProcessor_Init(){
   CLC_SR_AssertiveMutationEventWaiting = false;
   CLC_SR_AssertiveMutationNotificationWaiting = false;
   CLC_SR_UserActivityLevel = 0;
   CLC_SR_BusyManagingMutations = false;
   CLC_SR_MutationEventAnnouncementIsToggling = false;
   CLC_SR_LiveRegionAnnouncementTimes = new Array();
   CLC_SR_LiveRegionAnnouncementTimes[0] = 0;       //Put in a dummy here; if a real element gets 0 for
                                                    //its id, it will break the "if" check later on. 
   optionsArray = new Array();
   optionsArray.push(1);
   optionsArray.push(1);
   CLC_InitMutationEventsSystem(window._content.document,optionsArray);
   CLC_SR_ProcessMutationEvents();
   }


//-----------------------------------------------
//
function CLC_SR_AnnounceAssertiveMutationEvents(){
   if (!CLC_SR_AssertiveMutationEventWaiting){
      return;
      }
   //Make sure the "assertive" event is still there
   if (CLC_PeekMutationEvent().politeness == "assertive"){
      CLC_SR_SpeakMutation();
      }
   CLC_SR_AssertiveMutationEventWaiting = false;
   }


//-----------------------------------------------
//
function CLC_SR_AnnounceAssertiveMutationNotifications(){
   if (!CLC_SR_AssertiveMutationNotificationWaiting){
      return;
      }
   //Make sure the "assertive" event is still there
   if (CLC_PeekMutationNotification().politeness == "assertive"){
      CLC_SR_SpeakMutation();
      }
   CLC_SR_AssertiveMutationNotificationWaiting = false;
   }


//-----------------------------------------------
//
function CLC_SR_ProcessMutationEvents(){
   if (CLC_SR_Query_AnnounceDOMMutationEventsMode() == 0){
      return;
      }
   if ((CLC_SR_UserActivityLevel > 0) && CLC_Ready() && CLC_SR_Stop){
      CLC_SR_UserActivityLevel--;
      }
   CLC_SR_ManageMutationQueues();
   if ((CLC_SR_UserActivityLevel < 1) && CLC_Ready() && CLC_SR_Stop){ 
      CLC_SR_SpeakMutation();
      }
   CLC_SR_LastProcessMutationWindowTimeoutID = window.setTimeout("CLC_SR_ProcessMutationEvents();", CLC_SR_MutationEventQueuePollInterval);
   }

//-----------------------------------------------
//
function CLC_SR_ManageMutationQueues(){
   //Don't try to manage mutations if that is already happening
   if (CLC_SR_BusyManagingMutations){
      return;
      }
   CLC_SR_BusyManagingMutations = true;

   //Don't do anything if both queues are empty
   if (!CLC_PeekMutationEvent() && !CLC_PeekMutationNotification()){
      CLC_SR_BusyManagingMutations = false;
      return;
      }

   //Throw away everything before the last "rude" notification
   while(CLC_GetNotificationCountsAssociativeArray()["rude"] > 1){
      CLC_SR_AssertiveMutationNotificationWaiting = false;
      CLC_GetMutationNotification();
      }
   //Throw away everything before the last "rude" event
   while(CLC_GetEventCountsAssociativeArray()["rude"] > 1){
      CLC_SR_AssertiveMutationEventWaiting = false;
      CLC_GetMutationEvent();
      }


   var mutationNotificationCounts = CLC_GetNotificationCountsAssociativeArray();
   var mutationEventCounts = CLC_GetEventCountsAssociativeArray();

   //If there is a "rude" notification, announce it immediately - interrupt whatever is going on in the notifications channel.
   if(mutationNotificationCounts["rude"] > 0){
      CLC_SR_MustSpeakNotification = true;
      CLC_SR_AssertiveMutationNotificationWaiting = false;
      while(CLC_PeekMutationNotification().politeness != "rude"){
         CLC_GetMutationNotification();
         }
      if (CLC_SR_LastSpokenMutationType != "regular" || CLC_Ready()){
         CLC_SR_StopSpeaking();
         CLC_SR_SpeakMutation();
         }
      CLC_SR_BusyManagingMutations = false;
      return;
      }

   //If there is a "rude" event, announce it immediately - interrupt whatever is going on in the regular events channel.
   if(mutationEventCounts["rude"] > 0){
      CLC_SR_AssertiveMutationEventWaiting = false;
      while(CLC_PeekMutationEvent().politeness != "rude"){
         CLC_GetMutationEvent();
         }
      if (CLC_SR_LastSpokenMutationType != "notification" || CLC_Ready()){
         CLC_SR_StopSpeaking();
         CLC_SR_SpeakMutation();
         }
      CLC_SR_BusyManagingMutations = false;
      return;
      }

   //If there is an "assertive" notification, set the flag that an assertive notification is waiting.
   if(mutationNotificationCounts["assertive"] > 0){
      CLC_SR_MustSpeakNotification = true;
      while(CLC_PeekMutationNotification().politeness != "assertive"){
         CLC_GetMutationNotification();
         }
      CLC_SR_AssertiveMutationNotificationWaiting = true;
      CLC_SR_BusyManagingMutations = false;
      return;
      }

   //If there is an "assertive" event, set the flag that an assertive event is waiting.
   if(mutationEventCounts["assertive"] > 0){
      while(CLC_PeekMutationEvent().politeness != "assertive"){
         CLC_GetMutationEvent();
         }
      CLC_SR_AssertiveMutationEventWaiting = true;
      CLC_SR_BusyManagingMutations = false;
      return;
      }

   //Manage polite notifications
   if(mutationNotificationCounts["polite"] > 0){
      CLC_SR_MustSpeakNotification = true;
      while(CLC_PeekMutationNotification().politeness != "polite"){
         CLC_GetMutationNotification();
         }
      CLC_SR_BusyManagingMutations = false;
      return;
      }

   //Manage polite events
   if(mutationEventCounts["polite"] > 0){
      while(CLC_PeekMutationEvent().politeness != "polite"){
         CLC_GetMutationEvent();
         }
      CLC_SR_BusyManagingMutations = false;
      return;
      }

   //Purge "off" notifications at the start of the queue
   while(CLC_PeekMutationNotification().politeness == "off"){
      CLC_GetMutationNotification();
      }
   //Purge "off" events at the start of the queue
   while(CLC_PeekMutationEvent().politeness == "off"){
      CLC_GetMutationEvent();
      }
   //Also purge "unknown" events if the setting is "strict"
   if (CLC_SR_Query_AnnounceDOMMutationEventsMode() == 2){
      while((CLC_PeekMutationEvent().politeness == "off") || (CLC_PeekMutationEvent().politeness == "unknown")){
         CLC_GetMutationEvent();
         }
      }

   CLC_SR_BusyManagingMutations = false;
   }

//-----------------------------------------------
//

function CLC_SR_GenerateInfoForTableCellMutation(targetNode){
   var col_heading_text = CLC_GetColHeading(targetNode);      
   if (!col_heading_text){
      col_heading_text = CLC_GuessColHeading(targetNode);
      }
   var row_heading_text = CLC_GetRowHeading(targetNode);
   if (!row_heading_text){
      row_heading_text = CLC_GuessRowHeading(targetNode);
      }
   return (row_heading_text + " " + col_heading_text);
   }
//-----------------------------------------------
//
function CLC_SR_SpeakMutation(){
   var currentMutationEvent;
   if (CLC_SR_MustSpeakNotification){
      CLC_SR_MustSpeakNotification = false;
      currentMutationEvent = CLC_GetMutationNotification();
      CLC_SR_LastSpokenMutationType = "notification";
      }
   else{
      currentMutationEvent = CLC_GetMutationEvent();
      CLC_SR_LastSpokenMutationType = "regular";
      }
   if (!currentMutationEvent){
       return;
       }

   var announcement = "";
   var eventText = "";
   if (currentMutationEvent.type == "change"){
      eventText = currentMutationEvent.postText;
      announcement = CLC_SR_MSG0026;
      }
   else if (currentMutationEvent.type == "removal"){
      eventText = currentMutationEvent.preText;
      announcement = CLC_SR_MSG0027;
      }
   else{
      eventText = currentMutationEvent.postText;
      announcement = CLC_SR_MSG0028;
      }   
   if (currentMutationEvent.atomic == true){
      eventText = currentMutationEvent.atomicText;
      }

   //If interim events shouldn't be announced, then whether 
   //or not this live region should be spoken must be evaluated.
   //Also, the event text will have to be changed to what is current.
   if (!currentMutationEvent.interim && (currentMutationEvent.type != "removal")){
       eventText = "";
       var dateObj = new Date();
       var currentTime = dateObj.getTime();
       var eventCLC_LR_ID = CLC_SR_LiveRegionAnnouncementTimes.length;
       if (currentMutationEvent.atomic == true){
          //Only announce if it is still in the DOM
          if (!currentMutationEvent.closestAtomicLiveRegion.parentNode){ return; }
          eventText = CLC_GetTextContentOfAllChildren(currentMutationEvent.closestAtomicLiveRegion);
          if (currentMutationEvent.closestAtomicLiveRegion.clc_lr_id){
             eventCLC_LR_ID = currentMutationEvent.closestAtomicLiveRegion.clc_lr_id;
             }
          }
       else if (currentMutationEvent.target && currentMutationEvent.target.nodeType != 3){
          if (!currentMutationEvent.target.parentNode){ return; }
          //Only announce if it is still in the DOM
          eventText = CLC_GetTextContentOfAllChildren(currentMutationEvent.target);
          if (currentMutationEvent.target.clc_lr_id){
             eventCLC_LR_ID = currentMutationEvent.target.clc_lr_id;
             }
          }
       else {
          //Only announce if it is still in the DOM
         if (!currentMutationEvent.parentNode.parentNode){ return; }
          eventText = CLC_GetTextContentOfAllChildren(currentMutationEvent.parentNode);
          if (currentMutationEvent.parentNode.clc_lr_id){
             eventCLC_LR_ID = currentMutationEvent.parentNode.clc_lr_id;
             }
          }

       //Don't announce the event if there is nothing to announce.
       if (eventText == ""){
          return;
          }

       //If this region was announced before, check and see when that happened.
       //If that time was after the timestamp of the event, then don't announce the event as it is too old.
       if (eventCLC_LR_ID != CLC_SR_LiveRegionAnnouncementTimes.length){
          if (CLC_SR_LiveRegionAnnouncementTimes[eventCLC_LR_ID] > currentMutationEvent.timestamp){
             return;
             }
          }
       //This region was not announced before, tag it with a CLC_LR_ID
       else{
          if (currentMutationEvent.atomic == true){
             currentMutationEvent.closestAtomicLiveRegion.clc_lr_id = eventCLC_LR_ID;
             }
          else if (currentMutationEvent.target.nodeType != 3){
             currentMutationEvent.target.clc_lr_id = eventCLC_LR_ID;
             }
          else{
             currentMutationEvent.parentNode.clc_lr_id = eventCLC_LR_ID;
             }
          }
       //Update the announcement times record for this live region
       CLC_SR_LiveRegionAnnouncementTimes[eventCLC_LR_ID] = currentTime;
       }

   //Announce the object of the mutation event
   if (currentMutationEvent.parentNode){
      var closestTD = CLC_GetClosestAncestorThatIs(currentMutationEvent.parentNode, "td");
      if (closestTD){
         announcement = announcement + CLC_SR_GenerateInfoForTableCellMutation(closestTD);
         }
      }
   CLC_Say(announcement, 1);

   //Read the object of the mutation event
   if (CLC_SR_Query_UseCSSSpeechProperties()){
      try{
         var currentSPRule = CLC_SynthesizeSPRuleObj(currentMutationEvent.target, CLC_SR_SPCSSRules);
         if (currentSPRule){
            var theTextContent = eventText;
            if (currentSPRule.specialActions[0] && (currentSPRule.specialActions[0][1] == 1) ){
               theTextContent = currentSPRule.specialActions[0][0];
               }
            CLC_ReadWithProperties(currentMutationEvent.target, theTextContent, currentSPRule.properties, currentSPRule.additional);
            }
         else {
            CLC_Read(currentMutationEvent.target,eventText, 0);
            }
         } catch(e){
            CLC_Read(currentMutationEvent.target,eventText, 0);
         }
      }
   else {
      CLC_Read(currentMutationEvent.target,eventText, 0);
      }
   }
