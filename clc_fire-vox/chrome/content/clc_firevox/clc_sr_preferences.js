function CLC_SR_InitPref(){
   CLC_SR_Pref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
   }

//Checks if an assigned key is valid.
//A key is invalid if and only if it is a key that is reserved for the 
//main Firefox browser or fails the try statement with an error converting to lowercase.
//Since this function will be examining arbitrary user inputs, it is done
//in a try statement just to be safe.
//
function CLC_SR_Pref_ValidKey(target){
   try{
      var key = target.toLowerCase();
      if (key == 'g' || key == 'i' || key == 'r' || key == 'w'){
         return false;    
         }
      return true;
      }
   catch(e){
      return false;
      }
   }

//*****************************
//General Options
//*****************************

//---------------------------------
function CLC_SR_Query_ShouldHighlight(){
   if(CLC_SR_Pref.prefHasUserValue("firevox.ShouldHighlight")){
      return CLC_SR_Pref.getBoolPref("firevox.ShouldHighlight");
      }
   return true;
   }

//---------------------------------
function CLC_SR_SetPref_ShouldHighlight(bool_setting){
   CLC_SR_Pref.setBoolPref("firevox.ShouldHighlight", bool_setting);	
   }

//---------------------------------
function CLC_SR_Query_SpeakEvents(){
   if(CLC_SR_Pref.prefHasUserValue("firevox.SpeakEvents")){
      return CLC_SR_Pref.getBoolPref("firevox.SpeakEvents");
      }
   return true;
   }

//---------------------------------
function CLC_SR_SetPref_SpeakEvents(bool_setting){
   CLC_SR_Pref.setBoolPref("firevox.SpeakEvents", bool_setting);	
   }

//---------------------------------
function CLC_SR_Query_EchoKeys(){
   if(CLC_SR_Pref.prefHasUserValue("firevox.EchoKeys")){
      return CLC_SR_Pref.getBoolPref("firevox.EchoKeys");
      }
   return true;
   }

//---------------------------------
function CLC_SR_SetPref_EchoKeys(bool_setting){
   CLC_SR_Pref.setBoolPref("firevox.EchoKeys", bool_setting);	
   }

//---------------------------------
function CLC_SR_Query_SortByAlpha(){
   if(CLC_SR_Pref.prefHasUserValue("firevox.SortByAlpha")){
      return CLC_SR_Pref.getBoolPref("firevox.SortByAlpha");
      }
   return false;
   }

//---------------------------------
function CLC_SR_SetPref_SortByAlpha(bool_setting){
   CLC_SR_Pref.setBoolPref("firevox.SortByAlpha", bool_setting);	
   }

//---------------------------------

function CLC_SR_Query_VerboseFormElemList(){
   if(CLC_SR_Pref.prefHasUserValue("firevox.VerboseFormElemList")){
      return CLC_SR_Pref.getBoolPref("firevox.VerboseFormElemList");
      }
   return true;
   }

//---------------------------------
function CLC_SR_SetPref_VerboseFormElemList(bool_setting){
   CLC_SR_Pref.setBoolPref("firevox.VerboseFormElemList", bool_setting);	
   }

//---------------------------------

function CLC_SR_Query_AdjustOnFocus(){
   if(CLC_SR_Pref.prefHasUserValue("firevox.AdjustOnFocus")){
      return CLC_SR_Pref.getBoolPref("firevox.AdjustOnFocus");
      }
   return false;
   }

//---------------------------------
function CLC_SR_SetPref_AdjustOnFocus(bool_setting){
   CLC_SR_Pref.setBoolPref("firevox.AdjustOnFocus", bool_setting);	
   }

//---------------------------------

function CLC_SR_Query_UseCSSSpeechProperties(){
   if(CLC_SR_Pref.prefHasUserValue("firevox.UseCSSSpeechProperties")){
      return CLC_SR_Pref.getBoolPref("firevox.UseCSSSpeechProperties");
      }
   return true;
   }

//---------------------------------
function CLC_SR_SetPref_UseCSSSpeechProperties(bool_setting){
   CLC_SR_Pref.setBoolPref("firevox.UseCSSSpeechProperties", bool_setting);	
   }

//---------------------------------

function CLC_SR_Query_ReadBySentences(){
   if(CLC_SR_Pref.prefHasUserValue("firevox.ReadBySentences")){
      return CLC_SR_Pref.getBoolPref("firevox.ReadBySentences");
      }
   return false;
   }

//---------------------------------
function CLC_SR_SetPref_ReadBySentences(bool_setting){
   CLC_SR_Pref.setBoolPref("firevox.ReadBySentences", bool_setting);	
   }

//---------------------------------

function CLC_SR_Query_SelectSentence(){
   if(CLC_SR_Pref.prefHasUserValue("firevox.SelectSentence")){
      return CLC_SR_Pref.getBoolPref("firevox.SelectSentence");
      }
   return true;
   }

//---------------------------------
function CLC_SR_SetPref_SelectSentence(bool_setting){
   CLC_SR_Pref.setBoolPref("firevox.SelectSentence", bool_setting);	
   }

//---------------------------------

function CLC_SR_Query_AutodetectLang(){
   if(CLC_SR_Pref.prefHasUserValue("firevox.AutodetectLang")){
      return CLC_SR_Pref.getBoolPref("firevox.AutodetectLang");
      }
   return true;
   }

//---------------------------------
function CLC_SR_SetPref_AutodetectLang(bool_setting){
   CLC_SR_Pref.setBoolPref("firevox.AutodetectLang", bool_setting);	
   }

//---------------------------------
//Settings for AnnounceDOMMutationEvents
// 0 == off
// 1 == default
// 2 == strict
//
function CLC_SR_Query_AnnounceDOMMutationEventsMode(){
   if(CLC_SR_Pref.prefHasUserValue("firevox.AnnounceDOMMutationEventsMode")){
      return CLC_SR_Pref.getIntPref("firevox.AnnounceDOMMutationEventsMode");
      }
   return 1;
   }

//---------------------------------
function CLC_SR_SetPref_AnnounceDOMMutationEventsMode(int_setting){
   CLC_SR_Pref.setIntPref("firevox.AnnounceDOMMutationEventsMode", int_setting);	
   }


//---------------------------------
function CLC_SR_Query_UseStickyMod(){
   if(CLC_SR_Pref.prefHasUserValue("firevox.UseStickyMod")){
      return CLC_SR_Pref.getIntPref("firevox.UseStickyMod");
      }
   return 1;
   }
//---------------------------------
function CLC_SR_SetPref_UseStickyMod(int_setting){
   CLC_SR_Pref.setIntPref("firevox.UseStickyMod", int_setting);	
   }

//---------------------------------


//*****************************
//Keys
//*****************************

//---------------------------------
function CLC_SR_QueryKey_ReadBackward(){
   if(CLC_SR_Pref.prefHasUserValue("firevox.ReadBackwardKey")){
      return CLC_SR_Pref.getCharPref("firevox.ReadBackwardKey");
      }
   return "d";
   }

//---------------------------------
function CLC_SR_SetKey_ReadBackward(char_setting){
   if (!CLC_SR_Pref_ValidKey(char_setting)){
      return;
      }
   CLC_SR_Pref.setCharPref("firevox.ReadBackwardKey", char_setting);	
   }


//---------------------------------
function CLC_SR_QueryKey_ReadForward(){
   if(CLC_SR_Pref.prefHasUserValue("firevox.ReadForwardKey")){
      return CLC_SR_Pref.getCharPref("firevox.ReadForwardKey");
      }
   return "f";
   }

//---------------------------------
function CLC_SR_SetKey_ReadForward(char_setting){
   if (!CLC_SR_Pref_ValidKey(char_setting)){
      return;
      }
   CLC_SR_Pref.setCharPref("firevox.ReadForwardKey", char_setting);	
   }

//---------------------------------
function CLC_SR_QueryKey_Repeat(){
   if(CLC_SR_Pref.prefHasUserValue("firevox.RepeatKey")){
      return CLC_SR_Pref.getCharPref("firevox.RepeatKey");
      }
   return "e";
   }

//---------------------------------
function CLC_SR_SetKey_Repeat(char_setting){
   if (!CLC_SR_Pref_ValidKey(char_setting)){
      return;
      }
   CLC_SR_Pref.setCharPref("firevox.RepeatKey", char_setting);	
   }

//---------------------------------
function CLC_SR_QueryKey_StopSpeaking(){
   if(CLC_SR_Pref.prefHasUserValue("firevox.StopSpeakingKey")){
      return CLC_SR_Pref.getCharPref("firevox.StopSpeakingKey");
      }
   return "c";
   }

//---------------------------------
function CLC_SR_SetKey_StopSpeaking(char_setting){
   if (!CLC_SR_Pref_ValidKey(char_setting)){
      return;
      }
   CLC_SR_Pref.setCharPref("firevox.StopSpeakingKey", char_setting);	
   }


//---------------------------------
function CLC_SR_QueryKey_SaySelected(){
   if(CLC_SR_Pref.prefHasUserValue("firevox.SaySelectedKey")){
      return CLC_SR_Pref.getCharPref("firevox.SaySelectedKey");
      }
   return "o";
   }

//---------------------------------
function CLC_SR_SetKey_SaySelected(char_setting){
   if (!CLC_SR_Pref_ValidKey(char_setting)){
      return;
      }
   CLC_SR_Pref.setCharPref("firevox.SaySelectedKey", char_setting);	
   }


//---------------------------------
function CLC_SR_QueryKey_GetMoreInfo(){
   if(CLC_SR_Pref.prefHasUserValue("firevox.GetMoreInfoKey")){
      return CLC_SR_Pref.getCharPref("firevox.GetMoreInfoKey");
      }
   return "q";
   }

//---------------------------------
function CLC_SR_SetKey_GetMoreInfo(char_setting){
   if (!CLC_SR_Pref_ValidKey(char_setting)){
      return;
      }
   CLC_SR_Pref.setCharPref("firevox.GetMoreInfoKey", char_setting);	
   }


//---------------------------------
function CLC_SR_QueryKey_SpellOut(){
   if(CLC_SR_Pref.prefHasUserValue("firevox.SpellOutKey")){
      return CLC_SR_Pref.getCharPref("firevox.SpellOutKey");
      }
   return "s";
   }

//---------------------------------
function CLC_SR_SetKey_SpellOut(char_setting){
   if (!CLC_SR_Pref_ValidKey(char_setting)){
      return;
      }
   CLC_SR_Pref.setCharPref("firevox.SpellOutKey", char_setting);	
   }


//---------------------------------
function CLC_SR_QueryKey_LaunchAutoReader(){
   if(CLC_SR_Pref.prefHasUserValue("firevox.LaunchAutoReaderKey")){
      return CLC_SR_Pref.getCharPref("firevox.LaunchAutoReaderKey");
      }
   return "a";
   }

//---------------------------------
function CLC_SR_SetKey_LaunchAutoReader(char_setting){
   if (!CLC_SR_Pref_ValidKey(char_setting)){
      return;
      }
   CLC_SR_Pref.setCharPref("firevox.LaunchAutoReaderKey", char_setting);	
   }


//---------------------------------
function CLC_SR_QueryKey_ReadCurrentPosition(){
   if(CLC_SR_Pref.prefHasUserValue("firevox.ReadCurrentPositionKey")){
      return CLC_SR_Pref.getCharPref("firevox.ReadCurrentPositionKey");
      }
   return "p";
   }

//---------------------------------
function CLC_SR_SetKey_ReadCurrentPosition(char_setting){
   if (!CLC_SR_Pref_ValidKey(char_setting)){
      return;
      }
   CLC_SR_Pref.setCharPref("firevox.ReadCurrentPositionKey", char_setting);	
   }

//---------------------------------
function CLC_SR_QueryKey_HeadingsList(){
   if(CLC_SR_Pref.prefHasUserValue("firevox.HeadingsListKey")){
      return CLC_SR_Pref.getCharPref("firevox.HeadingsListKey");
      }
   return "h";
   }

//---------------------------------
function CLC_SR_SetKey_HeadingsList(char_setting){
   if (!CLC_SR_Pref_ValidKey(char_setting)){
      return;
      }
   CLC_SR_Pref.setCharPref("firevox.HeadingsListKey", char_setting);	
   }

//---------------------------------
function CLC_SR_QueryKey_ElementsList(){
   if(CLC_SR_Pref.prefHasUserValue("firevox.ElementsListKey")){
      return CLC_SR_Pref.getCharPref("firevox.ElementsListKey");
      }
   return "l";
   }

//---------------------------------
function CLC_SR_SetKey_ElementsList(char_setting){
   if (!CLC_SR_Pref_ValidKey(char_setting)){
      return;
      }
   CLC_SR_Pref.setCharPref("firevox.ElementsListKey", char_setting);	
   }

//---------------------------------
function CLC_SR_QueryKey_FireVoxOptionsMenu(){
   if(CLC_SR_Pref.prefHasUserValue("firevox.FireVoxOptionsMenuKey")){
      return CLC_SR_Pref.getCharPref("firevox.FireVoxOptionsMenuKey");
      }
   return "m";
   }

//---------------------------------
function CLC_SR_SetKey_FireVoxOptionsMenu(char_setting){
   if (!CLC_SR_Pref_ValidKey(char_setting)){
      return;
      }
   CLC_SR_Pref.setCharPref("firevox.FireVoxOptionsMenuKey", char_setting);	
   }

//---------------------------------
function CLC_SR_QueryKey_SayParentTextContent(){
   if(CLC_SR_Pref.prefHasUserValue("firevox.SayParentTextContent")){
      return CLC_SR_Pref.getCharPref("firevox.SayParentTextContent");
      }
   return "u";
   }

//---------------------------------
function CLC_SR_SetKey_SayParentTextContent(char_setting){
   if (!CLC_SR_Pref_ValidKey(char_setting)){
      return;
      }
   CLC_SR_Pref.setCharPref("firevox.SayParentTextContent", char_setting);	
   }
//---------------------------------
function CLC_SR_QueryKey_ToggleDOMMutationEventAnnouncements(){
   if(CLC_SR_Pref.prefHasUserValue("firevox.ToggleDOMMutationEventAnnouncements")){
      return CLC_SR_Pref.getCharPref("firevox.ToggleDOMMutationEventAnnouncements");
      }
   return "y";
   }

//---------------------------------
function CLC_SR_SetKey_ToggleDOMMutationEventAnnouncements(char_setting){
   if (!CLC_SR_Pref_ValidKey(char_setting)){
      return;
      }
   CLC_SR_Pref.setCharPref("firevox.ToggleDOMMutationEventAnnouncements", char_setting);	
   }

//---------------------------------
