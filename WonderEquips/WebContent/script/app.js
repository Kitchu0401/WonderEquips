/**
 * Made by Kitchu
 * 2016-02-16
 */
angular.module('WonderEquips', ['ngCookies'])
.controller('WEController', ['$scope', '$cookies', function($scope, $cookies) {
	
	$scope.elementTag = ['불', '물', '나무', '빛', '어둠'];
	$scope.typeTag = ['공격형', '방어형', '지원형'];
	$scope.skillTag = ['무기', '방어구', '악세서리'];
	
	$scope.init = function() {
		// retrieve user cookie data
		$scope.weuserdata = $cookies.getObject('weuserdata');
		console.log($scope.weuserdata);
		
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
			if (req && $scope.check(req)) {
				$scope.result.push(champs[idx]);
			}
		}
	}
	
	// display functions
	$scope.getChampElement = function(index) {
		return $scope.elementTag[index] + '속성';
	}
	
	$scope.getChampType = function(index) {
		return $scope.typeTag[index];
	}
	
	$scope.getSkillOpacity = function(index) {
		return {'opacity': $scope.currentPart == index ? '1.0' : '0.2'};
	}
	
	// private functions
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
	
}]);

