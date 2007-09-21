//Functions for creating the popup menus used by Fire Vox


//--------------------------------------------------------------
//Functions for fixing the focus before and after the popup menu
function CLC_SR_SetBrowserWindow(){
   if (!CLC_SR_BrowserWindowHasBeenSet){
      CLC_SR_BrowserWindow = CLC_Window();
      CLC_SR_BrowserWindowHasBeenSet = true;
      }
   }

function CLC_SR_ResetBrowserWindow(){
   CLC_SR_BrowserWindow.focus();
   CLC_SR_BrowserWindowHasBeenSet = false;   
   }

//--------------------------------------------------------------
//All of these functions assume that CLC_SR_BrowserWindow has
//been initialized. Note that CLC_Window() must NOT be used
//in this case because by the time right before these 
//submenus are shown, the main menu of lists of elements 
//has already taken the focus! In other words, 
//the browser window has LOST FOCUS! Thus attempting 
//to use CLC_Window() will result in no elements being found
//because it will be looking within the main menu of lists
//rather than in the browser.





//elementType is usually the same as the tagName unless
//it involves different tags.
//
//HEADINGS == H1-H6 


//------------------------------------------
function CLC_SR_GatherPopUpMenuContents(elementType){
   CLC_SR_PopUpMenuContents = new Array();
   //Special cases that are not just a generic tag
   if (elementType == "HEADINGS"){
      CLC_SR_GatherPopUpMenu_Headings();
      return;
      }
   if (elementType == "LINKS"){
      CLC_SR_GatherPopUpMenu_Links();
      return;
      }
   if (elementType == "IMAGES"){
      CLC_SR_GatherPopUpMenu_Images();
      return;
      }
   if (elementType == "FORMELEMENTS"){
      CLC_SR_GatherPopUpMenu_FormElements();
      return;
      }
   if (elementType == "FRAMES"){
      CLC_SR_GatherPopUpMenu_Frames();
      return;
      }
   if (elementType == "ACCESSKEYS"){
      CLC_SR_GatherPopUpMenu_AccessKeys();
      return;
      }
   //Generic case where the elementType is the tagName
   CLC_SR_GatherPopUpMenu_ByTag(elementType);
   }


//------------------------------------------
function CLC_SR_CreatePopUpMenu(event){
   menu = event.target;
   for(var i = menu.childNodes.length-1; i >= 0; i--){
      menu.removeChild(menu.childNodes[i]);
      }
   for (var i = 0; i < CLC_SR_PopUpMenuContents.length; i++){
      menu.appendChild(CLC_SR_PopUpMenuContents[i]);
      }
   if (menu.childNodes.length == 0){
      var item = document.createElement("menuitem");
      item.value = 0;
      item.setAttribute("label", CLC_SR_MSG0013);
      menu.appendChild(item);
      }
   }


//------------------------------------------

function CLC_SR_GatherPopUpMenu_Headings(){
  var elemArray = new Array();
  var headingTypeArray = new Array(6);  
  headingTypeArray[0] = CLC_SR_BrowserWindow.document.body.getElementsByTagName("h1");
  headingTypeArray[1] = CLC_SR_BrowserWindow.document.body.getElementsByTagName("h2");
  headingTypeArray[2] = CLC_SR_BrowserWindow.document.body.getElementsByTagName("h3");
  headingTypeArray[3] = CLC_SR_BrowserWindow.document.body.getElementsByTagName("h4");
  headingTypeArray[4] = CLC_SR_BrowserWindow.document.body.getElementsByTagName("h5");
  headingTypeArray[5] = CLC_SR_BrowserWindow.document.body.getElementsByTagName("h6");

  for (i = 0; i < 6; i++){
    for(j =0; j < headingTypeArray[i].length; j++){
      elemArray.push(headingTypeArray[i][j]);
      }
    }

  elemArray.sort(CLC_SR_SortArray);

  for (var i = 0; i < elemArray.length; i++){
     var item = document.createElement("menuitem");
     item.value = elemArray[i];

     var hlevel;

     if (elemArray[i].tagName.toLowerCase() == "h1"){
        hlevel = "H1 ";
        }
     else if (elemArray[i].tagName.toLowerCase() == "h2"){
        hlevel = "H2 ";
        }
     else if (elemArray[i].tagName.toLowerCase() == "h3"){
        hlevel = "H3 ";
        }
     else if (elemArray[i].tagName.toLowerCase() == "h4"){
        hlevel = "H4 ";
        }
     else if (elemArray[i].tagName.toLowerCase() == "h5"){
        hlevel = "H5 ";
        }
     else {
        hlevel = "H6 ";
        }

     var name = CLC_GetTextContentOfAllChildren(elemArray[i]);
     name = hlevel + name;
     item.setAttribute("label", name);
     item.setAttribute("accesskey", name.substring(3,4)); 
     CLC_SR_PopUpMenuContents.push(item);
     }

  }


//------------------------------------------

function CLC_SR_GatherPopUpMenu_ByTag(tagtext){
   var elemArray = CLC_SR_BrowserWindow.document.getElementsByTagName(tagtext);   
   for (var i = 0; i < elemArray.length; i++){
      var item = document.createElement("menuitem");
      item.value = elemArray[i];
      var name = CLC_GetTextContentOfAllChildren(elemArray[i]);
      item.setAttribute("label", name);
      item.setAttribute("accesskey", name.substring(0,1)); 
      CLC_SR_PopUpMenuContents.push(item);
      }
   }


//------------------------------------------
//Sorting function for the popup menus
//
function CLC_SR_SortArray(a,b) {
   //Sort the contents alphabetically
   if (CLC_SR_Query_SortByAlpha()){
      if (CLC_GetTextContentOfAllChildren(a).toLowerCase() > CLC_GetTextContentOfAllChildren(b).toLowerCase()){
         return 1;
         }
      return -1;
      }

   //If not sorting alphabetically, sort by position
   else{
      if (a.offsetTop > b.offsetTop){
         return 1;
         }
      return -1;
      }
   }


//------------------------------------------

function CLC_SR_GatherPopUpMenu_Links(){
   var linksArray = CLC_SR_BrowserWindow.document.getElementsByTagName("a"); 
   var elemArray = new Array();
   for(i =0; i < linksArray.length; i++){
      elemArray.push(linksArray[i]);
      }    
   elemArray.sort(CLC_SR_SortArray); 
   for (var i = 0; i < elemArray.length; i++){
      if (elemArray[i].hasAttribute("href")){
         var item = document.createElement("menuitem");
         item.value = elemArray[i];
         var name = CLC_GetTextContentOfAllChildren(elemArray[i]);
         item.setAttribute("label", name);
         item.setAttribute("accesskey", name.substring(0,1)); 
         CLC_SR_PopUpMenuContents.push(item);
         }
      }
   }


//------------------------------------------

function CLC_SR_GatherPopUpMenu_Images(){
   var imagesArray = CLC_SR_BrowserWindow.document.getElementsByTagName("img"); 
   var elemArray = new Array();
   for(i =0; i < imagesArray.length; i++){
      elemArray.push(imagesArray[i]);
      }    
   elemArray.sort(CLC_SR_SortArray); 
   for (var i = 0; i < elemArray.length; i++){
      var name = CLC_GetTextContent(elemArray[i]);
      if (name){
         var item = document.createElement("menuitem");
         item.value = elemArray[i];         
         item.setAttribute("label", name);
         item.setAttribute("accesskey", name.substring(0,1)); 
         CLC_SR_PopUpMenuContents.push(item);
         }
      }
   }

//------------------------------------------
// Frames are fundamentally different in structure
// from the other elements and thus will NOT be sorted.
//
function CLC_SR_GatherPopUpMenu_Frames(){
   var framesArray = window._content.document.documentElement.getElementsByTagName("frame"); 
   var elemArray = new Array();
   for(i =0; i < framesArray.length; i++){
      elemArray.push(framesArray[i]);
      }    
   for (var i = 0; i < elemArray.length; i++){
      var item = document.createElement("menuitem");
      item.value = elemArray[i];
      var name = CLC_GenerateIDInfo(elemArray[i]);
      item.setAttribute("label", name);
      item.setAttribute("accesskey", name.substring(0,1)); 
      CLC_SR_PopUpMenuContents.push(item);
      }
   }



//------------------------------------------

function CLC_SR_GatherPopUpMenu_FormElements(){
  var elemArray = new Array();
  var FormElemArray = new Array(4);  
  FormElemArray[0] = CLC_SR_BrowserWindow.document.body.getElementsByTagName("button");
  FormElemArray[1] = CLC_SR_BrowserWindow.document.body.getElementsByTagName("input");
  FormElemArray[2] = CLC_SR_BrowserWindow.document.body.getElementsByTagName("select");
  FormElemArray[3] = CLC_SR_BrowserWindow.document.body.getElementsByTagName("textarea");

  for (i = 0; i < 4; i++){
    for(j =0; j < FormElemArray[i].length; j++){
      elemArray.push(FormElemArray[i][j]);
      }
    }

  elemArray.sort(CLC_SR_SortArray);

  for (var i = 0; i < elemArray.length; i++){
     var item = document.createElement("menuitem");
     item.value = elemArray[i];
     var name = CLC_GetTextContentOfAllChildren(elemArray[i]);
     if (CLC_SR_Query_VerboseFormElemList()){
        name = CLC_GenerateIDInfo(elemArray[i]) + " " + CLC_GetTextContentOfAllChildren(elemArray[i]) + " " + CLC_GetStatus(elemArray[i]);
        }
     if (!CLC_IsSpeakableString(name)){
        name = CLC_SR_MSG0022 + CLC_GenerateIDInfo(elemArray[i]);
        }
     item.setAttribute("label", name);
     item.setAttribute("accesskey", name.substring(0,1)); 
     CLC_SR_PopUpMenuContents.push(item);
     }

  }

//------------------------------------------

function CLC_SR_GatherPopUpMenu_AccessKeys(){
  var elemArray = new Array();   
  CLC_AllDOMObjWithAttribute(elemArray, CLC_SR_BrowserWindow.document.body, "accesskey");
  elemArray.sort(CLC_SR_SortArray);
  for (var i = 0; i < elemArray.length; i++){
     var item = document.createElement("menuitem");
     item.value = elemArray[i];
     var name = elemArray[i].accessKey + ". " + CLC_GetTextContentOfAllChildren(elemArray[i]);
     item.setAttribute("label", name);
     item.setAttribute("accesskey", name.substring(0,1)); 
     CLC_SR_PopUpMenuContents.push(item);
     }
  }

//------------------------------------------