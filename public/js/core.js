var simulador = angular.module('simulador', []);

simulador.controller('mainController', ['$scope', '$http', function($scope, $http) {


	// Inicializar Variables
	var sun = document.getElementById('sun'),
	hillBg = document.getElementById('hill-background'),
	hillFg = document.getElementById('hill-foreground'),
	sky = document.getElementsByClassName('sky')[0];
	var tiempo = new Date();
	$scope.horaTexto = "" + tiempo.getHours();
	$scope.minutosTexto = "" + tiempo.getMinutes();
	

	$scope.actualizarHora = function(){
		$scope.hora = parseInt($scope.horaTexto);
		$scope.minutos = parseInt($scope.minutosTexto);
		// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>	AGREGAR VALIDACION DE LA HORA
		// Colocar Cero dos digitos en la hora
		if ($scope.hora < 10){
			$scope.horaTexto = '0' + $scope.hora;
		}
		if ($scope.minutos < 10){
			$scope.minutosTexto = '0' + $scope.minutos;
		}
		$scope.posicionarSol();
	}


	$scope.posicionarSol = function(){
		var top = 50 + ($('.sky').height() * 1.2 * Math.abs(12 - ($scope.hora + $scope.minutos/60))/12),
		left = ($('.sky').width() * (($scope.hora + $scope.minutos/60)/24)) - 100,
		aboveTheHills;

		// Establecer Posicion del sol
		sun.setAttribute('style', 'left:' + left + 'px;top:' + top + 'px');

		// Detectar Noche o Dia
		aboveTheHills = window.innerHeight - hillBg.clientHeight + (sun.clientHeight / 2);
		if (top > aboveTheHills) {
			// Es de Noche.
			sky.className = 'sky night';
			hillBg.className = 'hill-background night';
			hillFg.className = 'hill-foreground night';
		} else {
			// Es de Dia.
			sky.className = 'sky';
			hillBg.className = 'hill-background';
			hillFg.className = 'hill-foreground';
		}
	}


	$scope.actualizarHora();
	$scope.posicionarSol();







}]);