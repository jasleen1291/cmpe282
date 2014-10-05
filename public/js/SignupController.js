var app = angular.module('myControllers');



app.controller('SignupController',
function($scope,$routeParams) {
console.log($scope);

$scope.submitted = false; $scope.signupForm = function() { if ($scope.signup_form.$valid) {} else { $scope.signup_form.submitted = true; } }
});
/*
var myApp = angular.module('myControllers', []);

myApp.controller('UserController', function($scope, $http, $window,$location,$routeParams) {
    
    $scope.message = '';
    $scope.submit = function() {

        $http.post('/authenticate', $scope.user).success(function(data, status, headers, config) {
            $window.localStorage.token = data.token;
            $window.sessionStorage.data=data.data;
            $scope.message="welcome"
            console.log("#"+data.redirectUrl);
            console.log($location.path(data.redirectUrl)) ;
            //$location.reload();
        }).error(function(data, status, headers, config) {
            // Erase the token if the user fails to log in
            delete $window.localStorage.token;
            // Handle login errors here
            $scope.message = 'Error: Invalid user or password';
        });
    };
    $scope.logout = function() {

            delete $window.localStorage.token;
            $scope.message = 'You have successfully loggedout';
        
    };
    */