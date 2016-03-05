var app = angular.module('gadgets', ['ngRoute','PlanetaryGadget','ScrapGadget','PlanetData']);

app.config(['$routeProvider', function($routeProvider, PiDataService, PiDataModel) {
	$routeProvider.
		when('/pi', {
			appName : "PI Planning Made Simple",
			templateUrl : 'planetary/piGadgetIndex.html',
			controller : 'planetAppController',
			resolve: {
				'DATA' : function(PiDataService, PiDataModel){
					return PiDataService.getData().then(function(data){
//						console.log("Resolved data, setting in PiDataModel: " + angular.toJson(data));
						PiDataModel.setData(data);
						return PiDataModel.getData();
					})
				}
			}
		}).
		when('/scrap', {
			appName : "Scrap for Everyone! But mostly you",
			templateUrl : 'scrap/scrapGadgetIndex.html',
			controller : 'scrapAppController'
		}).
		otherwise({
			appName : "Whoops",
			redirectTo : '/pi'
		});
}]);

app.run(['$rootScope', function($rootScope){
	$rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
		if(current.$$route) $rootScope.appName = current.$$route.appName
		else $rootScope.appName = "Gadgets";
	})
}]);
