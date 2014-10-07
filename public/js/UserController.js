var myApp = angular.module('myControllers', []);

myApp.controller('UserController', function($scope, $http, $window,$location,$routeParams,CartService) {
    
    $scope.message = '';
    $scope.submit = function() {

        $http.post('/authenticate', $scope.user).success(function(data, status, headers, config) {
            
            $window.localStorage.data=JSON.stringify(data.data);
            console.log(data.data);
            //console.log("#"+data.redirectUrl);
            $location.path(data.redirectUrl) ;
        }).error(function(data, status, headers, config) {
            // Erase the token if the user fails to log in
            delete $window.localStorage.token;
            // Handle login errors here
            $scope.message = 'Error: Invalid user or password';
        });
    };
    $scope.logout = function() {

            delete $window.localStorage.data;
            CartService.items=[];
            CartService.total=0;
            $location.path("/login") ;
        
    };
    $scope.profile = function() {

       
        $location.path("/user/profile") ;
    
};
$scope.signup = function() {

    delete $window.localStorage.data;
    
    $location.path("/signup") ;

};
});
