const JSTester = function(){
    this.config = {
      getVar: null,
      getVal: null,
      cookieName : null,
    };
    this.data = {
      cookie : null,
      cookieParsed: null,
      getString: null,
      matched: null,
      matchType: null,
      fire: null,
      fired: 0
     };
  
  };
  
  JSTester.prototype.allTests = {
    toFire: 5,
    testsFired: 0
  };
  
  JSTester.prototype.setConfig = function setConfig(configObj){
    var self = this;
    self.config = configObj;
  }
  
  JSTester.prototype.initialize = function initialize(obj) {
    var self = obj;
    if(
        ( this.getParameterByName( self.config.getVar ) === self.config.getVal )
        || ( ( this.getParameterByName(self.config.getVar) ) && ( self.config.getVal  == true ) )
      ){
      self.data.matchType = 'GET';
      self.data.getString = self.getParameterByName(self.config.getVar);
      self.data.fire = self.config.callFunc;
    }
    else if(cookieHandler){
      self.data.cookie = cookieHandler.getCookie(self.config.cookieName);
      self.data.cookieParsed = self.getParameterFromCookie(self.config.getVar);
      if( ( self.data.cookieParsed === self.config.getVal ) || ( self.data.cookie.indexOf( self.config.getVar )>-1 ) && self.config.getVal == true ){
        self.data.matchType = 'COOKIE';
        self.data.fire = self.config.callFunc;
      }
    }
    if(self.data.fire){
      var caller = self.data.fire;
      if(window['JSTestCallbacks']){
        if(typeof(window['JSTestCallbacks'][caller]) == 'function'){
          //console.log(caller,' is a function');
          if( this.data.fired === 0
              && (JSTester.prototype.allTests.toFire>JSTester.prototype.allTests.testsFired)
            ){
            // pass reference to the initial object calling
            //console.log('calling Obj - 1',obj);
            window['JSTestCallbacks'][caller](obj);
            this.data.fired += 1;
            JSTester.prototype.allTests.testsFired += 1;
          }
        }
      }
      if(!window['JSTestCallbacks']){
        if(typeof(window[caller]) == 'function'){
          //console.log(caller,' is a function');
          if( this.data.fired === 0
              && (JSTester.prototype.allTests.toFire>JSTester.prototype.allTests.testsFired)
            ){
            // pass reference to the initial object calling
            console.log('calling Obj - 1',obj);
            window[caller](obj);
            this.data.fired += 1;
            JSTester.prototype.allTests.testsFired += 1;
          }
        }
      }
    }
  };
  
  // From jennamolby.com/how-to-use-utm-parameters-to-capture-lead-source;
  
  JSTester.prototype.getParameterByName = function getParameterByName(name) {
      var name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
      var    results = regex.exec(location.search);
      return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }
  
  JSTester.prototype.getParameterFromCookie = function getParameterFromCookie(name) {
      var self = this;
      var name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
      var    results = regex.exec(self.data.cookie);
      return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }
  
  JSTester.prototype.setMaxTests = function setMaxTests(val){
    JSTester.prototype.allTests.toFire = val;
  }
  
  
  
  export default JSTester;
  // This is not core library code
  
  // Test altering Default
  // JSTester.prototype.setMaxTests(2);
  
  // myConfig1 = {
  //   cookieName : 'beckerCrumb',
  //   getVar : 'jstest',
  //   getVal : 'defaultTest',
  //   callFunc: 'jstestFunc'
  // }
  
  // var jstestFunc = function jstestFunc(){
  //   alert('Hello');
  // }
  
  
  // var test1 = new JSTester();
  // test1.setConfig(myConfig1);
  // test1.initialize(test1);
  