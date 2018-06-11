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

var PPCTools= PPCTools|| {};


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

};


var PPCFormPopulate = PPCFormPopulate || {
    config: {
        populateOn : 'name',
        fieldsToParamHash: {
            'VendorID' : 'utm_source',
            'CampaignID' : 'utm_campaign',
            'Device' : 'device'
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
            console.log('looking for name fields');
            for(var _i = 0, len = fieldsWithVals.length; _i<len; _i++){
                
                var selectorString = "[name="+fieldsWithVals[_i].name+"]",valueToPopulate = fieldsWithVals[_i].value;
                console.log(selectorString);
                $(selectorString).val(valueToPopulate);
            }
        }
    },
    populateDOM: function(){

    },
    init: function(){
        //this.getConfig();
        this.checkDOMLibrary();
        this.getAttributionFields();
        this.mapFields();
        this.matchFields();
        this.populateDOM();
    }
}


var PPCAttribution = PPCAttribution || {
    config: {},
    state: {
        paramsObjArr: [],
        fieldsAr: [],
        getVarsToNamedFields: {}
    },
    pullGETParams : function(context){
        var getString;
        if(typeof context === 'undefined'){
            getString = document.location.href.slice(document.location.href.indexOf('?'));
        }
        else{
            // Check if stored in cookie or localstorage
        }
        this.gatherGETParamsAr(getString);
    },
    gatherGETParamsAr: function(getString){
        var partsAr, firstParam;
        if(getString.length>0){
            partsAr = getString.split('&');
            partsAr[0] = partsAr[0].replace('?','');
        }
        this.buildParamsHashTable(partsAr);
    },
    buildParamsHashTable(partsAr){
        for( var i = 0; i < partsAr.length; i++){
            var tempAr = partsAr[i].split('='), obj, key, val;
            obj = {
                'key': tempAr[0],
                'val' : tempAr[1]
            }
            this.state.paramsObjArr.push(obj);
        }
    }
};