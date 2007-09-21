
//These functions are for manipulating the current atomic object and
//ensuring that it gets placed where it is supposed to be.
//
//All of these use the PHYSICAL lineage since the goal is to determine
//whether or not the object as it is physically positioned should be spoken, 
//and announcements for logical parents are not needed yet.

//-----------------------------------------------
//Sets the CLC_SR_CurrentAtomicObject to the correct AtomicObject
//
function CLC_SR_SetCurrentAtomicObject(direction){
   if (CLC_SR_UseCursorMatching){
      //Something strange here - there will always be an exception if the 
      //CurrentAtomicObject is a SELECT element, but the try-catch block will
      //be unable to catch this exception and this exception will halt continued execution.
      //Therefore, never ever try to match if the CurrentAtomicObject is a SELECT element!
      if (CLC_SR_CurrentAtomicObject.tagName && CLC_SR_CurrentAtomicObject.tagName.toLowerCase() == "select"){
         //Do nothing
         }
      else {
         //Use try and catch to deal with strange cases where the cursor 
         //is lost. If the cursor is lost, all cursor related functions will
         //fail and the user becomes "stuck" in the page.
         try{
            CLC_SR_MatchCurrentObjWithCaret();
            CLC_SR_MatchCurrentSentenceWithCaret(direction);
            return;
            }
         catch(e){}; //The correct way to address a cursor error is to ignore it.
                     //If the cursor was lost, then ignore cursor positioning  
                     //and simply advance the current object.
         }
      }

   if (direction == 1){
      CLC_SR_NavigateBodyFwd();  
      return;       
      }

   else{
      CLC_SR_NavigateBodyBack();
      return;
      }
      
   }

//-----------------------------------------------
//Moves the current object so that the current object
//is the first atomic text object after the caret.
//
function CLC_SR_MatchCurrentObjWithCaret(){   
   CLC_SR_CurrentAtomicObject = CLC_GetAtomicObjectAtCursor();
   var lineage = CLC_GetLineage(CLC_SR_CurrentAtomicObject);
   while (    CLC_SR_CurrentAtomicObject && 
              ( !CLC_TagInLineage(lineage, "body") || 
                !CLC_HasText(CLC_SR_CurrentAtomicObject) ||
                CLC_SR_ShouldNotSpeak(lineage) )
          ){
      CLC_SR_CurrentAtomicObject = CLC_GetNextAtomicTextObject(CLC_SR_CurrentAtomicObject);
      lineage = CLC_GetLineage(CLC_SR_CurrentAtomicObject);
      } 
   return;
   }

//-----------------------------------------------
//Returns the next atomic object which has text and is within the BODY.
//Note that this function also updates the global variables
//CLC_SR_CurrentAtomicObject & CLC_SR_PrevAtomicObject to reflect
//this forward movement.
//
function CLC_SR_NavigateBodyFwd(){   
   CLC_SR_PrevAtomicObject = CLC_SR_CurrentAtomicObject;
   //First run through - No current object yet
   if (!CLC_SR_CurrentAtomicObject){
      CLC_SR_CurrentAtomicObject = CLC_GetFirstAtomicObject(CLC_Window().document.body);
      }
   //Already ran at least once - have current object
   else{
      //Blur the current object before getting the next one to prevent input blanks
      //from "trapping" the focus.
      CLC_BlurAll(CLC_SR_CurrentAtomicObject);
      CLC_SR_CurrentAtomicObject = CLC_GetNextAtomicTextObject(CLC_SR_CurrentAtomicObject);
      }
   //Ensure that the current atomic object stays within bounds and is readable
   var lineage = CLC_GetLineage(CLC_SR_CurrentAtomicObject);
   while (    CLC_SR_CurrentAtomicObject && 
              ( !CLC_TagInLineage(lineage, "body") || 
                !CLC_HasText(CLC_SR_CurrentAtomicObject) ||
                CLC_SR_ShouldNotSpeak(lineage) )
          ){
      CLC_SR_CurrentAtomicObject = CLC_GetNextAtomicTextObject(CLC_SR_CurrentAtomicObject);        
      lineage = CLC_GetLineage(CLC_SR_CurrentAtomicObject);
      } 
   //Something went wrong here; there should have been a next atomic object, but there wasn't.
   //Assume there was a DOM mutation event that took away the current object and attempt to 
   //recover by using cursor matching.
   if (!CLC_SR_CurrentAtomicObject && CLC_SR_NextAtomicObjectExisted){
      try{
         CLC_SR_MatchCurrentObjWithCaret();
         CLC_SR_MatchCurrentSentenceWithCaret(direction);
         }
      catch(e){};
      }
   CLC_MoveCaret(CLC_SR_CurrentAtomicObject);
   //Check to see if there are prev/next objects for the current object.
   //This information is vital for recovering the user's position 
   //if the current object is lost to a DOM mutation.
   CLC_SR_CheckForPrevNextAtomicObjects();
   return CLC_SR_CurrentAtomicObject;
   }
   

//-----------------------------------------------
//Returns the previous atomic object which has text and is within the BODY.
//Note that this function also updates the global variables
//CLC_SR_CurrentAtomicObject & CLC_SR_PrevAtomicObject to reflect
//this backward movement.
//
function CLC_SR_NavigateBodyBack(){
   CLC_SR_PrevAtomicObject = CLC_SR_CurrentAtomicObject;
   //First run through - No current object yet
   if (!CLC_SR_CurrentAtomicObject){
      CLC_SR_CurrentAtomicObject = CLC_GetLastAtomicObject(CLC_Window().document.body);
      }
   //Already ran at least once - have current object
   else{
      //Blur the current object before getting the next one to prevent input blanks
      //from "trapping" the focus.
      CLC_BlurAll(CLC_SR_CurrentAtomicObject);
      CLC_SR_CurrentAtomicObject = CLC_GetPrevAtomicTextObject(CLC_SR_CurrentAtomicObject);
      }
   //Ensure that the current atomic object stays within bounds and is readable
   var lineage = CLC_GetLineage(CLC_SR_CurrentAtomicObject);
   while (    CLC_SR_CurrentAtomicObject && 
              ( !CLC_TagInLineage(lineage, "body") || 
                !CLC_HasText(CLC_SR_CurrentAtomicObject) ||
                CLC_SR_ShouldNotSpeak(lineage) )
          ){
      CLC_SR_CurrentAtomicObject = CLC_GetPrevAtomicTextObject(CLC_SR_CurrentAtomicObject);
      lineage = CLC_GetLineage(CLC_SR_CurrentAtomicObject);
      } 
   //Something went wrong here; there should have been a prev atomic object, but there wasn't.
   //Assume there was a DOM mutation event that took away the current object and attempt to 
   //recover by using cursor matching.
   if (!CLC_SR_CurrentAtomicObject && CLC_SR_PrevAtomicObjectExisted){
      try{
         CLC_SR_MatchCurrentObjWithCaret();
         CLC_SR_MatchCurrentSentenceWithCaret(direction);
         }
      catch(e){};
      }
   CLC_MoveCaret(CLC_SR_CurrentAtomicObject);
   //Check to see if there are prev/next objects for the current object.
   //This information is vital for recovering the user's position 
   //if the current object is lost to a DOM mutation.
   CLC_SR_CheckForPrevNextAtomicObjects();
   return CLC_SR_CurrentAtomicObject;
   }


//-----------------------------------------------
//Sets the CLC_SR_SentencesArrayIndex to match where the cursor is.
//
function CLC_SR_MatchCurrentSentenceWithCaret(direction){
   //Only attempt this if the user wants to read by sentence
   if (!CLC_SR_Query_ReadBySentences()){
      return;
      }
   try {
      CLC_SR_SentencesArray = CLC_MakeSegments(CLC_GetTextContent(CLC_SR_CurrentAtomicObject));
      CLC_SR_SentencesArrayIndex = CLC_FindSentenceArrayIndexOfCursorPos(CLC_SR_SentencesArray);
      //Adjust the index in anticipation of moving forward one or moving back one before actually reading it.
      if (CLC_SR_SentencesArrayIndex != -1){
         if (direction == 1){
            CLC_SR_SentencesArrayIndex--;
            }
         else{
            CLC_SR_SentencesArrayIndex++;
            }
         }
      }
   catch(e){
      CLC_SR_SentencesArrayIndex = -1;
      }
   }


//-----------------------------------------------
//Checks to see if there are previous and next atomic objects for CLC_SR_CurrentAtomicObject.
//Will set the boolean values for CLC_SR_NextAtomicObjectExisted and CLC_SR_PrevAtomicObjectExisted.
//This information is vital for recovering the user's position if the current object is lost to a DOM mutation.
//
function CLC_SR_CheckForPrevNextAtomicObjects(){
   var dummyObject = CLC_GetPrevAtomicTextObject(CLC_SR_CurrentAtomicObject);
   lineage = CLC_GetLineage(dummyObject);
   while (    dummyObject && 
              ( !CLC_TagInLineage(lineage, "body") || 
                !CLC_HasText(dummyObject) ||
                CLC_SR_ShouldNotSpeak(lineage) )
          ){
      dummyObject = CLC_GetPrevAtomicTextObject(dummyObject);        
      lineage = CLC_GetLineage(dummyObject);
      } 
   if (dummyObject){ CLC_SR_PrevAtomicObjectExisted = true; } else { CLC_SR_PrevAtomicObjectExisted = false;}
   dummyObject = CLC_GetNextAtomicTextObject(CLC_SR_CurrentAtomicObject);
   lineage = CLC_GetLineage(dummyObject);
   while (    dummyObject && 
              ( !CLC_TagInLineage(lineage, "body") || 
                !CLC_HasText(dummyObject) ||
                CLC_SR_ShouldNotSpeak(lineage) )
          ){
      dummyObject = CLC_GetNextAtomicTextObject(dummyObject);        
      lineage = CLC_GetLineage(dummyObject);
      } 
   if (dummyObject){ CLC_SR_NextAtomicObjectExisted = true; } else { CLC_SR_NextAtomicObjectExisted = false;}
   }
