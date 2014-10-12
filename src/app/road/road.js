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


/**
 * And of course we define a controller for our route.
 */
.controller( 'RoadCtrl', function RoadController( $scope, $http ) {
  $scope.strekninger = [
    {id : 100098,  beskrivelse : "Asker - Holmen"},
    {id : 100159,  beskrivelse : "Holmen - Sandvika"},
    {id : 100160,  beskrivelse : "Sandvika - Lysaker vest"}
  ];

  $scope.getRealTimeForId = function(id) {
    return _.find($scope.realTimeData.reisetid, function(elem) {
      return elem.strekningid == id;
    }); 
  };

  $scope.getLegInfoForId = function(id) {
    return _.find($scope.legs.strekning, function(elem) {
      return elem.id == id;
    }); 
  };


  $scope.realTimeData = [];
  $scope.getRealTimeData =  function () {
    $http.get("http://rest-translator.herokuapp.com/reisetider/reisetider")
      .success(function(data){
        $scope.realTimeData = data.reisetider;
      });
  };

  $scope.legs = [];
  $scope.getLegs = function() {
    $http.get("http://rest-translator.herokuapp.com/reisetider/strekninger")
      .success(function(data){
        $scope.legs = data.reisetider;
      });    
  };

  $scope.getRealTimeData();
  $scope.getLegs();
})

; 

