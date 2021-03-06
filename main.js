jQuery(document).ready(function(){
    PPCFormPopulate.config = {
        populateOn: 'name',
        fieldsToParamHash:{
            'VendorID' : 'utm_source',
            'CampaignID' : 'utm_campaign',
            'Device' : 'device',
            'gclid' : 'gclid'
        },valueMappings: {
            'google' : 'GooglePPC'
        }
    }
    PPCFormPopulate.init();

   //PPCTools.config = {};

});


// Vanilla JS to get around all of the old versions of JQuery
document.addEventListener("DOMContentLoaded",function($){
    var cookieName = 'ppc_crumb';
    var history = [];
    window.queryString = window.location.search;

    if(localStorage){
        
        try{
            history = JSON.parse(localStorage.getItem('ppc_history')) || [];
        }
        catch{
        }
        history.push(window.location.href);
        localStorage.setItem(cookieName, window.queryString);
        localStorage.setItem('ppc_history',JSON.stringify(history));
    }
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