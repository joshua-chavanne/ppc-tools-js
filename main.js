jQuery(document).ready(function(){
    PPCFormPopulate.config = {
        populateOn: 'name',
        fieldsToParamHash:{
            'VendorID' : 'utm_source',
            'CampaignID' : 'utm_campaign',
            'Device' : 'device',
            'gclid' : 'gclid'
        }
    }
    PPCFormPopulate.init();
});


// Vanilla JS to get around all of the old versions of JQuery
document.addEventListener("DOMContentLoaded",function($){
    var cookieName = 'ppc_crumb';
     window.queryString = window.location.search;
    if(cookieHandler.getCookie('ppc_crumb') && window.queryString.indexOf(cookieHandler.options.varToCheck) === -1)
    {
      //alert('cookie present');
      return;
    }

    //alert('cookie not present');

    if(window.queryString.indexOf(cookieHandler.options.varToCheck) !== -1){
      cookieHandler.eraseCookie('ppc_crumb');
      cookieHandler.setCookie('ppc_crumb',queryString, 0);
    }
    
});