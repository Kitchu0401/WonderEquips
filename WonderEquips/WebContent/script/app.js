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
		var version = $cookies.get('we.version');
		$scope.token = $cookies.get('we.user.token');
		
		var includeEmpty = $cookies.get('we.user.includeempty');
		$scope.includeEmpty = includeEmpty ? includeEmpty : false;
		
		var watchids = $cookies.get('we.user.watchids');
		var ids;
		if (watchids) {
			ids = watchids.split(',');
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
		
		// if cached version is outdated, refresh cookie data
		// and re-load all watchids to server
		if (version != app.currentVersion) {
			console.log('Update user version info and create new user token.');
			
			// update cached version
			$cookies.put('we.version', app.currentVersion);
			
			// update cached user token
			$scope.token = new Date().getTime();
			$cookies.put('we.user.token', $scope.token);
			
			if (watchids) {
				console.log('Request to load prewatched ids data to server.');
				$scope.load(watchids);
			}
		}
		
		// send access log to server
//		$scope.log();
		
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
			if (($scope.includeEmpty && !req) || req && $scope.check(req)) {
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
				if ($scope.champs[i].watch) {
					$scope.load($scope.champs[i].id);
				}
				break;
			}
		}
		
		$cookies.put('we.user.watchids', $scope.getWatchedChampIds());
	}
	
	// send access log function
	$scope.log = function() {
		$.ajax({
			url: '/WonderEquips/service/log' 
				+ '/' + app.currentVersion
				+ '/' + $scope.token,
			method: 'POST'
		});
	}
	
	// data load function
	$scope.load = function(ids) {
		$.ajax({
			url: '/WonderEquips/service/load' 
				+ '/' + app.currentVersion
				+ '/' + $scope.token
				+ '/' + ids,
			method: 'POST'
		});
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

