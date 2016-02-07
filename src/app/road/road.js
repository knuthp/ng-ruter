/**
 * Each section of the site has its own module. It probably also has
 * submodules, though this boilerplate is too simple to demonstrate it. Within
 * `src/app/road`, however, could exist several additional folders representing
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
angular.module( 'ngRuter.road', [
  'ui.router'
])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'road', {
    url: '/road',
    views: {
      "main": {
        controller: 'RoadCtrl',
        templateUrl: 'road/road.tpl.html'
      }
    },
    data:{ pageTitle: 'Road RealTime' }
  });
})

 .filter('isoInterval', function() {
    return function(isoInterval) {
      var delay = moment.duration(isoInterval, 'seconds');
      if (delay.asSeconds() === 0) {
        return "none";
      } else {
        return delay.humanize();
      }
    };
 }) 


/**
 * And of course we define a controller for our route.
 */
.controller( 'RoadCtrl', function RoadController( $scope, $http ) {
  $scope.realTimeData = [];
  $scope.getRealTimeData =  function () {
    $http.get("https://spartid-server.herokuapp.com/routetimes/") 
      .success(function(data){
        $scope.realTimeData = data;
      });
  };

  $scope.getDelaySeconds = function(route) {
    return route.travelTime - route.freeFlowTime;
  };



  $scope.getRealTimeData();
}) 

; 

