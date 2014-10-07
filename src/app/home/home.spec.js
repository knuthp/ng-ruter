/**
 * Tests sit right alongside the file they are testing, which is more intuitive
 * and portable than separating `src` and `test` directories. Additionally, the
 * build process will exclude all `.spec.js` files from the build
 * automatically.
 */
describe( 'home section', function() {
  beforeEach( module( 'ngRuter.home' ) );

 beforeEach(function () {
    module('ngRuter.home');

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
});

