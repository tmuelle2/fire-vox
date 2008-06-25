var xmlResult = null;
var entries = null;
var index = 0;



var resControlStr = 'Press Enter to watch the current result. N for the next result. P for the previous result. R for related videos. S to conduct a new search.';
var vidControlStr = 'Press space to pause/resume the video. Comma to rewind. Period to fast forward. Equals to increase the volume. Minus to decrease the volume. N for the next video. P for the previous video. R for related videos. S to conduct a new search.';

function getContent(urlStr){
  var url = urlStr;
  _IG_FetchXmlContent(url, function (response) {
      if (response == null || typeof(response) != "object" || response.firstChild == null) {
        _gel("content_div").innerHTML = "<i>Error contacting YouTube.</i>";
        return;
      }
      processResponse(response);
      });
};

function getCurrentVideoId(){
  if (entries === null){
    return '';
  }
  var playerNode = entries[index].getElementsByTagName('player')[0];
  var videoUrl = playerNode.getAttribute('url');
  var preamble = 'http://www.youtube.com/watch?v=';
  var videoId = videoUrl.substring(preamble.length);
  return videoId;
}

function doSearch() {
  var query = escape(_gel('ytSearch').value);
  var category = _gel('catSelect').value;
  var url = 'http://gdata.youtube.com/feeds/api/';
  if (category === ''){
    url = url + 'videos?';
  } else {
    url = url + category;
  }
  if (query !== ''){
    url = url + 'vq=' + query + '&start-index=1&max-results=50';
  }
  getContent(url);
};

function getRelatedVideos() {
  var videoId = getCurrentVideoId();
  if (videoId == ''){
    return;
  }
  var url = 'http://gdata.youtube.com/feeds/api/videos/' + videoId + '/related';
  getContent(url);
};

function processResponse(xmlNode){
  entries = xmlNode.getElementsByTagName('entry');
  index = 0;
  displayEntry();
};

function displayEntry(){
  var title = '';
  var desc = '';
  var dur = '';
  if (entries.length === 0){
    title = 'No videos found.';
	desc = 'Please press s to go back and search for something else.';
  } else {
    title = entries[index].getElementsByTagName('title')[0].textContent;
    desc = entries[index].getElementsByTagName('content')[0].textContent;
    dur = entries[index].getElementsByTagName('yt:duration')[0].getAttribute('seconds') + ' seconds.';
  }	
  var htmlStr = '<h2>' + title + '</h2><p>' + desc + '</p><p>' + dur + '</p>';
  _gel('content_div').innerHTML = htmlStr;
  _gel('controlPixel').blur();
  _gel('controlPixel').alt = title + '\n' + desc + '\n' + dur + '\n' + resControlStr;
  _gel('controlPixel').focus();
};

function nextResult(){
  index++;
  if (index >= entries.length){
    index = 0;
  }
  displayEntry();
};


function prevResult(){
  index--;
  if (index < 0){
    index = entries.length - 1;
  }
  displayEntry();
};

function createSearchControls(){
  var htmlStr = "<label for='ytSearch'>YouTube Search</label>" +
      "<input type='text' id='ytSearch' onkeypress='if (event.keyCode == 13) {doSearch()}'></input>" +
	  "<br/><br/>" +
	  "<select id='catSelect' onkeypress='if (event.keyCode == 13) {doSearch()}'>" +
	  "<option value=''>Select a category</option>" +
	  "<option value='standardfeeds/top_rated?time=today&'>Top rated</option>" +
	  "<option value='standardfeeds/top_favorites?time=today&'>Top favorites</option>" +
	  "<option value='standardfeeds/most_viewed?time=today&'>Most viewed</option>" +
	  "<option value='standardfeeds/most_recent?time=today&'>Most recent</option>" +
	  "<option value='standardfeeds/most_discussed?time=today&'>Most discussed</option>" +
	  "<option value='standardfeeds/most_linked?time=today&'>Most linked</option>" +
	  "<option value='standardfeeds/most_responded?time=today&'>Most responded</option>" +
	  "<option value='standardfeeds/recently_featured?time=today&'>Recently featured</option>" +
	  "<option value='videos/-/Animals/?'>Animals</option>" +
	  "<option value='videos/-/Autos/?'>Autos</option>" +
	  "<option value='videos/-/Comedy/?'>Comedy</option>" +
	  "<option value='videos/-/Education/?'>Education</option>" +
	  "<option value='videos/-/Entertainment/?'>Entertainment</option>" +
	  "<option value='videos/-/Film/?'>Film</option>" +
	  "<option value='videos/-/Games/?'>Games</option>" +
	  "<option value='videos/-/Howto/?'>How To</option>" +
	  "<option value='videos/-/Music/?'>Music</option>" +
	  "<option value='videos/-/News/?'>News</option>" +
	  "<option value='videos/-/Nonprofit/?'>Nonprofit</option>" +
	  "<option value='videos/-/People/?'>People</option>" +
	  "<option value='videos/-/Sports/?'>Sports</option>" +
	  "<option value='videos/-/Tech/?'>Technology</option>" +
	  "<option value='videos/-/Travel/?'>Travel</option>" +
	  "</select>";
  _gel('content_div').innerHTML = htmlStr;
  _gel('ytSearch').focus();
};

function playPauseToggle(){
  var ytplayer = document.getElementById("myytplayer");
  if (ytplayer.getPlayerState() == 1){
    ytplayer.pauseVideo();
  } else {
    ytplayer.playVideo();
  }
};

function increaseVolume(){
  var ytplayer = document.getElementById("myytplayer");
  var vol = ytplayer.getVolume() + 10;
  if (vol > 100){
    vol = 100;
  }
  ytplayer.setVolume(vol);
};

function decreaseVolume(){
  var ytplayer = document.getElementById("myytplayer");
  var vol = ytplayer.getVolume() - 10;
  if (vol < 0){
    vol = 0;
  }
  ytplayer.setVolume(vol);
};

function muteToggle(){
  var ytplayer = document.getElementById("myytplayer");
  if (ytplayer.isMuted()){
    ytplayer.unMute();
  } else {
    ytplayer.mute();
  }
};

function seekForward(){
  var ytplayer = document.getElementById("myytplayer");
  var stepSize = ytplayer.getDuration() / 10;
  var newTime = ytplayer.getCurrentTime() + stepSize;
  if (newTime < ytplayer.getDuration()){
    ytplayer.seekTo(newTime,true);
  }
};

function seekBackward(){
  var ytplayer = document.getElementById("myytplayer");
  var stepSize = ytplayer.getDuration() / 10;
  var newTime = ytplayer.getCurrentTime() - stepSize;
  if (newTime < 0){
    newTime = 0;
  }
  ytplayer.seekTo(newTime,true);
};


function keyHandler(evt){
  var currentAlt = _gel('controlPixel').alt;
  _gel('controlPixel').alt = '';
  _gel('controlPixel').blur();
  _gel('controlPixel').focus();
  _gel('controlPixel').alt = currentAlt;

  if (evt.keyCode == 13){ // Enter
    playCurrent();
    return false;
  }
  if (evt.charCode == 109){ // m
    muteToggle();
    return false;
  }
  if (evt.charCode == 110){ // n
    nextResult();
    return false;
  }
  if (evt.charCode == 112){ // p
    prevResult();
    return false;
  }
  if (evt.charCode == 114){ // r
    getRelatedVideos();
    return false;
  }
  if (evt.charCode == 115){ // s
    createSearchControls();
    return false;
  }
  if (evt.charCode == 32){ // space
    playPauseToggle();
    return false;
  }
  if (evt.charCode == 61){ // =
    increaseVolume();
    return false;
  }
  if (evt.charCode == 45){ // -
    decreaseVolume();
    return false;
  }
  if (evt.charCode == 44){ // ,
    seekBackward();
    return false;
  }
  if (evt.charCode == 46){ // .
    seekForward();
    return false;
  }
  if (evt.charCode == 63){ // ?
    _gel('controlPixel').blur();
    _gel('controlPixel').focus();
    return false;
  }
  return true;
};

function playCurrent(){
  var videoId = getCurrentVideoId();
  if (videoId == ''){
    return;
  }
  _gel('content_div').innerHTML = '<div id="playerArea"></div>';
  var params = { allowScriptAccess: "always" };
  var atts = { id: "myytplayer" };

  var width = _gel('content_div').parentNode.parentNode.clientWidth;
  var height = _gel('content_div').parentNode.parentNode.clientHeight;

  var ytStr = 'http://www.youtube.com/v/' + videoId + '&enablejsapi=1&disablekb=1&autoplay=1&playerapiid=ytplayer';

  swfobject.embedSWF(ytStr, "playerArea", width, height, "8", null, null, params, atts);
  
  _gel('controlPixel').alt = vidControlStr;
};


_IG_RegisterOnloadHandler(createSearchControls);


_gel('controlPixel').addEventListener('keypress', keyHandler, true);
