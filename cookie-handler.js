var cookieHandler = {};

cookieHandler.options = {
  varToCheck : 'utm_source'
};


cookieHandler.getCookie = function getCookie(c_name){
    if(document.cookie.length > 0 ){
      var c_start,c_end;
      c_start = document.cookie.indexOf(c_name + "=");
      if (c_start !== -1){
        c_start = c_start + c_name.length + 1;
        c_end = document.cookie.indexOf(';', c_start);
        if(c_end === -1){
          c_end = document.cookie.length;
        }
        return unescape(document.cookie.substring(c_start, c_end));
      }
    }
    return "";
};

cookieHandler.setCookie = function setCookie(name, value, days){
  var expires = "; expires=0;";

  if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
         expires = "; expires="+date.toGMTString();
    }

    document.cookie = name+"="+value+expires+"; path=/";
};

cookieHandler.checkCookie = function checkCookie(cookieToCheck){

};

cookieHandler.eraseCookie = function eraseCookie(name){
  cookieHandler.setCookie(name,"",-1);
};


cookieHandler.parseQueryString = function parseQueryString(){

};

cookieHandler.processUTM = function procesUTM(){};


export default cookieHandler;