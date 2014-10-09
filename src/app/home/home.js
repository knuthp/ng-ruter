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
 * And of course we define a controller for our route.
 */
.controller( 'HomeCtrl', function HomeController( $scope, $http ) {
})


/**
 * Controller for real time info.
 */
.controller( 'myBusStopCtrl', function myBusStopCtrl( $scope, $http, $timeout ) {
  $scope.realTimeData = [];
  $scope.stations = [
    {id : "3012550", name : "Lysaker [tog]", stopType : "Train"},
    {id : "3012551", name : "Lysaker stasjon (nordside Dr.vn)", stopType : "Bus"},
    {id : "3012552", name : "Lysaker stasjon (sydside Dr.vn)", stopType : "Bus"},
    {id : "2200500", name : "Asker [tog]", stopType : "Train"},
    {id : "1250100", name : "Mysen [tog]", stopType : "Train"},
    {id : "6049104", name : "Kongsberg [tog]", stopType : "Train"}
  ];
  $scope.currentStation = $scope.stations[0];

$scope.toggled = function(open) {
    console.log('Dropdown is now: ', open);
  };

  $scope.changeStation = function() {
    $scope.realTimeData = [];
    $scope.getRealTimeData();
  };


  $scope.updateTime = null;

  getStationUrl = function(id) {
    return "http://reis.trafikanten.no/reisrest/realtime/getrealtimedata/" + id + "?callback=JSON_CALLBACK";
  };

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


  $scope.getRowClassBadge = function(item) {
    return "label-" + $scope.getRowClass(item);
  };

  $scope.getRealTimeData =  function () {
    $http.jsonp(getStationUrl($scope.currentStation.id))
          .success(function(data){
              _.each(data, function(element, index, list) {
                element.stopType = $scope.currentStation.stopType;
              });
              $scope.realTimeData = data;
              $scope.updateTime = new Date();
          });
  };

  var interval = 5000;
  function countUp() {
          $scope.getRealTimeData();
          $timeout(countUp, interval);
  }

  $timeout(countUp, interval);
  $scope.getRealTimeData();

})

; 

