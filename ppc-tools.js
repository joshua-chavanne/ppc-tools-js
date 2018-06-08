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

var PPCAttribution = PPCAttribution || {
    config: {},
    state: {
        paramsAr: [],
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
            this.state.paramsAr.push(obj);
        }
    }
};