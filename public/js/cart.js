/**
 * New node file
 */
var myApp = angular.module('myApp');
var Cart = myApp.factory('Cart', function($resource) {
	return $resource('/user/cart/:id', {
		id : '@_id'
	}, {

		update : {
			method : 'PUT'
		}
	});
});

myApp.factory('CartService', function() {
	console.log("hello");
	return {
		items : [],total:0
	};
});
myApp.controller('addToCartController', function($scope, Cart,CartService,$location) {
	$scope.id = -1;
	try{
		$scope.id =(JSON.parse(localStorage.data).id);
	}catch(err)
	{
		$location.path("/login");
	}
	
	
	$scope.init = function() {
		
		if(CartService.items.length==0){
			console.log("Called");
		var menuItems = Cart.get({
			id : $scope.id
		}, function() {
			//console.log(menuItems);
			var items = JSON.parse(menuItems.cart.items);
			var item=menuItems.items;
			var cost=0.0;
			for(var i in items)
				{
				var name=items[i].item;
				for(var j in item)
					{
						if(item[j].name===name)
							{
							items[i].cost=item[j].cost;
							}
					
					}
				}
			$scope.cartItems = items;
			CartService.items=items;
		});
		}else{
			$scope.cartItems =CartService.items;
		}
	};
	$scope.submitted = false;

	$scope.add = function() {
		var item = {
			opt : "add",
			item : "",
			quantity : 1,
			cost: 0
		};
		if ($scope.addToCart.$valid) {
			item.item = $scope.itemName;
			item.quantity = $scope.qty;
			item.cost = parseFloat($scope.itemCost)*parseFloat(item.quantity);
			//console.log(CartService.items);
			/*
			 * if($scope.cartItems.indexOf(cartItem.item)>=0) { alert('Item
			 * Already in cart'); } else{ $scope.cartItems.push(cartItem.item); }
			 */
			var exists=false;
			angular.forEach(CartService.items, function(cart) {
				if(cart.item===item.item)
					{
					alert("Item already in Cart");
					exists=true;
					}
				
			});
			if(!exists)
				{
					CartService.items.push(item);
					$scope.updateScope();
					
				}
		} else {
			$scope.addToCart.submitted = true;
		}
	};
$scope.updateScope=function()
{
	$scope.cartItems =CartService.items;
	console.log("Updating scope");
};
});