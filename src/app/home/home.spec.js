/**
 * Tests sit right alongside the file they are testing, which is more intuitive
 * and portable than separating `src` and `test` directories. Additionally, the
 * build process will exclude all `.spec.js` files from the build
 * automatically.
 */
describe( 'home section', function() {
  beforeEach( module( 'ngRuter.home' ) );

  describe('filters', function() {
    beforeEach(function () {
      inject(function (_$filter_) {
        $filter = _$filter_;
      });
    });

    it( 'should have a dummy test', inject( function() {
      expect( true ).toBeTruthy();
    }));


    it( 'should have a fromNowFilter', function() {
      var filter = $filter('fromNow');
      expect(filter("")).toBe("a few seconds ago");
    });


    it( 'should have a isoInterval', function() {
      var filter = $filter('isoInterval');
      expect(filter("PT1H")).toBe("an hour");
    });


    it( 'should have a isoInterval that returns on time', function() {
      var filter = $filter('isoInterval');
      expect(filter("PT0S")).toBe("on time");
    });
  });


  describe('controller', function() {
    var $rootScope, $scope, $controller, $httpBackend;

    beforeEach(inject(function(_$rootScope_, _$controller_, _$timeout_, _$httpBackend_) {
      $rootScope = _$rootScope_;
      $scope = $rootScope.$new();
      $controller = _$controller_;
      $httpBackend = _$httpBackend_;

      $timeout = _$timeout_;


      $controller('myBusStopCtrl', {'$rootScope' : $rootScope, '$scope': $scope, $http : $httpBackend, $timeout : $timeout});


    }));
  });
});

