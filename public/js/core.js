var simulador = angular.module('simulador', []);

simulador.controller('mainController', ['$scope', '$http', function($scope, $http) {
	$scope.test = "Si estas viendo esto es porque está configurado correctamente... :)";
}]);