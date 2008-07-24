function CLC_SR_PrefUI_Load(){
   CLC_SR_ShouldSavePrefs = true;
   CLC_SR_InitPref();
   CLC_SR_StartTTSEngine();
   CLC_SR_SpeakPrefUI_Init();
   CLC_SR_PrefUI_UpdateBlanks();
   }

function CLC_SR_PrefUI_Save(){
   //Don't save if the menu was closed by a cancel
   if (!CLC_SR_ShouldSavePrefs){
      return;
      }

   //Save options
   CLC_SR_SetPref_ShouldHighlight(document.getElementById("firevoxpref-highlight-checkbox").checked);
   CLC_SR_SetPref_SpeakEvents(document.getElementById("firevoxpref-speakEvents-checkbox").checked);
   CLC_SR_SetPref_EchoKeys(document.getElementById("firevoxpref-echoKeys-checkbox").checked);
   CLC_SR_SetPref_SortByAlpha(document.getElementById("firevoxpref-sortAlpha-checkbox").checked);
   CLC_SR_SetPref_VerboseFormElemList(document.getElementById("firevoxpref-verboseFormElemList-checkbox").checked);
   CLC_SR_SetPref_AdjustOnFocus(document.getElementById("firevoxpref-adjustOnFocus-checkbox").checked);
   CLC_SR_SetPref_UseCSSSpeechProperties(document.getElementById("firevoxpref-useCSSSpeechProperties-checkbox").checked);
   CLC_SR_SetPref_ReadBySentences(document.getElementById("firevoxpref-readBySentences-checkbox").checked);
   CLC_SR_SetPref_SelectSentence(document.getElementById("firevoxpref-selectSentence-checkbox").checked);
   CLC_SR_SetPref_AutodetectLang(document.getElementById("firevoxpref-autodetectLang-checkbox").checked);
   CLC_SR_SetPref_UseStickyMod(document.getElementById("firevoxpref-useStickyMod-checkbox").checked);
   CLC_SR_SetPref_UseSiteSpecificEnhancements(document.getElementById("firevoxpref-useSiteSpecificEnhancements-checkbox").checked);
   CLC_SR_SetPref_UseBriefMode(document.getElementById("firevoxpref-useBriefMode-checkbox").checked);
   CLC_SR_SetPref_CNRUrl(document.getElementById("firevoxpref-CNRUrl-TextBox").value);

   //Save keys
   CLC_SR_SetKey_ReadBackward(document.getElementById("firevoxpref-keys-ReadBackward").value);
   CLC_SR_SetKey_ReadForward(document.getElementById("firevoxpref-keys-ReadForward").value);
   CLC_SR_SetKey_Repeat(document.getElementById("firevoxpref-keys-Repeat").value);
   CLC_SR_SetKey_StopSpeaking(document.getElementById("firevoxpref-keys-StopSpeaking").value);
   CLC_SR_SetKey_SaySelected(document.getElementById("firevoxpref-keys-SaySelected").value);
   CLC_SR_SetKey_GetMoreInfo(document.getElementById("firevoxpref-keys-GetMoreInfo").value);
   CLC_SR_SetKey_SpellOut(document.getElementById("firevoxpref-keys-SpellOut").value);
   CLC_SR_SetKey_LaunchAutoReader(document.getElementById("firevoxpref-keys-LaunchAutoReader").value);
   CLC_SR_SetKey_ReadCurrentPosition(document.getElementById("firevoxpref-keys-ReadCurrentPosition").value);
   CLC_SR_SetKey_HeadingsList(document.getElementById("firevoxpref-keys-HeadingsList").value);
   CLC_SR_SetKey_ElementsList(document.getElementById("firevoxpref-keys-ElementsList").value);
   CLC_SR_SetKey_FireVoxOptionsMenu(document.getElementById("firevoxpref-keys-FireVoxOptionsMenu").value);
   CLC_SR_SetKey_SayParentTextContent(document.getElementById("firevoxpref-keys-SayParentTextContent").value);
   CLC_SR_SetKey_ToggleDOMMutationEventAnnouncements(document.getElementById("firevoxpref-keys-ToggleDOMMutationEventAnnouncements").value);
   }


function CLC_SR_PrefUI_UpdateBlanks(){
   //Load options
   document.getElementById("firevoxpref-highlight-checkbox").checked = CLC_SR_Query_ShouldHighlight();
   document.getElementById("firevoxpref-speakEvents-checkbox").checked = CLC_SR_Query_SpeakEvents();
   document.getElementById("firevoxpref-echoKeys-checkbox").checked = CLC_SR_Query_EchoKeys();
   document.getElementById("firevoxpref-sortAlpha-checkbox").checked = CLC_SR_Query_SortByAlpha();
   document.getElementById("firevoxpref-verboseFormElemList-checkbox").checked = CLC_SR_Query_VerboseFormElemList();
   document.getElementById("firevoxpref-adjustOnFocus-checkbox").checked = CLC_SR_Query_AdjustOnFocus();
   document.getElementById("firevoxpref-useCSSSpeechProperties-checkbox").checked = CLC_SR_Query_UseCSSSpeechProperties();
   document.getElementById("firevoxpref-readBySentences-checkbox").checked = CLC_SR_Query_ReadBySentences();
   document.getElementById("firevoxpref-selectSentence-checkbox").checked = CLC_SR_Query_SelectSentence();
   document.getElementById("firevoxpref-autodetectLang-checkbox").checked = CLC_SR_Query_AutodetectLang();
   document.getElementById("firevoxpref-useStickyMod-checkbox").checked = CLC_SR_Query_UseStickyMod();
   document.getElementById("firevoxpref-useSiteSpecificEnhancements-checkbox").checked = CLC_SR_Query_UseSiteSpecificEnhancements();
   document.getElementById("firevoxpref-useBriefMode-checkbox").checked = CLC_SR_Query_UseBriefMode();
   document.getElementById("firevoxpref-CNRUrl-TextBox").value = CLC_SR_Query_CNRUrl();
   //Load keys
   document.getElementById("firevoxpref-keys-ReadBackward").value = CLC_SR_QueryKey_ReadBackward();
   document.getElementById("firevoxpref-keys-ReadForward").value = CLC_SR_QueryKey_ReadForward();
   document.getElementById("firevoxpref-keys-Repeat").value = CLC_SR_QueryKey_Repeat();
   document.getElementById("firevoxpref-keys-StopSpeaking").value = CLC_SR_QueryKey_StopSpeaking();
   document.getElementById("firevoxpref-keys-SaySelected").value = CLC_SR_QueryKey_SaySelected();
   document.getElementById("firevoxpref-keys-GetMoreInfo").value = CLC_SR_QueryKey_GetMoreInfo();
   document.getElementById("firevoxpref-keys-SpellOut").value = CLC_SR_QueryKey_SpellOut();
   document.getElementById("firevoxpref-keys-LaunchAutoReader").value = CLC_SR_QueryKey_LaunchAutoReader();
   document.getElementById("firevoxpref-keys-ReadCurrentPosition").value = CLC_SR_QueryKey_ReadCurrentPosition();
   document.getElementById("firevoxpref-keys-HeadingsList").value = CLC_SR_QueryKey_HeadingsList();
   document.getElementById("firevoxpref-keys-ElementsList").value = CLC_SR_QueryKey_ElementsList();
   document.getElementById("firevoxpref-keys-FireVoxOptionsMenu").value = CLC_SR_QueryKey_FireVoxOptionsMenu();
   document.getElementById("firevoxpref-keys-SayParentTextContent").value = CLC_SR_QueryKey_SayParentTextContent();
   document.getElementById("firevoxpref-keys-ToggleDOMMutationEventAnnouncements").value = CLC_SR_QueryKey_ToggleDOMMutationEventAnnouncements();
   }