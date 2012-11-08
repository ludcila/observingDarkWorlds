var allHalos = {};

jQuery(function() {
	
	generateSkyIds();
	
	loadHalos();
	
	// Load sky when selected
	$("#sky-id").change(function() { loadSky(jQuery(this).val()); });
	
	
});

function generateSkyIds() {

	$("#sky-id").append("<option></option>");
	for(var i = 1; i < 300; i++) {
		$("#sky-id").append("<option>" + i + "</option>");
	}
	
}

function loadHalos() {
	
	$.get("data/Training_halos.csv", function(csv) {
		
		var rows = csv.split("\n");
		rows = _.without(rows, rows[0], rows[rows.length - 1]);
		_.each(rows, function(row) {
			var fields = row.split(",");
			var numHalos = parseInt(fields[1]);
			var skyHalos = [];
			for(var i = 0; i < numHalos; i++) {
				skyHalos.push({
					x: parseFloat(fields[4+i*2]),
					y: parseFloat(fields[5+i*2])
				});
			}
			allHalos[fields[0].replace("Sky", "")] = skyHalos;
		});		
		
	});
	
}

function loadSky(id) {

	$.get("data/Train_Skies/Training_Sky" + id + ".csv", function(csv) {
		
		var rows = csv.split("\n");
		rows = _.without(rows, rows[0], rows[rows.length - 1]);
		
		var data = _.map(rows, function(row, i) {
			var fields = row.split(",");
			return {
				id: fields[0],
				x: fields[1],
				y: fields[2],
				e1: fields[3],
				e2: fields[4]
			};
		});
		
		drawSky({
			id: id,
			galaxies: data,
			halos: allHalos[id]
		});
		
	});

}

function drawSky(sky) {
	
	var canvas = document.getElementById("sky");
	ctx = canvas.getContext("2d");
	
	ctx.fillStyle="#000000";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	ctx.fillStyle = "#ffffff";
	ctx.strokeStyle= "#ffffff";
		
	_.each(sky.galaxies, function(galaxy, i) {
		var x = galaxy.x / 6;
		var y = galaxy.y / 6;
		var angle = Math.atan2(galaxy.e2, galaxy.e1) / 2;
		var e = Math.sqrt(galaxy.e1^2 + galaxy.e2^2)*3;
		ctx.beginPath();
		ctx.arc(x, y, 1, 0, 2*Math.PI)
		ctx.fill();
		ctx.moveTo(x-e*Math.cos(angle), y-e*Math.sin(angle));
		ctx.lineTo(x+e*Math.cos(angle), y+e*Math.sin(angle));
		ctx.stroke();
		ctx.closePath();
	})
	
	_.each(sky.halos, function(halo, i) {
		ctx.beginPath();
		ctx.arc(halo.x / 6, halo.y / 6, 10, 0, 2*Math.PI)
		ctx.fill();
		ctx.closePath();
	});
	
}