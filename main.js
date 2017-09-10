function draw(canvas, context, image, boxes) {
	if (image !== undefined) {
		context.drawImage(
			image, 0, 0, image.width, image.height,
			0, 0, canvas.width, canvas.height);
	}
	if (boxes !== undefined) {
		for (var index of boxes.visible) {
			context.strokeStyle = 'red';
			context.lineWidth = 10;
			context.strokeRect(
				boxes.boxes[index].x, boxes.boxes[index].y,
				boxes.boxes[index].width, boxes.boxes[index].height);
		}
	}
}

function anchor(boxes) {
	if (boxes.visible.size) {
		return '#' + boxes;
	} else {
		return window.location.pathname;
	}
}

function set_url_from_boxes(boxes) {
	window.history.replaceState(undefined, undefined, anchor(boxes));
}

function set_boxes_from_url(boxes) {
	try {
		var indices = JSON.parse(
			'[' + window.location.hash.substring(1) + ']');
		boxes.reset()
		// ignores bad values
		boxes.add(indices);
	} catch (e) {
	}
}

$(document).ready(function() {
	var boxes;
	$.getJSON(centre + '-' + date + '.json', function(data) {
		boxes = new Boxes(data);
		set_boxes_from_url(boxes);
		draw(canvas, context, image, boxes);
		set_url_from_boxes(boxes);
	});

	var canvas = $('#canvas')[0];
	var context = canvas.getContext('2d');

	var download = $('#download');
	var clear = $('#clear');
	var random = $('#random');

	var image = new Image();
	image.onload = function() {
		canvas.width = image.width;
		canvas.height = image.height;
		draw(canvas, context, image, boxes);
	};
	image.src = centre + '-' + date + '.jpg';

	$('#canvas').click(
		function(event) {
			var rect = canvas.getBoundingClientRect();
			var canvas_x = event.clientX - rect.left;
			var canvas_y = event.clientY - rect.top;
			var x = canvas_x * image.width / rect.width;
			var y = canvas_y * image.height / rect.height;
			var index = boxes.box_at_point(x, y);
			if (index !== null) {
				boxes.toggle(index);
			}
			draw(canvas, context, image, boxes);
			set_url_from_boxes(boxes);
		});

	download.click(
		function(event) {
			var data = canvas.toDataURL('image/jpeg', 0.2);
			download.attr('href', data)
			download.attr('download', new Date().getTime() + '.jpg')
		});

	clear.click(
		function(event) {
			boxes.reset();
			draw(canvas, context, image, boxes);
			set_url_from_boxes(boxes);
		});

	random.click(
		function(event) {
			boxes.random();
			draw(canvas, context, image, boxes);
			set_url_from_boxes(boxes);
		});

	$(window).on(
		'popstate',
		function() {
			set_boxes_from_url(boxes);
			draw(canvas, context, image, boxes);
		});
});
