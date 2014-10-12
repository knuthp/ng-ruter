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
  var delayEnum = ["MANGLER", "STOR", "LITEN", "INGEN"];
  var trendEnum = ["OKENDE", "AVTAGENDE", "STABIL"];
  $scope.paths = [
    {name: "Asker - Lysaker", edges : [{id : 100098}, {id : 100159}, {id : 100160}]},
    {name: "Bjorvika - Tusenfryd", edges : [{id: 100202}, {id : 100203}]}
  ];

  $scope.getRealTimeForEdgeId = function(id) {
    return _.find($scope.realTimeData.reisetid, function(elem) {
      return elem.strekningid == id;
    }); 
  };

  $scope.getInfoForEdgeId = function(id) {
    return _.find($scope.edges.strekning, function(elem) {
      return elem.id == id;
    }); 
  };

  $scope.getDelayForPath = function(path) {
    var ret = delayEnum.length;
    if ($scope.realTimeData.reisetid) {
      _.each(path.edges, function(elem, index, list) {
        ret = Math.min(ret, delayEnum.indexOf($scope.getRealTimeForEdgeId(elem.id).forsinkelse));
      });
    }
    return delayEnum[ret];
  };

  $scope.getTrendForPath = function(path) {
    var ret = trendEnum.length;
    if ($scope.realTimeData.reisetid) {
      _.each(path.edges, function(elem, index, list) {
        ret = Math.min(ret, trendEnum.indexOf($scope.getRealTimeForEdgeId(elem.id).tendens));
      });
    }
    return trendEnum[ret];
  };

  $scope.getNormalTravelTimeForPath = function(path) {
    var ret = 0;
    if ($scope.edges && $scope.edges.strekning.length > 0) {
      _.each(path.edges, function(elem, index, list) {
        ret += $scope.getInfoForEdgeId(elem.id).normalreisetid;
      });
    }
    return ret;
  };

  $scope.getRealTimeTravelTimeForPath = function(path) {
    var ret = 0;
    if ($scope.realTimeData.reisetid) {
      _.each(path.edges, function(elem, index, list) {
        ret += $scope.getRealTimeForEdgeId(elem.id).tid;
      });
    }
    return ret;
  };


  $scope.realTimeData = [];
  $scope.getRealTimeData =  function () {
    $http.get("http://rest-translator.herokuapp.com/reisetider/reisetider")
      .success(function(data){
        $scope.realTimeData = data.reisetider;
      });
  };

  $scope.edges = [];
  $scope.getEdges = function() {
    $http.get("http://rest-translator.herokuapp.com/reisetider/strekninger")
      .success(function(data){
        $scope.edges = data.reisetider;
      });    
  };

  $scope.getRealTimeData();
  $scope.getEdges();
})

; 

