function draw(canvas, context, image, annotations) {
	context.drawImage(
		image, 0, 0, image.width, image.height,
		0, 0, canvas.width, canvas.height);
	context.drawImage(canvas, 0, 0);
	for (annotation of annotations) {
		if (annotation.display) {
			context.strokeStyle = 'red';
			context.lineWidth = 10;
			context.strokeRect(
				annotation.x, annotation.y,
				annotation.width, annotation.height);
		}
	}
}

function point_in_box(x, y, box) {
	if (x > box.x + box.width || x < box.x ||
		y > box.y + box.height || y < box.y) {
		return false;
	} else { 
		return true;
	}
}

window.onload = function() {
	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');
	var download = document.getElementById('download');
	var random = document.getElementById('random');
	var clear = document.getElementById('clear');

	for (annotation of annotations) {
		annotation.display = false;
	}

	var image = new Image();
	image.onload = function() {
		canvas.width = image.width;
		canvas.height = image.height;
		draw(canvas, context, image, annotations);
	};
	image.src = jpeg;


	download.onclick = function() {
		var image = canvas.toDataURL('image/jpeg', 0.2);
		window.location.href = image;
	};

	clear.onclick = function() {
		for (var annotation of annotations) {
			annotation.display = false;
		}
		draw(canvas, context, image, annotations);
	};

	random.onclick = function() {
		for (var i = 0; i < annotations.length; i++) {
			if (Math.random() < 0.1) {
				annotations[i].display = true;
			} else {
				annotations[i].display = false;
			}
		}
		draw(canvas, context, image, annotations);
	};

	canvas.addEventListener(
		'click',
		function(event) {
			var rect = canvas.getBoundingClientRect();
			var canvas_x = event.clientX - rect.left;
			var canvas_y = event.clientY - rect.top;
			var x = canvas_x * image.width / rect.width;
			var y = canvas_y * image.height / rect.height;
			for (annotation of annotations) {
				if (point_in_box(x, y, annotation)) {
					annotation.display = !annotation.display;
					break;
				}
			}
			draw(canvas, context, image, annotations);
		});
}
