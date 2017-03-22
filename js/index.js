angular.module('nbaStatsApp', [])
  .controller('appController', function( $scope ) {
    var appCtrls = this;

    //App Variables
    appCtrls.scoreColumns = 3;
    appCtrls.scoreBoard = {};

    //list of NBA API EndPoints
    appCtrls.apiEndPoints = {
      boxScoreAdvanced: 'http://stats.nba.com/stats/boxscoreadvancedv2/?StartPeriod=0&EndPeriod=0&StartRange=0&EndRange=0&RangeType=0&callback=?&GameId=',
      boxScoreSummary: 'http://stats.nba.com/stats/boxscoresummaryv2/?StartPeriod=0&EndPeriod=0&StartRange=0&EndRange=0&RangeType=0&callback=?&GameId=',
      scoreBoard: 'http://raw.githubusercontent.com/HenleyKuang/nba-scoreboard/master/00_full_schedule.json'
    }

    //EndPoint JSON Indexes
    appCtrls.apiIndex = {
       bxSmryGameSummary: 0, //resulSets[bxSmryGameSummary].name = "GameSummry"
       bxSmryGameStatus: 4, //resulSets[bxSmryGameSummary].rowSet[0][bxSmryGameStatus] = "Final or Q1-4"
       bxSmryGameTimeRemain: 10, //resulSets[bxSmryGameSummary].rowSet[0][bxSmryGameTimeRemain] = "XX:XX"
       bxSmryLineScore: 5 //resulSets[bxSmryLineScore].name = "LineScore"
     }

    //custom JSON function to reduce lines
    appCtrls.callAPI = function ( apiUrl, successCallback, failCallback ) {
      $.getJSON (apiUrl, function (json) {
    			$scope.$apply(function () { successCallback(json); });
  		  }).fail(function(jqxhr){
          if( failCallback != null ) $scope.$apply(function () { failCallback(); });
        });
    }

    appCtrls.getScores = function( ) {
      	var url = appCtrls.apiEndPoints.scoreBoard;
        //clear Scoreboard
        for (var member in appCtrls.scoreBoard) delete appCtrls.scoreBoard[member];

        appCtrls.callAPI( appCtrls.apiEndPoints.scoreBoard,
          function (json) {
            console.log(json);
            //Find game ids for today from the JSON data
            var dateOfScores = new Date(), year, dd, mm;
            if( appCtrls.date ) {
              dateOfScores = appCtrls.date;
              mm = parseInt(dateOfScores.substring(4,6));
            }
            else {
              year = dateOfScores.getFullYear();
              dd = dateOfScores.getDate();
              mm = dateOfScores.getMonth()+1; //Jan is 1

              dateOfScores = year*10000+mm*100+dd;
            }
            mm = mm > 9 ? 10 - mm : mm+2; //convert Month to json data's array index

            var currentColumn = 0;
            for ( var i = 0; i <= appCtrls.scoreColumns; i++)
              appCtrls.scoreBoard[i] = {};

            //for each game found, insert them into an array to be displayed onto page
            for ( let game of json.lscd[mm].mscd.g ) {
              var dayOfGame = parseInt(game.gcode.substring(0,9));
              //if the days of the game is today, then insert new object into our scoreboard
              if( dayOfGame == dateOfScores ) {
                //call boxScoreSummary API to get the scores
                let boxSummary = {
                  game_id: game.gid,
                  status: '',
                  team1: {
                    name:game.h.ta,
                    points: 0
                  },
                  team2: {
                    name : game.v.ta,
                    points: 0
                  }
                };

                var functionSuccess = function (scores) {
                  console.log(scores);
                  var teamsArray = scores.resultSets[appCtrls.apiIndex.bxSmryLineScore].rowSet;
                  boxSummary.team1.points = teamsArray[0][teamsArray[0].length-1];
                  boxSummary.team2.points = teamsArray[1][teamsArray[1].length-1];
                  var gameInfoArray = scores.resultSets[appCtrls.apiIndex.bxSmryGameSummary].rowSet[0];
                  boxSummary.status = gameInfoArray[appCtrls.apiIndex.bxSmryGameStatus];
                  if( boxSummary.status != "Final" )
                    boxSummary.status += ' ' + gameInfoArray[appCtrls.apiIndex.bxSmryGameTimeRemain];

                  appCtrls.scoreBoard[currentColumn][game.gid] = boxSummary;
                  currentColumn = currentColumn < appCtrls.scoreColumns-1 ? currentColumn + 1 : 0;
                };

                var functionFail = function() {
                  boxSummary.status = game.stt; //Game's Start Time
                  appCtrls.scoreBoard[currentColumn][game.gid] = boxSummary;
                  currentColumn = currentColumn < appCtrls.scoreColumns-1 ? currentColumn + 1 : 0;
                };

                appCtrls.callAPI( appCtrls.apiEndPoints.boxScoreSummary + game.gid, functionSuccess, functionFail);
              }
              else if( dayOfGame > dateOfScores )
                break;
            }
          });
        };
      //getScores on load
      appCtrls.getScores();
  });
