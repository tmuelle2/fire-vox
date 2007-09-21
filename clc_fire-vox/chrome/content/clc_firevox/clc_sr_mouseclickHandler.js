//------------------------------------------
//Function used to handle mouse clicks.
//
//The only purpose of this function is to turn on cursor matching,
//
function CLC_SR_Mouseclick_Handler(event){  
   CLC_SR_UseCursorMatching = true;
   //Remove any existing highlights if the user clicked at a new spot on the page
   if (!CLC_AcontainsB(CLC_SR_LastHighlightable, CLC_Window().getSelection().anchorNode)){
      CLC_Unhighlight();
      CLC_SR_LastHighlightable = 0;
      }
   return;
   }



//------------------------------------------
//Sets the event listener to catch keypress events
//
function CLC_SR_Mouseclick_Init(){   
   window.addEventListener("click", CLC_SR_Mouseclick_Handler, false);
   }

//------------------------------------------
