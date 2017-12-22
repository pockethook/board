'use strict';

export default function(annotations) {
	const reset = () => annotations.forEach(value => value.visible = false);

	const point_in_box = (x, y, box) =>
		x <= box.x + box.width && x >= box.x &&
		y <= box.y + box.width && y >= box.y;

	const box_distance = (x, y, box) =>
		Math.sqrt(
			Math.pow(box.x + box.width / 2 - x, 2),
			Math.pow(box.y + box.height / 2 - y, 2));

	const closest_box = (x, y, boxes) =>
		boxes.sort((lhs, rhs) =>
			box_distance(x, y, lhs) - box_distance(x, y, rhs))[0];

	const boxes_at_point = (x, y, boxes) =>
		boxes.filter(box => point_in_box(x, y, box));

	const box_at_point = (x, y, boxes) =>
		closest_box(x, y, boxes_at_point(x, y, boxes));

	const toggle_visible = (box) => box.visible = !box.visible;

	const visible = () =>
		annotations
			.map((value, index) => value.visible ? index : undefined)
			.filter(value => value !== undefined);

	reset();

	return {
		boxes: () => annotations.filter(value => value.visible),
		visible,
		toString: () => visible().toString(),
		toggle_box_at_point: (x, y) => {
			const box = box_at_point(x, y, annotations);
			if (box) {toggle_visible(box);}
		},
		add: indices =>
			indices.forEach(index => annotations[index].visible = true),
		random: () =>
			annotations.forEach(value => value.visible = Math.random() < 0.1),
		reset,
	};
}
