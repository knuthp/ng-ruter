(function(app) {

    app.config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('settings', {
            url: '/settings',
            views: {
                "main": {
                    controller: 'SettingsController',
                    templateUrl: 'settings/settings.tpl.html'
                }
            },
            data:{ pageTitle: 'Settings' }
        });
    }]);

    app.controller('SettingsController', ['$scope', function ($scope) {

        var init = function() {
        };

        init();
    }]);

}(angular.module("ngRuter.settings", [
    'ui.router'
])));