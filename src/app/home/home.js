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
        return "On time";
      } else {
        return delay.humanize();
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
  $scope.realTimeData = [{name : "a"}, {name:"b"}];
  $scope.currentStation = {name : "Lysaker[tog]", id : "3012550"};


  getStationUrl = function(id) {
    return "http://reis.trafikanten.no/reisrest/realtime/getrealtimedata/" + id + "?callback=JSON_CALLBACK";
  };

  getRealTimeData = function() {
    $http.jsonp(getStationUrl($scope.currentStation.id))
          .success(function(data){
              $scope.realTimeData = data;
          });
  };
  $scope.timeInMs = 1;

  var interval = 5000;
  var countUp = function() {
          getRealTimeData();
          $scope.timeInMs+= interval;
          $timeout(countUp, interval);
  };

  $timeout(countUp, interval);
  getRealTimeData();

})

; 

