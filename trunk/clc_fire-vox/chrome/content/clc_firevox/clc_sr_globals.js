
//Globals
var CLC_SR_CurrentURI = "";      //Remember the current URI so that the user will not lose their place because of reinitialization if the page auto refreshes.

var CLC_SR_DebugStringDump = "";   //CLC_SR_DumpToDebug will dump messages here.
var CLC_SR_CurrentAtomicObject = 0;
var CLC_SR_PrevAtomicObject = 0;
var CLC_SR_PrevAtomicObjectExisted = false; //Knowing whether or not there was a prev/next
var CLC_SR_NextAtomicObjectExisted = false; //object is vital to recovering from losing the
                                            //current object to a mutation event.

var CLC_SR_CurrentLevel = 0;       //Keeps track of what level you are looking at
                                   //when you request info on the current object

var CLC_SR_LastHighlightable = 0;  //Last object that was determined to be highlightable
var CLC_SR_LastScrollable = 0;      //Last object that was determined to be scrollable


var CLC_SR_SpeakEventBuffer = "";   //Must use buffering! Else the string is deallocated
                                    //before CLC_Say can get it!  
var CLC_SR_SpeakKeyEventBuffer = ""; //Keys need their own buffer to avoid clobbering something else.
var CLC_SR_SpellTheEvent = true;    //Use this to handle selections where you wish to Shout 
                                    //it as a word rather than spell it out by setting this
                                    //to false. This is NOT a user option!

var CLC_SR_Stop = true;             //Used to stop the auto reader

var CLC_SR_Started = false;         //Used to determine if Fire Vox has been initialized

var CLC_SR_ActOnFocusedElements = true; //Used to determine if Fire Vox moved the focus (in which case
                                        //it should NOT act on the focus because it will read the content
                                        //anyway) or if the user moved the focus (in which case the user should
                                        //be informed of what the current object is). This is NOT a user option!

var CLC_SR_PopUpMenuContents = new Array(); //Used for storing the contents of the popup context 
                                            //menus used for heading lists and such.


var CLC_SR_BrowserWindow;              //Workaround to deal with the commandDispatcher not 
                                       //having the right focus at times.
var CLC_SR_BrowserWindowHasBeenSet = false;   //Boolean to determine if it has been set already

var CLC_SR_PopUpTarg;                  //Workaround to deal with the popup menu going away too fast.

var CLC_SR_Pref;              //Used for accessing preferences. Be sure to initialize first!

var CLC_SR_ForcedScreenAdjust = false;  //True if the read current position must be forced to adjust the window

var CLC_SR_SPCSSRules;            //Array of CSS Speech Property rule objects for the current page


var CLC_SR_UseCursorMatching = true;  //Used for determining if the reader should attempt to match 
                                      //the current cursor position. Should be true except when there is
                                      //no other way to get out of a looping situation.


var CLC_SR_ShouldSavePrefs = true;    //Used for determining if the Cancel button was pressed to close
                                      //the Fire Vox Options menu. Should be true unless Cancel was pressed.

var CLC_SR_HttpRequestObjectArray;       //HTTP Request Objects need an array since there could be multiple external stylesheets
var CLC_SR_ExternalStyleSheetsArray;     //External Stylesheets need an array since there could be multiple external stylesheets
var CLC_SR_ExternalStyleSheetsProcessed;  //Don't try to reprocess stylesheets for a page that is already being processed
var CLC_SR_ExternalCSSProcessingTimeOut = 1000; //Set timeout to 1 second for processing external css stylesheets; better to quit than to bog the system.

var CLC_SR_SentencesArray;                //Array of holding the set of sentences generated from CLC_SR_CurrentAtomicObject.
var CLC_SR_SentencesArrayIndex = -1;      //Current position in the CLC_SR_SentencesArray. -1 indicates that this is a new array that has not been used yet.


var CLC_SR_DefaultLanguage = "";  //Specifies the default language that Fire Vox should use


var CLC_SR_MutationEventQueuePollInterval = 100;         //How frequently the event queue should be checked in milliseconds
var CLC_SR_AssertiveMutationEventWaiting = false;        //True if there is an assertive event that should be spoken ASAP
var CLC_SR_UserActivityLevel = 0;                        //Gets reset to CLC_SR_MaxUserActivityLevel everytime 
                                                         //there is a user action; decays with time if Fire Vox 
                                                         //is not speaking.
var CLC_SR_MaxUserActivityLevel = 50;                   //Max value for CLC_SR_UserActivityLevel.
                                                         //To calculate the number of millisecnds that 
                                                         //CLC_SR_MaxUserActivityLevel is equal to, take the
                                                         //value of CLC_SR_MaxUserActivityLevel and multiply it
                                                         //with CLC_SR_MutationEventQueuePollInterval.
var CLC_SR_BusyManagingMutations = false;                //Flag to so that the event queue is only managed by one thread
var CLC_SR_MutationEventAnnouncementIsToggling = false;  //Flag to prevent toggling when a toggle is already in progress

var CLC_SR_StickyModOn = false;

var CLC_SR_FailedActiveDescendantId = "";  //For CLC_SR_RetryBodyActiveDescendant_Announcer in clc_sr_eventAnnouncer.js


//Messages for easy translation
//
var CLC_SR_MSG0001 = "End of Document.";                             //Reading announcement
var CLC_SR_MSG0002 = "No more detailed information is available.";   //Info query announcement
var CLC_SR_MSG0003 = "Menu and Event Announcements are disabled.";   //Toggle announcement
var CLC_SR_MSG0004 = "Menu and Event Announcements are enabled.";    //Toggle announcement
var CLC_SR_MSG0005 = " Is unavailable.";                             //Menu status
var CLC_SR_MSG0006 = " Has sub menu.";                               //Menu status
var CLC_SR_MSG0007 = " Highlight off.";                              //Toggle announcement
var CLC_SR_MSG0008 = " Highlight on.";                               //Toggle announcement
var CLC_SR_MSG0009 = " Checked.";                                    //Menu status
var CLC_SR_MSG0010 = "Location Bar ";                                //Location Bar
var CLC_SR_MSG0011 = "An alert box has appeared. ";                  //Alert box (for JavaScript popups)
var CLC_SR_MSG0012 = " button focused.";                             //Alert box buttons
var CLC_SR_MSG0013 = "There are no such elements on this page.";     //In case of a blank popup menu
var CLC_SR_MSG0014 = "List of Headings";                             //Headings list has been activated
var CLC_SR_MSG0015 = " is assigned to. ";                             //Prefs UI key announcement
var CLC_SR_MSG0016 = " input blank ";                                //Prefs UI key announcement
var CLC_SR_MSG0017 = " Not checked. ";                               //Prefs UI checkbox announcement
var CLC_SR_MSG0018 = " Checkbox ";                                   //Prefs UI checkbox announcement
var CLC_SR_MSG0019 = "List of Elements";                             //Elements list has been activated
var CLC_SR_MSG0020 = "Focused frame is ";                            //SwitchFocusFrame announcement
var CLC_SR_MSG0021 = "Warning! This key may not be used. Will revert to previous key."; //Prefs UI Validity Check
var CLC_SR_MSG0022 = "Unidentified ";                                //Used for unlabelled, untitled elements
var CLC_SR_MSG0023 = "There is no parent object for the current object. ";   //CLC_SR_SayParentTextContent announcement
var CLC_SR_MSG0024 = "Firefox Options Dialog Window ";   //Announcement for the Firefox Options Dialog
var CLC_SR_MSG0025 = "Options List ";   //For the Firefox Options Dialog
var CLC_SR_MSG0026 = "Change. ";   //DOM Mutation Event - text changed
var CLC_SR_MSG0027 = "Removal. ";   //DOM Mutation Event - DOM element removed
var CLC_SR_MSG0028 = "New. ";   //DOM Mutation Event - DOM element added
var CLC_SR_MSG0029 = "Tagged Live Region Announcements";    //For toggling the DOM Mutation event announcements
var CLC_SR_MSG0030 = "No Live Region Announcements";        //For toggling the DOM Mutation event announcements
var CLC_SR_MSG0031 = "Default Live Region Announcements";   //For toggling the DOM Mutation event announcements
var CLC_SR_MSG0032 = "Info.";   //Chatzilla msg-type
var CLC_SR_MSG0033 = " text box focused. ";   //Alert box input blanks

var CLC_SR_MSG0034 = "No more chat messages.";   //ARIA Chat
var CLC_SR_MSG0035 = "System. ";   //Chatzilla system message

var CLC_SR_MSG0036 = " Label. ";   //WAI-ARIA labelledby
var CLC_SR_MSG0037 = " Description. ";   //WAI-ARIA describedby


var CLC_SR_MSG0038 = "Sticky modifier keys off. ";   //Sticky mod keys
var CLC_SR_MSG0039 = "Sticky modifier keys on. ";  





