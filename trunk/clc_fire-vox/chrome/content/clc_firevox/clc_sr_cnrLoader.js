

//The function does basically the same thing as:
//http://code.google.com/p/google-axsjax/source/browse/trunk/googleCNRLoader.user.js
//with the difference that the  window.wrappedJSObject.axsCNRSource 
//is being set from a user pref.
//
function CLC_SR_loadCNRSystem(){
  window._content.document.defaultView.wrappedJSObject.axsCNRSource = CLC_SR_Query_CNRUrl();
  var theScript = window._content.document.createElement('script');
  theScript.src = 'http://google-axsjax.googlecode.com/svn/trunk/common/AxsCNRLoader.js';
  window._content.document.getElementsByTagName('head')[0].appendChild(theScript);
}

//-----------------------------------------------


