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
			var mid_x = boxes[i].x + boxes[i].width / 2;
			var mid_y = boxes[i].y + boxes[i].height / 2;
			var diff_x = mid_x - x;
			var diff_y = mid_y - y;
			var distance_2 = diff_x * diff_x + diff_y * diff_y;
			if (distance_2 <= min_distance_2) {
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
		var ascending = function(a, b){ return a - b; };
		return Array.from(this.visible).sort(ascending).toString();
	};
	this.boxes_at_point = function(x, y) {
		var ret = []
		for (var i = 0; i < this.boxes.length; i++) {
			if (point_in_box(x, y, boxes[i])) {
				ret.push(i);
			}
		}
		return ret;
	};
	this.box_at_point = function(x, y) {
		var indices = this.boxes_at_point(x, y);
		return closest_box(x, y, this.boxes, indices);
	};
	this.toggle = function(index) {
		if (this.visible.has(index)) {
			this.visible.delete(index);
		} else {
			if (index >= 0 && index < this.boxes.length) {
				this.visible.add(index);
			}
		}
	};
	this.add = function(indices) {
		for (var index of indices) {
			this.visible.add(index);
		}
	};
	this.reset = function() {
		this.visible.clear();
	};
	this.random = function() {
		this.reset();
		for (var i = 0; i < this.boxes.length; i++) {
			if (Math.random() < 0.1) {
				this.visible.add(i);
			}
		}
	};
}
