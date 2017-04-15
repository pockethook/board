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

function point_in_box(x, y, box) {
	if (x > box.x + box.width || x < box.x ||
		y > box.y + box.height || y < box.y) {
		return false;
	} else { 
		return true;
	}
}

function closest_box(x, y, boxes, indices) {
	if (indices.length) {
		var min_distance_2 = Number.MAX_VALUE;
		var min_index = -1;
		for (var i of indices) {
			var diff_x = boxes[i].x + boxes[i].width / 2 - x;
			var diff_y = boxes[i].y + boxes[i].height / 2 - y;
			var distance_2 = diff_x * diff_x + diff_y * diff_y;
			if (distance_2 < min_distance_2) {
				min_distance_2 = distance_2;
				min_index = i;
			}
		}
		return min_index;
	} else {
		return null;
	}
}

function Boxes(boxes) {
	this.boxes = boxes;
	this.visible = new Set();
	this.toString = function() {
		var asc = function(a, b){ return a - b; };
		return '[' + Array.from(this.visible).sort(asc) + ']';
	};
	this.boxes_at_point = function(x, y) {
		var ret = []
		for (var i = 0; i < this.boxes.length; i++) {
			if (point_in_box(x, y, boxes[i])) {
				ret.push(i);
			}
		}
		return ret;
	}
	this.box_at_point = function(x, y) {
		var indices = this.boxes_at_point(x, y);
		return closest_box(x, y, this.boxes, indices);
	}
	this.toggle = function(index) {
		if (this.visible.has(index)) {
			this.visible.delete(index);
		} else {
			if (index >= 0 && index < this.boxes.length) {
				this.visible.add(index);
			}
		}
	}
	this.add = function(indices) {
		for (var index of indices) {
			this.visible.add(index);
		}
	}
	this.reset = function() {
		this.visible.clear();
	}
	this.random = function() {
		this.reset();
		for (var i = 0; i < this.boxes.length; i++) {
			if (Math.random() < 0.1) {
				this.visible.add(i);
			}
		}
	}
}

window.onload = function() {
	var boxes;
	read_json(json, function(data) {
		var annotations = JSON.parse(data);
		boxes = new Boxes(annotations);
		try {
			var indices = JSON.parse(window.location.hash.substring(1));
			// ignores bad values
			boxes.add(indices);
			draw(canvas, context, image, boxes);
		} catch (e) {
		}
		window.history.replaceState(undefined, undefined, anchor(boxes));
	});

	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');

	var image = new Image();
	image.onload = function() {
		canvas.width = image.width;
		canvas.height = image.height;
		draw(canvas, context, image, boxes);
	};
	image.src = jpeg;

	canvas.addEventListener(
		'click',
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
			window.history.replaceState(undefined, undefined, anchor(boxes));
		});

	document.getElementById('download').addEventListener(
		'click',
		function(event) {
			window.location.href = canvas.toDataURL('image/jpeg', 0.2);
		});

	document.getElementById('clear').addEventListener(
		'click',
		function(event) {
			boxes.reset();
			draw(canvas, context, image, boxes);
			window.history.replaceState(undefined, undefined, anchor(boxes));
		});

	document.getElementById('random').addEventListener(
		'click',
		function(event) {
			boxes.random();
			draw(canvas, context, image, boxes);
			window.history.replaceState(undefined, undefined, anchor(boxes));
		});
}
