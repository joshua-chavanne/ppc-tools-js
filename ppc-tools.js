/*!
 * PPCToolsStack
 * https://beckermedia.net
 *
 * Copyright Becker Media
 * Released under the MIT license
 * 
 * Author: Joshua Chavanne
 * Date: 2018-06-08T17:24Z
 */

var PPCTools= PPCTools|| {
    state: {
        data: 'hello'
    },
    config: {
        storage: 'cookie',
        attributionKey: 'ppc_crumb',
        historyKey : 'history'
    },
    init: function(){
        this.loadConfig();
        this.loadState();
    },
    loadConfig: function(){

    },
    loadState: function(){

    }
};


// Namespace pattern from JavaScript Patterns Copyright Stoyan Stefanov
PPCTools.namespace = function(ns_string){
    var parts = ns_string.split('.'),
    parent = PPCTools,
    i;

    if(parts[0] === "PPCTools"){
        parts = parts.slice(1);
    }

    for( i = 0; i < parts.length; i += 1){
        if(typeof parent[parts[i]] === "undefined"){
            parent[parts[i]] = {};
        }
        parents = parent[parts[i]];
    }
    return parent;
}



var PPCState = PPCState || {
    firstImpression: null,
    history: [],
    updateHistory: function(){

    },
};


var PPCFormPopulate = PPCFormPopulate || {
    config: {
        populateOn : 'name',
        fieldsToParamHash: {
            'VendorID' : 'utm_source',
            'CampaignID' : 'utm_campaign',
            'Device' : 'device',
            'gclid' : 'gclid'
        },
        valueMappings :{
            'google' : 'GooglePPC'
        }
    },
    state: {
        hasDOMLibrary: false,
        fieldsMatched: [],
        fieldsMapped: [],
        paramHash : {},
        paramValueHashArr: [],
    },
    getConfig: function(){
        if(typeof PPCTools.formConfig !== null){
            this.config = PPCTools.formConfig;
        }
    },
    checkDOMLibrary : function(){
        if($||jQuery){
            this.state.hasDOMLibrary = true;
        }else{
            this.config.populateOn = 'id';
        }
    },
    getAttributionFields : function(){
        var obj = {};
        if(typeof PPCAttribution !== undefined){
            PPCAttribution.pullGETParams();
            this.state.paramValueHashArr = PPCAttribution.state.paramsObjArr;
            for(var i=0; i< this.state.paramValueHashArr.length; i++){
                obj[this.state.paramValueHashArr[i].key] = this.state.paramValueHashArr[i].val;
            }
            this.state.paramHash = obj;
        }
    },
    mapFields : function(){
        var fieldsKeys = Object.keys(this.config.fieldsToParamHash), paramsKeys = [], paramsValues = {};
        for(var _i =0, len = fieldsKeys.length; _i < len; _i++){
            paramsKeys.push(this.config.fieldsToParamHash[fieldsKeys[_i]]);
        }
        console.log(fieldsKeys);
        console.log(paramsKeys);
        for(var _i = 0, len = fieldsKeys.length; _i< len; _i++){
            var fieldName = fieldsKeys[_i], paramName = paramsKeys[_i], paramVal = null, thisObj ={};
            thisObj['name'] = fieldName;
            thisObj['param'] = paramName;
            thisObj['value'] = this.state.paramHash[paramName] || null;
            this.state.fieldsMapped.push(thisObj);
        }
    },
    matchFields : function(){
        var matchOn =[], fieldsWithVals = [], domNodesMatched=[];
        for(var i = 0, len = this.state.fieldsMapped.length; i<len; i++){
            console.log(this.state.fieldsMapped[i]);
            if(this.state.fieldsMapped[i].value !== null){
                fieldsWithVals.push(this.state.fieldsMapped[i]);
            }
        }
        console.log(fieldsWithVals);
        if(this.config.populateOn === 'name'){
            for(var _i = 0, len = fieldsWithVals.length; _i<len; _i++){
                var selectorString = "[name="+fieldsWithVals[_i].name+"]",valueToPopulate = fieldsWithVals[_i].value;
                $(selectorString).val(valueToPopulate);
            }
        }else{
            for(var _i=0, len = fieldsWithVals.length;  _i<len; _i++){
                document.getElementById(fieldsWithVals[_i].name).value(fieldsWithVals[_i].value);
            }
        }
    },
    valueMapper : function(valueToCheck){
        var valueHash = this.config.valueMappings || {}, valueKeys = Object.keys(valueHash), valToExport = valueToCheck;
        console.log(valueKeys);
        if(valueKeys.indexOf(valueToCheck) > -1 ){
            valToExport = console.log(valueHash[valueToCheck]);
        }
        return valToExport;
    },
    init: function(){
        //this.getConfig();
        this.checkDOMLibrary();
        this.getAttributionFields();
        this.mapFields();
        this.matchFields();
    }
}


var PPCAttribution = PPCAttribution || {
    config: {
        persistentType: 'cookie',
        cookieName: 'ppc_crumb',
    },
    state: {
        paramsObjArr: [],
        fieldsAr: [],
        getVarsToNamedFields: {},
        getString : ''
    },
    pullGETParams : function(context){
        var getString;
        if( window.location.search.indexOf(cookieHandler.options.varToCheck) != -1 ){
             getString = document.location.href.slice(document.location.href.indexOf('?'));
             console.log('PPC Tools looking for GET');
         }
        else{
            if( cookieHandler &&   PPCTools.config.storage === 'cookie' ) {
                getString = this.getFromCookie();
                console.log('PPC Tools looking for cookie');
            }
            if( PPCTools.config.storage === 'localStore'){
                getString = this.getFromLocalStore();
                console.log('PPC Tools looking for localStoage');
            }
             //Check if stored in cookie or localstorage
        }
        this.state.getString = getString;
        this.gatherGETParamsAr(getString);
    },
    gatherGETParamsAr: function(getString){
        var partsAr, firstParam;
        try {
            if(getString.length>0){
                partsAr = getString.split('&');
                partsAr[0] = partsAr[0].replace('?','');
            }
            this.buildParamsHashTable(partsAr);
        }catch{}
    },
    buildParamsHashTable: function(partsAr){
        for( var i = 0; i < partsAr.length; i++){
            var tempAr = partsAr[i].split('='), obj, key, val;
            obj = {
                'key': tempAr[0],
                'val' : tempAr[1]
            }
            this.state.paramsObjArr.push(obj);
        }
    },
    getFromLocalStore: function(){
        return localStorage.getItem(this.config.cookieName);
    },
    getFromCookie : function(){
        return cookieHandler.getCookie(this.config.cookieName);
    },
    setParamsToLocalStorage: function(){
        var params = this.state.paramsObjArr;

        localStorage.setItem(this.config.cookieName,getString);
    },
    getParamsFromLocalStorage: function(){

    }
};