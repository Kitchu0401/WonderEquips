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
		if ($scope.selectedShapesSum >= 4) {
			// TODO show error message
			console.log('Error : you can put shapes up to 4.');
			return;
		}
		
		$scope.selectedShapesSum++;
		$scope.selectedShapes[i]++;
	}
	
	$scope.reset = function() {
		$scope.selectPart(0);
		$scope.selectedShapesSum = 0;
		$scope.selectedShapes = [0, 0, 0, 0, 0, 0];
		$scope.result = [];
	}
	
	$scope.search = function() {
		if (!$scope.selectedShapesSum > 0) {
			// TODO show error message
			console.log('Error : you must select at least 1 shape.');
			return;
		}
		
		$scope.result = [];
		for (idx in champs) {
			var req = champs[idx].skill[$scope.currentPart];
			console.log(req);
			
			if (req && $scope.check(req)) {
				$scope.result.push(champs[idx]);
			}
		}
	}
	
	$scope.check = function(req) {
		var unsolved = 0;
		for (var i = 0; i < req.length; i++) {
			unsolved += Math.max(0, req[i] - $scope.selectedShapes[i]);
		}
		
		unsolved = Math.max(0, unsolved - $scope.selectedShapes[5]);
		return unsolved <= 0;
	}
	
	// utility functions
	$scope.range = function(n) {
		return new Array(n);
	}
	
});

