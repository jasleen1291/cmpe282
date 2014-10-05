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
angular.module('myApp.controllers',['ngSanitize']);
angular.module('myApp.controllers').
controller('CatalogController',['$scope','Catalog',function($scope,Catalog){
	var menuItems=Catalog.get(function(){
		$scope.menuItems=menuItems;
	});
}]);
angular.module('myApp.controllers').
controller('ViewAllController',['$scope','ViewAll','$sce',function($scope,ViewAll,$sce){
	var menuItems=ViewAll.query(function(){
		$scope.sortorder = 'name';
		
		    var myString = "";
		    angular.forEach(menuItems, function(todo) {
		    	myString += "<div class='items' ><div>"+todo.name+"</div><div> Cost "+todo.cost+"</div><div> Available Quantity "+todo.quantity+"</div></div><br/>";
		    });
		    
		 
		$scope.allItems=$sce.trustAsHtml(myString);
		
		
	});
}]);
