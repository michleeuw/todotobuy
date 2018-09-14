'use strict';

planningApp.service('DateService', function () {
   
   this.checkDaysToGo = function(deadline) {
          var year = deadline.substring(0,4);
          var month = deadline.substring(5,7);
          var day = deadline.substring(8,10);
         //alert("year: " + year + ", month: " + month + ", day: " + day);
          var date        = new Date(year, month-1, day);
          var currentDate = new Date();
          var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
          return Math.round((date.getTime() - currentDate.getTime())/(oneDay));
    }
});