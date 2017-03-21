angular.module('nbaStatsApp', [])
  .controller('appController', function( $scope ) {
    var appCtrls = this;
 
    appCtrls.getScores = function( ) {
      	var url = `http://stats.nba.com/stats/scoreboard/? 
				GameDate=` + appCtrls.date + `&
				LeagueID=00&
				DayOffset=00&
				callback=?`;  
				
		$.getJSON (url, function (json) {
			$scope.$apply(function () {  
				appCtrls.scoreBoard = json;
			});
		  });
    };
  });