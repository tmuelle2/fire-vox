//All these functions assume that CLC_SR_InitPref()
//has been called and CLC_SR_Pref is ready for use.

//Failure is defined as catastrophic failure that crashes the browser.
//Non-crashing failure (such as a failure to speak) is 
//NOT considered a "failure" in this context!


//*****************************
//TTS Engine Initializer - Main
//*****************************
function CLC_SR_StartTTSEngine(){
   var prev_tts = CLC_SR_Query_LastWorkingTTS();
   if (prev_tts == 1){
      CLC_SR_StartSAPITTS();
      return;
      }
   if (prev_tts == 2){
      CLC_SR_StartFreeTTS();
      return;
      }
   if (prev_tts == 3){
      CLC_SR_StartOrca();
      return;
      }
   //If there was nothing set, try to pick one.
   if (!CLC_SR_Query_SAPIFailed()){
      CLC_SR_StartSAPITTS();
      return;
      }
   if (!CLC_SR_Query_FreeTTSFailed()){
      CLC_SR_StartFreeTTS();
      return;
      }   
   if (!CLC_SR_Query_OrcaFailed()){
      CLC_SR_StartOrca();
      return;
      }      
   }


//*****************************
//TTS Engine Initializer - Specific TTS Initializers
//*****************************

function CLC_SR_StartSAPITTS(){
   CLC_SR_SetPref_LastWorkingTTS(0);
   CLC_SR_SetPref_SAPIFailed(true);
   if(CLC_Init(1)){
      CLC_SR_SetPref_SAPIFailed(false);
      CLC_SR_SetPref_LastWorkingTTS(1);
      }
   CLC_SR_MarkTTSInMenu();
   }

function CLC_SR_StartFreeTTS(){
   CLC_SR_SetPref_LastWorkingTTS(0);
   CLC_SR_SetPref_FreeTTSFailed(true);
   if(CLC_Init(2)){
      CLC_SR_SetPref_FreeTTSFailed(false);
      CLC_SR_SetPref_LastWorkingTTS(2);
      }
   CLC_SR_MarkTTSInMenu();
   }


function CLC_SR_StartOrca(){
   CLC_SR_SetPref_LastWorkingTTS(0);
   CLC_SR_SetPref_OrcaFailed(true);
   if(CLC_Init(3)){
      CLC_SR_SetPref_OrcaFailed(false);
      CLC_SR_SetPref_LastWorkingTTS(3);
      }
   CLC_SR_MarkTTSInMenu();
   }

//*****************************
//TTS Engine History - Records last working TTS and which ones have failed.
//*****************************

//---------------------------------
function CLC_SR_Query_LastWorkingTTS(){
   if(CLC_SR_Pref.prefHasUserValue("firevox.LastWorkingTTS")){
      return CLC_SR_Pref.getIntPref("firevox.LastWorkingTTS");
      }
   return 0;
   }

//---------------------------------
function CLC_SR_SetPref_LastWorkingTTS(int_setting){
   CLC_SR_Pref.setIntPref("firevox.LastWorkingTTS", int_setting);	
   }

//---------------------------------
function CLC_SR_Query_SAPIFailed(){
   if(CLC_SR_Pref.prefHasUserValue("firevox.SAPIFailed")){
      return CLC_SR_Pref.getBoolPref("firevox.SAPIFailed");
      }
   return false;
   }

//---------------------------------
function CLC_SR_SetPref_SAPIFailed(bool_setting){
   CLC_SR_Pref.setBoolPref("firevox.SAPIFailed", bool_setting);	
   }

//---------------------------------
function CLC_SR_Query_FreeTTSFailed(){
   if(CLC_SR_Pref.prefHasUserValue("firevox.FreeTTSFailed")){
      return CLC_SR_Pref.getBoolPref("firevox.FreeTTSFailed");
      }
   return false;
   }

//---------------------------------
function CLC_SR_SetPref_FreeTTSFailed(bool_setting){
   CLC_SR_Pref.setBoolPref("firevox.FreeTTSFailed", bool_setting);	
   }

//---------------------------------
function CLC_SR_Query_OrcaFailed(){
   if(CLC_SR_Pref.prefHasUserValue("firevox.OrcaFailed")){
      return CLC_SR_Pref.getBoolPref("firevox.OrcaFailed");
      }
   return false;
   }

//---------------------------------
function CLC_SR_SetPref_OrcaFailed(bool_setting){
   CLC_SR_Pref.setBoolPref("firevox.OrcaFailed", bool_setting);	
   }

//---------------------------------


function CLC_SR_MarkTTSInMenu(){
   try{
      if (window.location != "chrome://browser/content/browser.xul"){
         return;
         }
      var prev_tts = CLC_SR_Query_LastWorkingTTS();
      document.getElementById("menu_FireVoxTTS_popup_SAPI5").attributes[0].nodeValue = false;
      document.getElementById("menu_FireVoxTTS_popup_FreeTTS").attributes[0].nodeValue = false;
      document.getElementById("menu_FireVoxTTS_popup_Orca").attributes[0].nodeValue = false;
   
      if (prev_tts == 1){
         document.getElementById("menu_FireVoxTTS_popup_SAPI5").attributes[0].nodeValue = true;
         return;
         }
      if (prev_tts == 2){
         document.getElementById("menu_FireVoxTTS_popup_FreeTTS").attributes[0].nodeValue = true;
         return;
         }
      if (prev_tts == 3){
         document.getElementById("menu_FireVoxTTS_popup_Orca").attributes[0].nodeValue = true;
         return;
         }	
      }
      catch(e){}
   }
