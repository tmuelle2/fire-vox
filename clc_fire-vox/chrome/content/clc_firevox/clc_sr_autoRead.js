

//This file is only for the Auto Reader
//
//The idea here is to fake multithreading capability by having
//a function that calls itself recursively through a setTimeout.
//Because this makes the recursive call a separate thread, there
//is no problem with the user doing something which will interrupt it.
//This function will stop itself if it is interrupted or if it reaches the
//end of the document.
//


function CLC_SR_AutoRead(){
   if (CLC_SR_Stop){
      CLC_Interrupt();
      return;
      }
   if (CLC_Ready()){
      CLC_SR_AnnounceAssertiveMutationEvents();
      CLC_SR_AnnounceAssertiveMutationNotifications();
      CLC_SR_ReadContent(1);
      }
   if (CLC_SR_CurrentAtomicObject){     
      window.setTimeout("CLC_SR_AutoRead();", 0); 
      }
   return;    
   } 

//-----------------------------------------------


