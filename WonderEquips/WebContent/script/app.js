/**
 * Made by Kitchu
 * 2016-02-16
 */
angular.module('WonderEquips', ['ngCookies'])
.controller('MainController', ['$scope', '$cookies', function($scope, $cookies) {
	
	$scope.watchedChampCount = 0;
	
	$scope.elementTag = ['불', '물', '나무', '빛', '어둠'];
	$scope.typeTag = ['공격형', '방어형', '지원형'];
	$scope.skillTag = ['무기', '방어구', '악세서리'];
	
	$scope.init = function() {
		$scope.champs = champs;
		
		// retrieve user cookie data
		var includeEmpty = $cookies.get('we.user.includeempty');
		$scope.includeEmpty = includeEmpty ? includeEmpty : false;
		console.log($scope.includeEmpty);
		
		var watchids = $cookies.get('we.user.watchids');
		if (watchids) {
			var ids = watchids.split(',');
			$scope.watchedChampCount = ids.length;
			
			for (var i = 0; i < ids.length; i++) {
				for (var j = 0; j < $scope.champs.length; j++) {
					if ($scope.champs[j].id == ids[i]) {
						$scope.champs[j].watch = true;
						break;
					}
				}
			}
		}
		
		
		// reset all selector
		$scope.reset();
	}
	
	/**
	 * functions in main page  
	 */
	$scope.selectPart = function(i) {
		$scope.currentPart = i;
		$scope.search();
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
		for (idx in $scope.champs) {
			var req = $scope.champs[idx].skill[$scope.currentPart];
			if (req && $scope.check(req)) {
				$scope.result.push($scope.champs[idx]);
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
	
	/**
	 * functions in popup window
	 */
	$scope.toggleIncludeEmpty = function() {
		$scope.includeEmpty = !$scope.includeEmpty;
		$cookies.put('we.user.includeempty', $scope.includeEmpty);
	}
	
	$scope.getClassIncludeEmpty = function() {
		return $scope.includeEmpty ? "active" : "";
	}
	
	$scope.searchFilter = function(champ) {
		return !$scope.popupSearchText || $scope.popupSearchText.length <= 0
			|| champ.name.indexOf($scope.popupSearchText) >= 0;
	}
	
	$scope.toggleWatch = function(id) {
		for (var i = 0; i < $scope.champs.length; i++) {
			if ($scope.champs[i].id == id) {
				$scope.champs[i].watch = !$scope.champs[i].watch;
				break;
			}
		}
		
		$cookies.put('we.user.watchids', $scope.getWatchedChampIds());
	}
	
	$scope.test = function() {
		console.log($scope.popupSearchText);
	}
	
	// utility functions
	$scope.range = function(n) {
		return new Array(n);
	}
	
	$scope.getWatchedChampIds = function() {
		var ids = [];
		for (var i = 0; i < $scope.champs.length; i++) {
			if ($scope.champs[i].watch) {
				ids.push($scope.champs[i].id);
			}
		}
		
		$scope.watchedChampCount = ids.length;
		return ids;
	}
	
}]);

