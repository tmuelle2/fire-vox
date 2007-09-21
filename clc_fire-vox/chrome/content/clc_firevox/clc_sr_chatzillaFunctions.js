


//------------------------------------------
function CLC_SR_ChatZilla_TranscriptMessageNav(theDirection){  
   var objectAtCursor = CLC_GetAtomicObjectAtCursor();
   var chatMessageAtCursor = CLC_GetClosestAncestorThatIs(objectAtCursor,"tr");

   if (chatMessageAtCursor){      
      //First time using the context control
      if (chatMessageAtCursor != CLC_SR_CurrentAtomicObject){
         CLC_SR_PrevAtomicObject = CLC_SR_CurrentAtomicObject;
         CLC_SR_CurrentAtomicObject = chatMessageAtCursor;
         }
      //Get the appropriate prev/next message
      else {
         if (theDirection == "down"){
            var nextChatMessage = chatMessageAtCursor.nextSibling;
            while (nextChatMessage && !CLC_GetClosestAncestorThatIs(nextChatMessage,"tr")){
               nextChatMessage = CLC_GetClosestAncestorThatIs(nextChatMessage.nextSibling,"tr");
               }
            //Out of messages
            if (!nextChatMessage){
               window.setTimeout("CLC_Shout(CLC_SR_MSG0034,0);", 0);
               return;
               }
            else{
               CLC_SR_PrevAtomicObject = CLC_SR_CurrentAtomicObject;
               CLC_SR_CurrentAtomicObject = CLC_GetClosestAncestorThatIs(nextChatMessage,"tr");
               }
            }
         else if (theDirection == "up"){
            var prevChatMessage = chatMessageAtCursor.previousSibling;
            while (prevChatMessage && !CLC_GetClosestAncestorThatIs(prevChatMessage,"tr")){
               prevChatMessage = CLC_GetClosestAncestorThatIs(prevChatMessage.previousSibling,"tr");
               }
            //Out of messages
            if (!prevChatMessage){
               window.setTimeout("CLC_Shout(CLC_SR_MSG0034,0);", 0);
               return;
               }
            else{
               CLC_SR_PrevAtomicObject = CLC_SR_CurrentAtomicObject;
               CLC_SR_CurrentAtomicObject = CLC_GetClosestAncestorThatIs(prevChatMessage,"tr");
               }
            }
         else if (theDirection == "right"){
            var nextChatMessage = chatMessageAtCursor.nextSibling;
            var theUserNameStr = CLC_SR_CurrentAtomicObject.childNodes[1].textContent;
            while ( nextChatMessage && 
                    ( !CLC_GetClosestAncestorThatIs(nextChatMessage,"tr") || 
                      (nextChatMessage.childNodes[1].textContent != theUserNameStr) ) ){
               nextChatMessage = CLC_GetClosestAncestorThatIs(nextChatMessage.nextSibling,"tr");
               }
            //Out of messages
            if (!nextChatMessage){
               window.setTimeout("CLC_Shout(CLC_SR_MSG0034,0);", 0);
               return;
               }
            else{
               CLC_SR_PrevAtomicObject = CLC_SR_CurrentAtomicObject;
               CLC_SR_CurrentAtomicObject = CLC_GetClosestAncestorThatIs(nextChatMessage,"tr");
               }
            }
         else if (theDirection == "left"){
            var prevChatMessage = chatMessageAtCursor.previousSibling;
            var theUserNameStr = CLC_SR_CurrentAtomicObject.childNodes[1].textContent;
            while ( prevChatMessage && 
                    ( !CLC_GetClosestAncestorThatIs(prevChatMessage,"tr") || 
                      (prevChatMessage.childNodes[1].textContent != theUserNameStr) ) ){
               prevChatMessage = CLC_GetClosestAncestorThatIs(prevChatMessage.previousSibling,"tr");
               }
            //Out of messages
            if (!prevChatMessage){
               window.setTimeout("CLC_Shout(CLC_SR_MSG0034,0);", 0);
               return;
               }
            else{
               CLC_SR_PrevAtomicObject = CLC_SR_CurrentAtomicObject;
               CLC_SR_CurrentAtomicObject = CLC_GetClosestAncestorThatIs(prevChatMessage,"tr");
               }
            }

         }

      //Message has been selected - read it now
      var theUserName = CLC_SR_CurrentAtomicObject.childNodes[1].childNodes[1];
      var theUserNameText = CLC_SR_MSG0035;
      if (theUserName){
         theUserNameText = theUserName.textContent + ". ";
         }
      var theMessage = CLC_SR_CurrentAtomicObject.childNodes[2].childNodes[0];
      CLC_Unhighlight();
      if (CLC_SR_Query_ShouldHighlight()){
         var Highlightable = CLC_FindHighlightable(theMessage);
         if(CLC_AcontainsB(CLC_SR_LastHighlightable, Highlightable)){
            //Avoid keeping a highlight on the whole page if possible
            if (CLC_SR_LastHighlightable.tagName && CLC_SR_LastHighlightable.tagName.toLowerCase() != "body") {
               Highlightable = CLC_SR_LastHighlightable;
	       }
            }
         if (Highlightable){
            CLC_Highlight(Highlightable);
            }
         CLC_SR_LastHighlightable = Highlightable;
         }
      CLC_SR_Scroll();
      CLC_MoveCaret(theMessage);   
      CLC_SR_SpeakEventBuffer = theUserNameText + theMessage.textContent;
      window.setTimeout("CLC_Shout(CLC_SR_SpeakEventBuffer,0);", 0);
      //Clear all live region announcements
      CLC_SR_DOMMutationProcessor_Init();
      }
   }

//------------------------------------------

var CLC_SR_CurrentContextObject;


//------------------------------------------
function CLC_SR_ContextControls(theDirection){
   if (window.location == "chrome://chatzilla/content/chatzilla.xul"){
      CLC_SR_ChatZilla_TranscriptMessageNav(theDirection);
      }
   var objectAtCursor = CLC_GetAtomicObjectAtCursor();
   var chatMessageAtCursor = CLC_GetClosestAncestorWithAttribute(objectAtCursor,"aria:role","chatMessage");
   if (chatMessageAtCursor){      
      //First time using the context control
      if (chatMessageAtCursor != CLC_SR_CurrentAtomicObject){
         CLC_SR_PrevAtomicObject = CLC_SR_CurrentAtomicObject;
         CLC_SR_CurrentAtomicObject = chatMessageAtCursor;
         }
      //Get the appropriate prev/next message
      else {
         if (theDirection == "down"){
            var nextChatMessage = chatMessageAtCursor.nextSibling;
            while (nextChatMessage && !CLC_GetClosestAncestorWithAttribute(nextChatMessage,"aria:role","chatMessage")){
               nextChatMessage = CLC_GetClosestAncestorWithAttribute(nextChatMessage.nextSibling,"aria:role","chatMessage");
               }
            //Out of messages
            if (!nextChatMessage){
               window.setTimeout("CLC_Shout(CLC_SR_MSG0034,0);", 0);
               return;
               }
            else{
               CLC_SR_PrevAtomicObject = CLC_SR_CurrentAtomicObject;
               CLC_SR_CurrentAtomicObject = CLC_GetClosestAncestorWithAttribute(nextChatMessage,"aria:role","chatMessage");
               }
            }
         else if (theDirection == "up"){
            var prevChatMessage = chatMessageAtCursor.previousSibling;
            while (prevChatMessage && !CLC_GetClosestAncestorWithAttribute(prevChatMessage,"aria:role","chatMessage")){
               prevChatMessage = CLC_GetClosestAncestorWithAttribute(prevChatMessage.previousSibling,"aria:role","chatMessage");
               }
            //Out of messages
            if (!prevChatMessage){
               window.setTimeout("CLC_Shout(CLC_SR_MSG0034,0);", 0);
               return;
               }
            else{
               CLC_SR_PrevAtomicObject = CLC_SR_CurrentAtomicObject;
               CLC_SR_CurrentAtomicObject = CLC_GetClosestAncestorWithAttribute(prevChatMessage,"aria:role","chatMessage");
               }
            }
         else if (theDirection == "right"){
            var nextChatMessage = chatMessageAtCursor.nextSibling;
            var theUserNameStr = CLC_GetDescendentNodesWithAttribute(CLC_SR_CurrentAtomicObject, "aria:role", "username")[0].textContent;
            while ( nextChatMessage && 
                    ( !CLC_GetClosestAncestorWithAttribute(nextChatMessage, "aria:role","chatMessage") || 
                      (CLC_GetDescendentNodesWithAttribute(nextChatMessage, "aria:role", "username")[0].textContent != theUserNameStr) ) ){
               nextChatMessage = CLC_GetClosestAncestorWithAttribute(nextChatMessage.nextSibling,"aria:role","chatMessage");
               }
            //Out of messages
            if (!nextChatMessage){
               window.setTimeout("CLC_Shout(CLC_SR_MSG0034,0);", 0);
               return;
               }
            else{
               CLC_SR_PrevAtomicObject = CLC_SR_CurrentAtomicObject;
               CLC_SR_CurrentAtomicObject = CLC_GetClosestAncestorWithAttribute(nextChatMessage,"aria:role","chatMessage");
               }
            }
         else if (theDirection == "left"){
            var prevChatMessage = chatMessageAtCursor.previousSibling;
            var theUserNameStr = CLC_GetDescendentNodesWithAttribute(CLC_SR_CurrentAtomicObject, "aria:role", "username")[0].textContent;
            while ( prevChatMessage && 
                    ( !CLC_GetClosestAncestorWithAttribute(prevChatMessage, "aria:role","chatMessage") || 
                      (CLC_GetDescendentNodesWithAttribute(prevChatMessage, "aria:role", "username")[0].textContent != theUserNameStr) ) ){
               prevChatMessage = CLC_GetClosestAncestorWithAttribute(prevChatMessage.previousSibling,"aria:role","chatMessage");
               }
            //Out of messages
            if (!prevChatMessage){
               window.setTimeout("CLC_Shout(CLC_SR_MSG0034,0);", 0);
               return;
               }
            else{
               CLC_SR_PrevAtomicObject = CLC_SR_CurrentAtomicObject;
               CLC_SR_CurrentAtomicObject = CLC_GetClosestAncestorWithAttribute(prevChatMessage,"aria:role","chatMessage");
               }
            }

         }
      //Message has been selected - read it now
      var theUserName = CLC_GetDescendentNodesWithAttribute(CLC_SR_CurrentAtomicObject, "aria:role", "username")[0];
      var theMessage = CLC_GetDescendentNodesWithAttribute(CLC_SR_CurrentAtomicObject, "aria:role", "content")[0];
      CLC_Unhighlight();
      if (CLC_SR_Query_ShouldHighlight()){
         var Highlightable = CLC_FindHighlightable(theMessage);
         if(CLC_AcontainsB(CLC_SR_LastHighlightable, Highlightable)){
            //Avoid keeping a highlight on the whole page if possible
            if (CLC_SR_LastHighlightable.tagName && CLC_SR_LastHighlightable.tagName.toLowerCase() != "body") {
               Highlightable = CLC_SR_LastHighlightable;
	       }
            }
         if (Highlightable){
            CLC_Highlight(Highlightable);
            }
         CLC_SR_LastHighlightable = Highlightable;
         }
      CLC_SR_Scroll();
      CLC_MoveCaret(theMessage);   
      CLC_SR_SpeakEventBuffer = theUserName.textContent + ". " + theMessage.textContent;
      window.setTimeout("CLC_Shout(CLC_SR_SpeakEventBuffer,0);", 0);
      //Clear all live region announcements
      CLC_SR_DOMMutationProcessor_Init();
      }

   }








