//------------------------------------------
//Reads the sentence using the properties of 
//the atomic DOM object that it came from.
//
function CLC_SR_ReadSentenceUsingProperties(targ_atomicObj, targ_string){
   try{
      var currentSPRule = CLC_SynthesizeSPRuleObj(targ_atomicObj, CLC_SR_SPCSSRules);
      if (currentSPRule){
         var theTextContent = targ_string;
         if (currentSPRule.specialActions[0] && (currentSPRule.specialActions[0][1] == 1) ){
            theTextContent = currentSPRule.specialActions[0][0];
            }
         CLC_ReadWithProperties(targ_atomicObj, theTextContent, currentSPRule.properties, currentSPRule.additional);
         }
      else {
         CLC_Read(targ_atomicObj,targ_string, 0);
         }
      } catch(e){
         CLC_Read(targ_atomicObj,targ_string, 0);
      }
   }



//------------------------------------------
//Moves to the next sentence in the sentence array;
//if this causes the index to be out of bounds, it is
//assumed that CLC_SR_ReadContentBySentence will fix it.
//
function CLC_SR_MoveForwardOneSentence(){
   if (CLC_SR_SentencesArrayIndex == -1){
      CLC_SR_SentencesArrayIndex = 0;
      return;
      }
   CLC_SR_SentencesArrayIndex++;
   }


//------------------------------------------
//Moves to the previous sentence in the sentence array;
//if this causes the index to be out of bounds, it is
//assumed that CLC_SR_ReadContentBySentence will fix it.
//
function CLC_SR_MoveBackOneSentence(){
   if (CLC_SR_SentencesArrayIndex == -1){
      try{
         CLC_SR_SentencesArrayIndex = CLC_SR_SentencesArray.length;
         }
      catch(e){
         CLC_SR_SentencesArrayIndex = -1;
         }
      }
   CLC_SR_SentencesArrayIndex--;
   }

//------------------------------------------
//Tries to read a sentence in the forward (direction == +1)
//or backward (direction == -1) direction.
//If it succeeds, it will return true;
//if it fails, it will return false.
//
function CLC_SR_TryToReadSentence(direction){
   if (direction == 1){
       CLC_SR_MoveForwardOneSentence();
       }
   else{
       CLC_SR_MoveBackOneSentence();
       }     
   if (CLC_SR_SentencesArray && CLC_SR_SentencesArray[CLC_SR_SentencesArrayIndex]){ 
      if (!CLC_IsSpeakableString(CLC_SR_SentencesArray[CLC_SR_SentencesArrayIndex])){
         return CLC_SR_TryToReadSentence(direction);
         }
      if(CLC_SR_Query_SelectSentence()){
         CLC_SelectSentence(CLC_SR_CurrentAtomicObject, CLC_SR_SentencesArray, CLC_SR_SentencesArrayIndex);
         CLC_SR_SentenceScroll();
         }

      //Find the language of the content and set the synthesizer
      if (CLC_SR_Query_AutodetectLang()){
         var currentObjLang = CLC_Content_FindLanguage(CLC_SR_CurrentAtomicObject);
         CLC_SetLanguage(currentObjLang);
         }

      if (CLC_SR_Query_UseCSSSpeechProperties()){
         CLC_SR_ReadSentenceUsingProperties(CLC_SR_CurrentAtomicObject, CLC_SR_SentencesArray[CLC_SR_SentencesArrayIndex]);
         }
      else {
         CLC_Read(CLC_SR_CurrentAtomicObject,CLC_SR_SentencesArray[CLC_SR_SentencesArrayIndex], 0);
         }

      //Reset to the default language
      if (CLC_SR_Query_AutodetectLang()){
         CLC_SetLanguage(CLC_SR_DefaultLanguage);
         }
      return true;
      }
   return false;
   }


//------------------------------------------
//Reads through the content in the direction
//specified. -1 to go backwards, +1 to go forwards.
//Reading will be done by sentences rather than chunks.
//
function CLC_SR_ReadContentBySentence(direction){
   CLC_SR_CurrentLevel = 0;
   CLC_CaretModeOn();
   if (!CLC_Ready()){
      CLC_Interrupt();
      }
   //Read the next sentence if the user has not somehow changed the position AND if it's possible;
   //otherwise, reset the sentences array and start over.
   //Note: The comparison must be done in this order since trying to read the next 
   //sentence will cause it to be read - something which should NOT happen if the 
   //user has changed the position already.
   if (!CLC_SR_UseCursorMatching && CLC_SR_TryToReadSentence(direction)){
      //If there is no way to read the next sentence, then announce the status if applicable.
      if ( CLC_SR_SentencesArray && 
           ( (direction==1) && !CLC_SR_SentencesArray[CLC_SR_SentencesArrayIndex + 1] )  ||
           ( (direction!=1) && !CLC_SR_SentencesArray[CLC_SR_SentencesArrayIndex - 1] )     ){
         try{
            //Say the object's status if it has a status
            var CurrentAtomicObjectStatus = CLC_GetStatus(CLC_SR_CurrentAtomicObject);
            if (CurrentAtomicObjectStatus){
               CLC_Say(CurrentAtomicObjectStatus, 0);
               }
            }
         catch(e){}
         }
      return;
      }
   else {
      CLC_SR_SentencesArray = 0;
      CLC_SR_SentencesArrayIndex = -1;
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

      //Setup the sentence array
      CLC_SR_SentencesArray = CLC_MakeSegments(CLC_GetTextContent(CLC_SR_CurrentAtomicObject));

      //Try to read the sentence
      CLC_SR_TryToReadSentence(direction);

      //The sentence highlighting acts as a cursor correction mechanism - 
      //if it is not used, then a correction must be done directly.
      if(!CLC_SR_Query_SelectSentence()){
         CLC_MoveCaret(CLC_SR_CurrentAtomicObject); //Make sure the cursor is placed properly
         }

      //If there is no way to read the next sentence, then announce the status if applicable.
      if ( CLC_SR_SentencesArray && 
           ( (direction==1) && !CLC_SR_SentencesArray[CLC_SR_SentencesArrayIndex + 1] )  ||
           ( (direction!=1) && !CLC_SR_SentencesArray[CLC_SR_SentencesArrayIndex - 1] )     ){
         try{
            //Say the object's status if it has a status
            var CurrentAtomicObjectStatus = CLC_GetStatus(CLC_SR_CurrentAtomicObject);
            if (CurrentAtomicObjectStatus){
               CLC_Say(CurrentAtomicObjectStatus, 0);
               }
            }
         catch(e){}
         }
      }
   else {
      CLC_Say(CLC_SR_MSG0001, 0); 
      }
   }


//------------------------------------------






