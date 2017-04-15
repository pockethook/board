function read_json(file, success) {
	var request = new XMLHttpRequest();
	request.open("GET", file);
	request.onreadystatechange = function() {
		if ((request.readyState === 4) &&
			(request.status === 200 || request.status == 0)) {
			success(request.responseText);
		}
	}
	request.send();
}
