angular.module('nbaStatsApp', [])
  .controller('appController', function( $scope ) {
    var appCtrls = this;

    appCtrls.apiEndPoints = {
      boxScore: 'http://stats.nba.com/stats/boxscoreadvancedv2/?StartPeriod=0&EndPeriod=0&StartRange=0&EndRange=0&RangeType=0&GameId=0021600896',
      scoreBoard: 'http://data.nba.com/data/10s/v2015/json/mobile_teams/nba/2016/league/00_full_schedule.json'
    }

    appCtrls.getJSON = function ( url, successCallback ) {
      $.getJSON (url, function (json) {
    			$scope.$apply(function () {
    				successCallback();
    			});
  		  });
    }

    appCtrls.getScores = function( ) {
      	var url = appCtrls.apiEndPoints.scoreBoard;

        appCtrls.getJSON( appCtrls.apiEndPoints.scoreBoard, function () {appCtrls.scoreBoard = json} );
    };
  });
