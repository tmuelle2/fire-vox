

//These functions are for adjusting the position of things.
//This includes tasks such as scrolling the window to an appropriate
//position, adjusting focus, highlight, etc.



//-----------------------------------------------
//Evaluates if scrolling should take place or not, and then
//scrolls if it should. 
//The Firefox API for doing this is not documented, so enjoy the magic.
//This code was backported from CLiCk, Speak.
//
function CLC_SR_Scroll(){
   if (window.location == "chrome://chatzilla/content/chatzilla.xul"){
      try{
         var selectionController = client.currentObject.frame.docShell.QueryInterface(Components.interfaces.nsIInterfaceRequestor).getInterface(Components.interfaces.nsISelectionDisplay).QueryInterface(Components.interfaces.nsISelectionController);
         selectionController.scrollSelectionIntoView(Components.interfaces.nsISelectionController.SELECTION_NORMAL,Components.interfaces.nsISelectionController.SELECTION_FOCUS_REGION,true);
         }
      catch(e){
         }
      }
   else{
      try{
         var selectionController = getBrowser().docShell.QueryInterface(Components.interfaces.nsIInterfaceRequestor).getInterface(Components.interfaces.nsISelectionDisplay).QueryInterface(Components.interfaces.nsISelectionController);
         selectionController.scrollSelectionIntoView(Components.interfaces.nsISelectionController.SELECTION_NORMAL,Components.interfaces.nsISelectionController.SELECTION_FOCUS_REGION,true);
         }
      catch(e){
         }
      }
   }

//-----------------------------------------------
//Manages the focus, highlighting, and scroll position
//so that what is shown on screen stays consistent with
//what is being read back.
//
function CLC_SR_AdjustScreen(){
   CLC_Unhighlight();

   if (CLC_SR_Query_ShouldHighlight()){
      var Highlightable = CLC_FindHighlightable(CLC_SR_CurrentAtomicObject);
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

   CLC_MoveCaret(CLC_SR_CurrentAtomicObject);   

   var Focusable = CLC_FindFocusable(CLC_SR_CurrentAtomicObject);
   if (Focusable && CLC_SR_ShouldFocus()){
      CLC_SR_ActOnFocusedElements = false;
      Focusable.focus();
      CLC_SR_ActOnFocusedElements = true;
      }
       
   }



//-----------------------------------------------
//Switches the focused frame
//
function CLC_SR_SwitchFocusedFrame(targetframe){
   CLC_SR_CurrentAtomicObject = 0;
   targetframe.contentWindow.focus();
   CLC_Shout(CLC_SR_MSG0020 + CLC_GenerateIDInfo(targetframe),0);
   }


//-----------------------------------------------
//Determines if Fire Vox should attempt to focus 
//on the current object. True if yes; else no.
//
function CLC_SR_ShouldFocus(){
   var oldFocusable = CLC_FindFocusable(CLC_SR_PrevAtomicObject);
   var newFocusable = CLC_FindFocusable(CLC_SR_CurrentAtomicObject);
   if (oldFocusable == newFocusable){
      return false;
      }
   return true;
   }

//-----------------------------------------------
//Tries to scroll to the sentence.
//The Firefox API for doing this is not documented, so enjoy the magic.
//
function CLC_SR_SentenceScroll(){
   try{
      var selectionController = getBrowser().docShell.QueryInterface(Components.interfaces.nsIInterfaceRequestor).getInterface(Components.interfaces.nsISelectionDisplay).QueryInterface(Components.interfaces.nsISelectionController);
      selectionController.scrollSelectionIntoView(Components.interfaces.nsISelectionController.SELECTION_NORMAL,Components.interfaces.nsISelectionController.SELECTION_FOCUS_REGION,true);
      }
   catch(e){
      }
   }
