sap.ui.define([], function () {
  "use strict";

  return {

    // formatter method contains the formatting logic
    // parameter iValue gets passed from the view ...
    // ... that uses the formatter
    fooBar: function (ans) {

      var sReturn = "";

      if (ans === "F") {

        sReturn = 'F';

      }
      else {

        sReturn = 'M';

      }

      // return sReturn to the view
      return sReturn;

    },
    onRattingFormatter: function(value){

      var status="";
      if(value==="Good")
      {
        status="Information";
      }
      else if(value==="Average")
      {
        status="Warning";
      }
      else if(value==="Below Average")
      {
        status="Error";
      }
      else
      {
        status="Success";
      }
      return status;
    },
    onStatusFormatter: function(value){

      var status="";
      if(value==="Returned")
      {
        status="Information";
      }
      else if(value==="Borrowed")
      {
        status="Warning";
      }
      
      else
      {
        status="None";
      }
      return status;
    },
    rowSettingIndicator: function(value){
      var indicator="";
      if(value==="U")
      {
        indicator="Warning";

      }
      else if(value==="I")
      {
        indicator="Information";
      }
      else
      {
        indicator="None";
      }

      
      return indicator;
    }

  };

});