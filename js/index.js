angular.module('nbaStatsApp', [])
  .controller('appController', function( $scope ) {
    var appCtrls = this;
	appCtrls.loading = false;
 
    appCtrls.getScores = function( ) {
		appCtrls.loading = true;
      	var url = `//stats.nba.com/stats/scoreboard/?
				GameDate=` + appCtrls.date + `&
				LeagueID=00&
				DayOffset=00&
				callback=?`;  
				
		$.getJSON (url, function (json) {
			$scope.$apply(function () {  
				appCtrls.scoreBoard = json;
			});
		  }).then(function () {      
			$scope.$apply(function () {
				appCtrls.loading = false;
			});
		});
    };
  });