var simulador = angular.module('simulador', []);

simulador.controller('mainController', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {



	// Inicializar Variables
	var sun = document.getElementById('sun'),
	hillBg = document.getElementById('hill-background'),
	hillFg = document.getElementById('hill-foreground'),
	sky = document.getElementsByClassName('sky')[0];
	var tiempo = new Date();
	$scope.horaTexto = "" + tiempo.getHours();
	$scope.minutosTexto = "" + tiempo.getMinutes();
	$scope.temperaturaAmbiente = 28;
	$scope.temperaturaAgua = 40;
	$scope.temperaturaAguaActual = 28;
	$scope.nivelAgua = 50;
	$scope.voltaje = 60;
	$scope.sisternaAutomatica = false;
	$scope.bateriaNivel = 0;
	




	$scope.actualizarHora = function(){
		$scope.hora = parseInt($scope.horaTexto);
		$scope.minutos = parseInt($scope.minutosTexto);
		a = $scope.hora;
		c = $scope.minutos;
		if (a > 23) {alert("Hora Incorrecta");return}
		if (a < 00) {alert("Hora Incorrecta");return}
		if (c > 59) {alert("Minutos Incorrectos");return}
		if (c < 00) {alert("Minutos Incorrectos");return}
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
			// Voltaje
			$scope.voltaje = 0;
		} else {
			// Es de Dia.
			sky.className = 'sky';
			hillBg.className = 'hill-background';
			hillFg.className = 'hill-foreground';
			// Voltaje
			$scope.voltaje = (60 * Math.abs(1 - Math.abs(12 - ($scope.hora + $scope.minutos/60))/12)).toFixed(2);
		}


	}
	$scope.actualizarHora();
	$scope.posicionarSol();

	var taWidth = 80,
	taHeight = 180,
	taMaxTemp = 35.0,
	taMinTemp = 15.0,
	taCurrentTemp = 28.2;

	var taBottomY = taHeight - 5,
	taTopY = 5,
	taBulbRadius = 20,
	tubeWidth = 21.5,
	tubeBorderWidth = 1,
	mercuryColor = "rgb(230,0,0)",
	innerBulbColor = "rgb(230, 200, 200)"
	tubeBorderColor = "#999999";

	var bulb_cy = taBottomY - taBulbRadius,
	bulb_cx = taWidth/2,
	top_cy = taTopY + tubeWidth/2;


	var svg = d3.select("#thermo")
	.append("svg")
	.attr("width", taWidth)
	.attr("height", taHeight);


	var defs = svg.append("defs");

	// Define the radial gradient for the bulb fill colour
	var bulbGradient = defs.append("radialGradient")
	.attr("id", "bulbGradient")
	.attr("cx", "50%")
	.attr("cy", "50%")
	.attr("r", "50%")
	.attr("fx", "50%")
	.attr("fy", "50%");

	bulbGradient.append("stop")
	.attr("offset", "0%")
	.style("stop-color", innerBulbColor);

	bulbGradient.append("stop")
	.attr("offset", "90%")
	.style("stop-color", mercuryColor);


	// Circle element for rounded tube top
	svg.append("circle")
	.attr("r", tubeWidth/2)
	.attr("cx", taWidth/2)
	.attr("cy", top_cy)
	.style("fill", "#FFFFFF")
	.style("stroke", tubeBorderColor)
	.style("stroke-width", tubeBorderWidth + "px");


	// Rect element for tube
	svg.append("rect")
	.attr("x", taWidth/2 - tubeWidth/2)
	.attr("y", top_cy)
	.attr("height", bulb_cy - top_cy)
	.attr("width", tubeWidth)
	.style("shape-rendering", "crispEdges")
	.style("fill", "#FFFFFF")
	.style("stroke", tubeBorderColor)
	.style("stroke-width", tubeBorderWidth + "px");


	// White fill for rounded tube top circle element
	// to hide the border at the top of the tube rect element
	svg.append("circle")
	.attr("r", tubeWidth/2 - tubeBorderWidth/2)
	.attr("cx", taWidth/2)
	.attr("cy", top_cy)
	.style("fill", "#FFFFFF")
	.style("stroke", "none")


	// Main bulb of thermometer (empty), white fill
	svg.append("circle")
	.attr("r", taBulbRadius)
	.attr("cx", bulb_cx)
	.attr("cy", bulb_cy)
	.style("fill", "#FFFFFF")
	.style("stroke", tubeBorderColor)
	.style("stroke-width", tubeBorderWidth + "px");


	// Rect element for tube fill colour
	svg.append("rect")
	.attr("x", taWidth/2 - (tubeWidth - tubeBorderWidth)/2)
	.attr("y", top_cy)
	.attr("height", bulb_cy - top_cy)
	.attr("width", tubeWidth - tubeBorderWidth)
	.style("shape-rendering", "crispEdges")
	.style("fill", "#FFFFFF")
	.style("stroke", "none");


	// Scale step size
	var step = 5;

	// Determine a suitable range of the temperature scale
	var domain = [
	step * Math.floor(taMinTemp / step),
	step * Math.ceil(taMaxTemp / step)
	];

	if (taMinTemp - domain[0] < 0.66 * step)
		domain[0] -= step;

	if (domain[1] - taMaxTemp < 0.66 * step)
		domain[1] += step;

	// D3 scale object
	var scale = d3.scale.linear()
	.range([bulb_cy - taBulbRadius/2 - 8.5, top_cy])
	.domain(domain);

	// Max and min temperature lines
	[taMinTemp, taMaxTemp].forEach(function(t) {

		var isMax = (t == taMaxTemp),
		label = (isMax ? "max" : "min"),
		textCol = (isMax ? "rgb(230, 0, 0)" : "rgb(0, 0, 230)"),
		textOffset = (isMax ? -4 : 4);

		svg.append("line")
		.attr("id", label + "Line")
		.attr("x1", taWidth/2 - tubeWidth/2)
		.attr("x2", taWidth/2 + tubeWidth/2 + 22)
		.attr("y1", scale(t))
		.attr("y2", scale(t))
		.style("stroke", tubeBorderColor)
		.style("stroke-width", "1px")
		.style("shape-rendering", "crispEdges");

		svg.append("text")
		.attr("x", taWidth/2 + tubeWidth/2 + 2)
		.attr("y", scale(t) + textOffset)
		.attr("dy", isMax ? null : "0.75em")
		.text(label)
		.style("fill", textCol)
		.style("font-size", "11px")

	});

	var tubeFill_bottom = bulb_cy,
	tubeFill_top = scale(taCurrentTemp);

	// Rect element for the red mercury column
	svg.append("rect")
	.attr("x", taWidth/2 - (tubeWidth - 10)/2)
	.attr("y", tubeFill_top)
	.attr("width", tubeWidth - 10)
	.attr("height", tubeFill_bottom - tubeFill_top)
	.style("shape-rendering", "crispEdges")
	.style("fill", mercuryColor)

	// Main thermometer bulb fill
	svg.append("circle")
	.attr("r", taBulbRadius - 6)
	.attr("cx", bulb_cx)
	.attr("cy", bulb_cy)
	.style("fill", "url(#bulbGradient)")
	.style("stroke", mercuryColor)
	.style("stroke-width", "2px");

	// Values to use along the scale ticks up the thermometer
	var tickValues = d3.range((domain[1] - domain[0])/step + 1).map(function(v) { return domain[0] + v * step; });

	// D3 axis object for the temperature scale
	var axis = d3.svg.axis()
	.scale(scale)
	.innerTickSize(7)
	.outerTickSize(0)
	.tickValues(tickValues)
	.orient("left");

	// Add the axis to the image
	var svgAxis = svg.append("g")
	.attr("id", "tempScale")
	.attr("transform", "translate(" + (taWidth/2 - tubeWidth/2) + ",0)")
	.call(axis);

	// Format text labels
	svgAxis.selectAll(".tick text")
	.style("fill", "#777777")
	.style("font-size", "10px");

	// Set main axis line to no stroke or fill
	svgAxis.select("path")
	.style("stroke", "none")
	.style("fill", "none")

	// Set the style of the ticks 
	svgAxis.selectAll(".tick line")
	.style("stroke", tubeBorderColor)
	.style("shape-rendering", "crispEdges")
	.style("stroke-width", "1px");


	$scope.pedirAgua = function(){
		if ($scope.nivelAgua > 0){
			if ($scope.nivelAgua < 5){
				$scope.nivelAgua = 0;
			} else {
				$scope.nivelAgua -= 5;
			}
		}
		actualizarNivelTanque();
	}


	$scope.llenarAgua = function(){
		if ($scope.nivelAgua < 100 && $scope.sisternaAutomatica == false){
			if ($scope.nivelAgua > 95){
				$scope.nivelAgua = 100;
			} else {
				$scope.nivelAgua += 5;
			}
			$scope.temperaturaAguaActual -= 0.5;
			$scope.temperaturaAguaActual = $scope.temperaturaAguaActual.toFixed(2);
			if ($scope.temperaturaAguaActual < $scope.temperaturaAmbiente){
				$scope.temperaturaAguaActual = parseFloat($scope.temperaturaAmbiente);
			}
		}
		actualizarNivelTanque();
	}



	  // TANQUE

	  function actualizarNivelTanque(){
	  	var topAgua = Math.abs(145 - (1.45 * $scope.nivelAgua));;
	  	$('.water').css('top', topAgua + 'px');
	  }


	  function actualizarAmbiente(){
	  	if ($scope.sisternaAutomatica && $scope.nivelAgua < 100){
	  		$scope.nivelAgua++;
	  		actualizarNivelTanque();
	  	}
	  	if ($scope.voltaje > 0 && !$scope.sisternaAutomatica){
	  		if ($scope.temperaturaAguaActual < $scope.temperaturaAgua){
	  			$scope.temperaturaAguaActual = parseFloat($scope.temperaturaAguaActual) + 0.05;
	  			$scope.temperaturaAguaActual = $scope.temperaturaAguaActual.toFixed(2);
	  			if ($scope.temperaturaAguaActual > $scope.temperaturaAgua){
	  				$scope.temperaturaAguaActual = parseFloat($scope.temperaturaAgua);
	  			}
	  		}
	  	} else {
	  		if ($scope.nivelAgua < 100){
	  			if ($scope.bateriaNivel == 0){
	  				$scope.temperaturaAguaActual -= 0.01;
	  				$scope.temperaturaAguaActual = $scope.temperaturaAguaActual.toFixed(2);
	  				if ($scope.temperaturaAguaActual < $scope.temperaturaAmbiente){
	  					$scope.temperaturaAguaActual = parseFloat($scope.temperaturaAmbiente);
	  				}
	  			} else {
	  				$scope.temperaturaAguaActual = parseFloat($scope.temperaturaAguaActual) + 0.05;
	  				$scope.temperaturaAguaActual = $scope.temperaturaAguaActual.toFixed(2);
	  				if ($scope.temperaturaAguaActual > $scope.temperaturaAgua){
	  					$scope.temperaturaAguaActual = parseFloat($scope.temperaturaAgua);
	  				}
	  			}
	  		} else {
	  			$scope.temperaturaAguaActual = parseFloat($scope.temperaturaAguaActual) + 0.05;
	  			$scope.temperaturaAguaActual = $scope.temperaturaAguaActual.toFixed(2);
	  			if ($scope.temperaturaAguaActual > $scope.temperaturaAgua){
	  				$scope.temperaturaAguaActual = parseFloat($scope.temperaturaAgua);
	  			}
	  		}
	  	}
	  	if ($scope.nivelAgua == 0){
	  		$scope.temperaturaAguaActual = 0;
	  	}
	  	if ($scope.temperaturaAguaActual > $scope.temperaturaAgua){
	  		$scope.voltaje = 0;
	  	} else {
	  		$scope.posicionarSol();
	  	}

	  	if ($scope.voltaje > 0) {
	  		if ($scope.bateriaNivel < 100){
	  			$scope.bateriaNivel += 0.5;
	  		}
	  	} else {
	  		if ($scope.bateriaNivel > 0){
	  			$scope.bateriaNivel -= 0.5;
	  		}
	  	};
	  	$('#porcentaje-bateria').css('width', $scope.bateriaNivel + '%');

	  	$timeout(function(){
	  		actualizarAmbiente();
	  	}, 500);
	  }

	  actualizarNivelTanque();
	  actualizarAmbiente();


	}]);