/**
 * Each section of the site has its own module. It probably also has
 * submodules, though this boilerplate is too simple to demonstrate it. Within
 * `src/app/home`, however, could exist several additional folders representing
 * additional modules that would then be listed as dependencies of this one.
 * For example, a `note` section could have the submodules `note.create`,
 * `note.delete`, `note.edit`, etc.
 *
 * Regardless, so long as dependencies are managed correctly, the build process
 * will automatically take take of the rest.
 *
 * The dependencies block here is also where component dependencies should be
 * specified, as shown below.
 */
angular.module( 'ngRuter.home', [
  'ui.router'
])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'home', {
    url: '/home',
    views: {
      "main": {
        controller: 'HomeCtrl',
        templateUrl: 'home/home.tpl.html'
      }
    },
    data:{ pageTitle: 'Train RealTime' }
  });
})

.filter('fromNow', function() {
        return function(dateString) {
            //moment.lang('nb'); 
            return moment(dateString).fromNow();
        };
 })

 .filter('isoInterval', function() {
    return function(isoInterval) {
      var delay = moment.duration(isoInterval);
      if (delay.asSeconds() === 0) {
        return "on time";
      } else {
        return delay.humanize();
      }
    };
 }) 

 .filter('hourMinutesSeconds', function() {
    return function(date) {
      if (date) {
        return moment(date).format("HH:mm:ss");
      } else {
        return "";
      }
    };
 })

 .filter('hourMinutes', function() {
    return function(date) {
      if (date) {
        return moment(date).format("HH:mm");
      } else {
        return "";
      }
    };
 })


 .filter('deviations', function() {
    return function(deviations) {
      if (deviations != null && deviations.length > 0) {
        return deviations.length;
      } else {
        return "";
      }
    };
 })


/**
 * Model for stations to get real-time info for.
 */
.factory('realTimeSettings', function() {
  var service = {
      getRefreshInterval : getRefreshInterval
  };
  var refreshInterval = {seconds : 10};
  
  return service;
  
  function getRefreshInterval() {
    return refreshInterval;
  }
})

/**
 * Model for stations to get real-time info for.
 */
.factory('stationModel', function() {
  var service = {
    getStations : getStations
  };
  return service;

  function getStations() {
    return [
      {id : "3012550", name : "Lysaker [tog]", stopType : "Train"},
      {id : "3012551", name : "Lysaker stasjon (nordside Dr.vn)", stopType : "Bus"},
      {id : "3012552", name : "Lysaker stasjon (sydside Dr.vn)", stopType : "Bus"},
      {id : "2190001", name : "Lysaker [båt]", stopType : "Boat"}
      // {id : "2200500", name : "Asker [tog]", stopType : "Train"},
      // {id : "2200440", name : "Aspelund", stopType : "Bus"} 
    ];
  }
})


/**
 * Model for real-time data related to stations
 */
.factory('realTimeStation', function($http, $q) {
  var service = {
    getForStop : getForStop,
    getForStops : getForStops
  };
  return service;

  function getForStop(station) {
    var deferred = $q.defer();
    $http.jsonp(getStationUrl(station.id))
          .success(function(data) {
              _.each(data, function(element, index, list) {
                element.stopType = station.stopType;
              });
              deferred.resolve({ data : data, updateTime : new Date()});
          });
    return deferred.promise;
  }

  function getForStops(stations) {
    var deferred = $q.defer();
    var urlCalls = [];
    var realTimeData = {};
    angular.forEach(stations, function(station) {
      urlCalls.push(getForStop(station));
    });
    $q.all(urlCalls)
      .then(function(results) {
          var ret = { data : _.sortBy(_.flatten(_.pluck(results, 'data')), 'AimedDepartureTime'), updateTime : new Date()};
          deferred.resolve(
            ret
        );
      },
      function (errors) {
        console.log("Error");
      },  function(updates) {
        console.log("Updates" + JSON.stringify(updates));
      });
    return deferred.promise;
  }


  function getStationUrl(id) {
    return "http://reis.trafikanten.no/reisrest/realtime/getrealtimedata/" + id + "?callback=JSON_CALLBACK";
  }
})

/**
 * And of course we define a controller for our route.
 */
.controller( 'HomeCtrl', function HomeController( $scope, $http ) {
})


/**
 * Controller for real time info.
 */
.controller( 'myBusStopCtrl', function myBusStopCtrl( $scope, $http, $timeout, stationModel, realTimeStation, realTimeSettings ) {
  $scope.realTimeData = [];
  $scope.stations = stationModel.getStations();

  $scope.toggled = function(open) {
    console.log('Dropdown is now: ', open);
  };

  $scope.changeStation = function() {
    $scope.realTimeData = [];
    $scope.getRealTimeData();
  };

  $scope.typeModel = {};
  $scope.rtFilter = function(elem) {
    return !$scope.typeModel[elem.stopType];
  };

  $scope.updateTime = null;


  $scope.getRowClass = function(item) {
    var delay = moment.duration(item.Delay);
    if (delay.asMinutes() < 2) {
      return "success";  
    } else if (delay.asMinutes() < 5) {
      return "warning";
    } else {
      return "danger";
    }
  };


  $scope.getRowImage = function(item) {
    var map = {Train : "assets/icons/train20.svg", Bus : "assets/icons/front15.svg", Boat : "assets/icons/ship12.svg"};
    return map[item.stopType];
  };

  $scope.getRealTimeData =  function () {
    var promise = realTimeStation.getForStops($scope.stations);
    promise.then(function(payload) {
      $scope.realTimeData = payload.data;
      $scope.updateTime = payload.updateTime;
    });
  };

  $scope.interval = realTimeSettings.getRefreshInterval();
  function countUp() {
    $scope.getRealTimeData();
    $scope.interval = realTimeSettings.getRefreshInterval();
    $timeout(countUp, $scope.interval.seconds * 1000);
  }

  $timeout(countUp, $scope.interval.seconds * 1000);
  $scope.getRealTimeData();


  $scope.getDeviationsSymbol = function(item) {
    if (item.Extensions != null && item.Extensions.Deviations != null && item.Extensions.Deviations.length > 0) {
      return "fa fa-info";
    } else {
       return false;
    }
  };

  $scope.getDevitationsText = function(item) {
    retText = "";
    if (item.Extensions != null && item.Extensions.Deviations != null && item.Extensions.Deviations.length > 0) {
      _.each(item.Extensions.Deviations, function(element, index, list) {
        retText += element.Header;
      });
    }
    return retText;
  };
})

/**
 * And of course we define a controller for our route.
 */
.controller( 'SettingsCtrl', function SettingsController( $scope, realTimeSettings) {
  $scope.interval = realTimeSettings.getRefreshInterval();
})

; 

