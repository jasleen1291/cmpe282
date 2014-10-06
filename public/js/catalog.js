/**
 * New node file
 */
angular.module('myApp.services',['ngResource']);
angular.module('myApp.services').factory('Catalog',function($resource){
	return $resource('/user/catalog');
});
angular.module('myApp.services').factory('ViewAll',function($resource){
	
	var abc= $resource('/user/items/all');
	
	return abc;
});
angular.module('myApp.services').factory('View',function($resource){
	return $resource('/user/:id', {
		id : '@_id'
	}, {

		update : {
			method : 'PUT'
		}
	});
});
angular.module('myApp.controllers',['ngSanitize']);
angular.module('myApp.controllers').
controller('CatalogController',['$scope','Catalog','View','$location','$routeParams',function($scope,Catalog,View,$location,$routeParams){
	var menuItems=Catalog.get(function(){
		$scope.menuItems=menuItems;
	});
	$scope.catalog=$routeParams.catalog;
	//console.log($routeParams);
	var menu=View.get({id:$scope.catalog},function(){
		$scope.sortorder = 'name';
		$scope.allItems=menu.Items;
		
		
	});
	
}]);
angular.module('myApp.controllers').
controller('ViewAllController',['$scope','ViewAll','$sce',function($scope,ViewAll,$sce){
	var menuItems=ViewAll.query(function(){
		$scope.sortorder = 'name';
		$scope.allItems=menuItems;
		//console.log(menuItems);
		
	});
}]);
angular.module('myApp.controllers').factory("user",function(){
    return {};
});
angular.module('myApp.controllers').
controller('ViewItemController',['$scope','$sce','user','$location',function($scope,$sce,user,$location){
	$scope.toggle=function(data){
		user.data=(data);
		$location.path("/detail");
      //  $scope.$apply();
	};
}]);
angular.module('myApp.controllers').
controller('ViewController',['$scope','$sce','user','$location',function($scope,$sce,user,$location){
	//console.log(user.data);
	if(user.data!=undefined)
		{
	var description= $sce.trustAsHtml(user.data.description);
	$scope.user=user.data;
	$scope.user.description=description;
		}
	else{
		$location.path("/");
	}
	//console.log($scope.user);
}]);

