angular.module('nbaStatsApp', [])
  .controller('appController', function( $scope ) {
    var appCtrls = this;

    //App Variables
    appCtrls.scoreBoard = {};

    //list of NBA API EndPoints
    appCtrls.apiEndPoints = {
      boxScoreAdvanced: 'http://stats.nba.com/stats/boxscoreadvancedv2/?StartPeriod=0&EndPeriod=0&StartRange=0&EndRange=0&RangeType=0&GameId=',
      boxScoreSummary: 'http://stats.nba.com/stats/boxscoresummaryv2/?StartPeriod=0&EndPeriod=0&StartRange=0&EndRange=0&RangeType=0&GameId=',
      scoreBoard: 'http://data.nba.com/data/10s/v2015/json/mobile_teams/nba/2016/league/00_full_schedule.json'
    }

    //EndPoint JSON Indexes
    appCtrls.apiIndex = {
       bxSmryLineScore: 5 //resulSets[bxSmryLineScore].name = "LineScore"
     }

    //custom JSON function to reduce lines
    appCtrls.callAPI = function ( apiUrl, successCallback ) {
      // $.getJSON (url, function (json) {
    	// 		$scope.$apply(function () {
    	// 			successCallback(json);
    	// 		});
  		//   });

      $.ajax({
          url: apiUrl,
          type: "GET", /* or type:"GET" or type:"PUT" */
          dataType: 'JSON',
          crossDomain: true,
          success: function (result) {
              successCallback(result);
          },
          error: function () {
              console.log("error");
          },
          headers: {
                    'Access-Control-Allow-Origin': ''
                },
      });
    }

    appCtrls.getScores = function( ) {
      	var url = appCtrls.apiEndPoints.scoreBoard;

        appCtrls.callAPI( appCtrls.apiEndPoints.scoreBoard,
          function (json) {
            //Find game ids for today from the JSON data
            console.log(json);
            var today = new Date();
            var year = today.getFullYear();
            var dd = today.getDate();
            var mm = today.getMonth()+1; //Jan is 1
            mm = mm > 9 ? 10 - mm : mm+2; //convert Month to json data's array index

            //for each game found, insert them into an array to be displayed onto page
            for ( let game of json.lscd[mm].mscd.g ) {
              var dayOfGame = parseInt(game.gcode.substring(0,9))%100;
              //if the days of the game is today, then insert new object into our scoreboard
              if( dayOfGame == dd ) {
                //call boxScoreSummary API to get the scores
                appCtrls.callAPI( appCtrls.apiEndPoints.boxScoreSummary + game.gid, function (scores) {
                  var teamsArray = scores.resultSets[appCtrls.apiIndex[bxSmryLineScore]].rowSet;
                  var boxSummary = {
                    game_id: game.gid,
                    team1Name : game.h.ta,
                    team2Name : game.v.ta,
                    team1Points : teamsArray[0][teamsArray[0].length-1],
                    team2Points : teamsArray[1][teamsArray[1].length-1]
                  };
                  appCtrls.scoreBoard[game.gid] = boxSummary;
                });
              }
              else if( dayOfGame > dd )
                break;
            }
          });
    };
  });
