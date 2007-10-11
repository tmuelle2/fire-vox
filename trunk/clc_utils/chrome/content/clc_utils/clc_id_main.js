//CLC-4-TTS Firefox Extension
//Core Library Components for Text-To-Speech for Firefox
//Additional Utility Functions: Element Identification System - Main
//by Charles L. Chen

 
//This program is free software; you can redistribute it
//and/or modify it under the terms of the GNU General Public
//License as published by the Free Software Foundation;
//either version 2.1 of the License, or (at your option) any
//later version.  This program is distributed in the hope
//that it will be useful, but WITHOUT ANY WARRANTY; without
//even the implied warranty of MERCHANTABILITY or FITNESS FOR
//A PARTICULAR PURPOSE. See the GNU General Public License for
//more details.  You should have received a copy of the GNU
//General Public License along with this program; if not, look
//on the web at on the web at http://www.gnu.org/copyleft/gpl.html
//or write to the Free Software Foundation, Inc., 59 Temple Place,
//Suite 330, Boston, MA 02111-1307, USA.
 

//Last Modified Date 10/06/2007

//The main functions in this file refer to functions which
//are defined in the subfunctions files for the ID system.

//All of the subfunctions generate text strings by first
//gathering information that is needed regardless of language
//and then using that combined with the element type to create
//a text string that is appropriate for the language specified.
//The more complicated parts of the information gathering are
//done using functions in "clc_id_special.js"

//Translations can be done by adding additional languages and if
//statements for each subfunction. This method was chosen rather than
//using string variables because varying grammar rules make 
//combining string variables with other information impossible to
//do in a standardized fashion (ie, in language A, perhaps the correct
//way to say it is obj1, prep, num, obj2; however the grammar of 
//language B may demand obj1, prep, obj2, num or some other variation).

//All subfunctions are named as CLC_Elementtagname_Info#
//where # refers to the type of information that will be
//returned. 1 indicates basic identifying information (what is it?)
//that should be used when reading through a page.
//2 (and greater) indicates more information (where does it link to? 
//where is it in a list? etc.) that should be presented when
//requested by the user. It is possible to have an Info2 without 
//an Info1 and vice versa.

//Defines the language for info messages about HTML elements
//0 = No language (No information will be generated)
//1 = English (Default)
var CLC_InfoLang = 1;


//------------------------------------------
//Returns a string that identifies the target
//The string is generated by using the 
//appropriate element identification function
//found in "clc_id_subfunc_1.js"

function CLC_GenerateIDInfo(target){
  if (!target){
     return "";
     }
  if (!target.tagName){
     return "";
     }
  //WAI-ARIA roles take precedence over regular tags
  var roleIDInfo = CLC_GenerateInfoFromRole(target);
  if (roleIDInfo){
     return roleIDInfo;
     }
  //No WAI-ARIA role, use tag names like normal
  if (target.tagName.toLowerCase() == "a"){
     return CLC_Link_Info1(target);
     }
  else if (target.tagName.toLowerCase() == "abbr"){
     return CLC_Abbr_Info1(target);
     }
  else if (target.tagName.toLowerCase() == "acronym"){
     return CLC_Acronym_Info1(target);
     }
  else if (target.tagName.toLowerCase() == "blockquote"){
     return CLC_Blockquote_Info1(target);
     }
  else if (target.tagName.toLowerCase() == "body"){
     return CLC_Body_Info1(target);
     }
  else if (target.tagName.toLowerCase() == "button"){
     return CLC_Button_Info1(target);
     }
  else if (target.tagName.toLowerCase() == "caption"){
     return CLC_Caption_Info1(target);
     }
  else if (target.tagName.toLowerCase() == "div"){
     return CLC_Div_Info1(target);
     }
  else if (target.tagName.toLowerCase() == "fieldset"){
     return CLC_Fieldset_Info1(target);
     }
  else if (target.tagName.toLowerCase() == "frame"){
     return CLC_Frame_Info1(target);
     }
  else if (target.tagName.toLowerCase() == "h1"){
     return CLC_H1_Info1(target);
     }
  else if (target.tagName.toLowerCase() == "h2"){
     return CLC_H2_Info1(target);
     }
  else if (target.tagName.toLowerCase() == "h3"){
     return CLC_H3_Info1(target);
     }
  else if (target.tagName.toLowerCase() == "h4"){
     return CLC_H4_Info1(target);
     }
  else if (target.tagName.toLowerCase() == "h5"){
     return CLC_H5_Info1(target);
     }
  else if (target.tagName.toLowerCase() == "h6"){
     return CLC_H6_Info1(target);
     }
  else if (target.tagName.toLowerCase() == "html"){
     return CLC_Html_Info1(target);
     }
  else if (target.tagName.toLowerCase() == "iframe"){
     return CLC_Iframe_Info1(target);
     }      
  else if (target.tagName.toLowerCase() == "img"){
     return CLC_Img_Info1(target);
     }     
  else if (target.tagName.toLowerCase() == "input"){
     return CLC_Input_Info1(target);
     }     
  else if (target.tagName.toLowerCase() == "label"){
     return CLC_Label_Info1(target);
     }     
  else if (target.tagName.toLowerCase() == "legend"){
     return CLC_Legend_Info1(target);
     }    
  else if (target.tagName.toLowerCase() == "li"){
     return CLC_Li_Info1(target);
     }     
  else if (target.tagName.toLowerCase() == "ol"){
     return CLC_Ol_Info1(target);
     }      
  else if (target.tagName.toLowerCase() == "select"){
     return CLC_Select_Info1(target);
     }     
  else if (target.tagName.toLowerCase() == "span"){
     return CLC_Span_Info1(target);
     }
  else if (target.tagName.toLowerCase() == "table"){
     return CLC_Table_Info1(target);
     }   
  else if (target.tagName.toLowerCase() == "td"){
     return CLC_Td_Info1(target);
     } 
  else if (target.tagName.toLowerCase() == "textarea"){
     return CLC_Textarea_Info1(target);
     }   
  else if (target.tagName.toLowerCase() == "th"){
     return CLC_Th_Info1(target);
     }     
  else if (target.tagName.toLowerCase() == "ul"){
     return CLC_Ul_Info1(target);
     }       
  return "";
  }

//------------------------------------------
//Returns a string that gives detailed information about
//the target.
//The string is generated by using the 
//appropriate element identification function
//found in "clc_id_subfunc_2.js"

function CLC_GenerateDetailedInfo(target){
  if (!target){
     return "";
     }
  if (!target.tagName){
     return "";
     }
  //WAI-ARIA roles take precedence over regular tags
  var roleIDInfo = CLC_GenerateInfoFromRole(target);
  if (roleIDInfo){
     return roleIDInfo;
     }
  //No WAI-ARIA role, use tag names like normal
  if (target.tagName.toLowerCase() == "a"){
     return CLC_Link_Info2(target);
     }
  else if (target.tagName.toLowerCase() == "abbr"){
     return CLC_Abbr_Info2(target);
     }
  else if (target.tagName.toLowerCase() == "acronym"){
     return CLC_Acronym_Info2(target);
     }
  else if (target.tagName.toLowerCase() == "blockquote"){
     return CLC_Blockquote_Info2(target);
     }
  else if (target.tagName.toLowerCase() == "body"){
     return CLC_Body_Info2(target);
     }
  else if (target.tagName.toLowerCase() == "button"){
     return CLC_Button_Info2(target);
     }
  else if (target.tagName.toLowerCase() == "caption"){
     return CLC_Caption_Info2(target);
     }
  else if (target.tagName.toLowerCase() == "div"){
     return CLC_Div_Info2(target);
     }
  else if (target.tagName.toLowerCase() == "fieldset"){
     return CLC_Fieldset_Info2(target);
     }
  else if (target.tagName.toLowerCase() == "frame"){
     return CLC_Frame_Info2(target);
     }
  else if (target.tagName.toLowerCase() == "h1"){
     return CLC_H1_Info2(target);
     }
  else if (target.tagName.toLowerCase() == "h2"){
     return CLC_H2_Info2(target);
     }
  else if (target.tagName.toLowerCase() == "h3"){
     return CLC_H3_Info2(target);
     }
  else if (target.tagName.toLowerCase() == "h4"){
     return CLC_H4_Info2(target);
     }
  else if (target.tagName.toLowerCase() == "h5"){
     return CLC_H5_Info2(target);
     }
  else if (target.tagName.toLowerCase() == "h6"){
     return CLC_H6_Info2(target);
     }
  else if (target.tagName.toLowerCase() == "html"){
     return CLC_Html_Info2(target);
     }
  else if (target.tagName.toLowerCase() == "iframe"){
     return CLC_Iframe_Info2(target);
     }      
  else if (target.tagName.toLowerCase() == "img"){
     return CLC_Img_Info2(target);
     }       
  else if (target.tagName.toLowerCase() == "input"){
     return CLC_Input_Info2(target);
     }   
  else if (target.tagName.toLowerCase() == "label"){
     return CLC_Label_Info2(target);
     }     
  else if (target.tagName.toLowerCase() == "legend"){
     return CLC_Legend_Info2(target);
     }     
  else if (target.tagName.toLowerCase() == "li"){
     return CLC_Li_Info2(target);
     }     
  else if (target.tagName.toLowerCase() == "ol"){
     return CLC_Ol_Info2(target);
     }     
  else if (target.tagName.toLowerCase() == "select"){
     return CLC_Select_Info2(target);
     } 
  else if (target.tagName.toLowerCase() == "span"){
     return CLC_Span_Info2(target);
     }
  else if (target.tagName.toLowerCase() == "table"){
     return CLC_Table_Info2(target);
     }   
  else if (target.tagName.toLowerCase() == "td"){
     return CLC_Td_Info2(target);
     } 
  else if (target.tagName.toLowerCase() == "textarea"){
     return CLC_Textarea_Info2(target);
     }   
  else if (target.tagName.toLowerCase() == "th"){
     return CLC_Th_Info2(target);
     }     
  else if (target.tagName.toLowerCase() == "ul"){
     return CLC_Ul_Info2(target);
     }       
  return "";
  }


//------------------------------------------
//Returns the role string of the target if
//it has a role. Otherwise returns null.
//
function CLC_GetRoleStringOf(target){
  if (!target){
    return "";
    }
  if (!target.hasAttribute || !target.hasAttribute("role")){
    return "";
    }
  var roleStr = target.getAttribute("role");
  var colonPos = roleStr.indexOf(":");
  if (colonPos != -1){
    roleStr = roleStr.substr(colonPos+1);
    }
  return roleStr;
  }

//------------------------------------------
//Returns a string that identifies the target using
//role information.
//

function CLC_GenerateInfoFromRole(target){
  if (!target){
    return "";
    }
  var theRole = CLC_GetRoleStringOf(target);
  if (!theRole){
    return "";
    }
  if (theRole == "menubar"){
    return CLC_Role_Menubar_Info1(target);
    }
  if (theRole == "menuitem"){
    return CLC_Role_Menuitem_Info1(target);
    }
  if (theRole == "checkbox"){
    return CLC_Role_Checkbox_Info1(target);
    }
  if (theRole == "slider"){
    return CLC_Role_Slider_Info1(target);
    }
  if (theRole == "progressbar"){
    return CLC_Role_Progressbar_Info1(target);
    }
  if (theRole == "treeitem"){
    return CLC_Role_Treeitem_Info1(target);
    }
  if (theRole == "radiogroup"){
    return CLC_Role_Radiogroup_Info1(target);
    }
  if (theRole == "radio"){
    return CLC_Role_Radio_Info1(target);
    }
  if (theRole == "application"){
    return CLC_Role_Application_Info1(target);
    }
  if (theRole == "log"){
    return CLC_Role_Log_Info1(target);
    }
  if (theRole == "button"){
    return CLC_Role_Button_Info1(target);
    }
  if (theRole == "checkboxtristate"){
    return CLC_Role_CheckboxTristate_Info1(target);
    }
  if (theRole == "combobox"){
    return CLC_Role_Combobox_Info1(target);
    }
  if (theRole == "img"){
    return CLC_Role_Img_Info1(target);
    }
  if (theRole == "listbox"){
    return CLC_Role_Listbox_Info1(target);
    }
  return "";
  }


function CLC_Role_Menubar_Info1(target){
  return "Menu bar. " 
  }



function CLC_Role_Menuitem_Info1(target){
  var haspopup = target.getAttribute("aria-haspopup");
  if (haspopup == "true"){
    return "Menu with sub menus. ";
    }
  return "Menu item. " 
  }



function CLC_Role_Menubar_Info2(target){
  var menuItemCount = 0;
  var allDescendentsArray = target.getElementsByTagName("*");
  for (var i=0; i<allDescendentsArray.length; i++){
    if (CLC_GetRoleStringOf(allDescendentsArray[i]) == "menuitem"){
      menuItemCount = menuItemCount + 1;
      }
    }
  return "Menu bar with " + menuItemCount + " items. " 
  }


function CLC_Role_Checkbox_Info1(target){
  return "Check box. " 
  }

function CLC_Role_Slider_Info1(target){
  return "Slider. " 
  }

function CLC_Role_Progressbar_Info1(target){
  return "Progress bar. " 
  }

function CLC_Role_Treeitem_Info1(target){
  if (target.hasAttribute && target.hasAttribute("aria-expanded")){
    if (target.getAttribute("aria-expanded").toLowerCase() == "true"){
      return "Expanded tree item. ";
      }
    return "Collapsed tree item. ";
    }
  return "Tree item. " 
  }


function CLC_Role_Radiogroup_Info1(target){
  var radioCount = 0;
  var allDescendentsArray = target.getElementsByTagName("*");
  for (var i=0; i<allDescendentsArray.length; i++){
    if (CLC_GetRoleStringOf(allDescendentsArray[i]) == "radio"){
      radioCount = radioCount + 1;
      }
    }
  return "Radio group with " + radioCount + " items. " 
  }



function CLC_Role_Radio_Info1(target){
  return "Radio button. " 
  }

function CLC_Role_Application_Info1(target){
  return "Application. " 
  }

function CLC_Role_Log_Info1(target){
  return "Log. " 
  }

function CLC_Role_Button_Info1(target){
  return "Button. " 
  }

function CLC_Role_CheckboxTristate_Info1(target){
  var disabledStatusStr = "";
  if (target.getAttribute("aria-disabled") == "true"){
    disabledStatusStr = "Disabled ";
    }
  return disabledStatusStr + "Tristate check box. " 
  }


function CLC_Role_Combobox_Info1(target){
  return "Combo box. " 
  }

function CLC_Role_Img_Info1(target){
  return "Image. " 
  }

function CLC_Role_Listbox_Info1(target){
  return "List box. " 
  }