/**
 * Made by Kitchu
 * 2016-02-16
 */
angular.module('WonderEquips', [])
.controller('WEController', function($scope){
	
	$scope.init = function() {
		// retrieve user cookie data
		
		// reset all selector
		$scope.reset();
	}
	
	$scope.selectPart = function(i) {
		$scope.currentPart = i;
	}
	
	$scope.selectShape = function(i) {
		console.log(i + ' clicked!');
	}
	
	$scope.reset = function() {
		$scope.selectPart(0);
		$scope.selectedShapes = [0,0,0,0,0];
	} 
	
});
