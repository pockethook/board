'use strict';

import Boxes from './boxes.js';

function draw(image, boxes) {
	const canvas = $('#canvas')[0];
	const context = canvas.getContext('2d');
	context.drawImage(
		image, 0, 0, image.width, image.height,
		0, 0, canvas.width, canvas.height);
	context.strokeStyle = 'red';
	context.lineWidth = 10;
	boxes.boxes().forEach(box => {
		context.strokeRect(box.x, box.y, box.width, box.height);
	});
}

function anchor(boxes) {
	return boxes.toString().length ? `#${boxes}` : window.location.pathname;
}

function set_url_from_boxes(boxes) {
	window.history.replaceState(undefined, undefined, anchor(boxes));
}

function on_boxes_change(image, boxes) {
	draw(image, boxes);
	set_url_from_boxes(boxes);
}

function set_boxes_from_url(boxes) {
	try {
		const indices = JSON.parse(`[${window.location.hash.substring(1)}]`);
		boxes.reset();
		boxes.add(indices);
	} catch (e) {
		// ignore
	}
}

function events(image, boxes) {
	$('#canvas').click(event => {
		const rect = event.target.getBoundingClientRect();
		const canvas_x = event.clientX - rect.left;
		const canvas_y = event.clientY - rect.top;
		const x = canvas_x * image.width / rect.width;
		const y = canvas_y * image.height / rect.height;
		boxes.toggle_box_at_point(x, y);
		on_boxes_change(image, boxes);
	});

	$('#download').click(event => {
		const canvas = $('#canvas')[0];
		const data = canvas.toDataURL('image/jpeg', 0.2);
		$(event.target).attr('href', data);
		$(event.target).attr(
			'download', `${centre}-${date}-${Date.now()}.jpg`);
	});

	$('#clear').click(()=> {
		boxes.reset();
		on_boxes_change(image, boxes);
	});

	$('#random').click(()=> {
		boxes.random();
		on_boxes_change(image, boxes);
	});

	$(window).on('popstate', () =>{
		set_boxes_from_url(boxes);
		on_boxes_change(image, boxes);
	});
}

$(document).ready(function() {
	const image = new Image();
	image.onload = function() {
		const canvas = $('#canvas')[0];
		canvas.width = image.width;
		canvas.height = image.height;
		$.getJSON(`${centre}-${date}.json`, data => {
			const boxes = Boxes(data);
			set_boxes_from_url(boxes);
			on_boxes_change(image, boxes);
			events(image, boxes);
		});
	};
	image.src = `${centre}-${date}.jpg`;
});
