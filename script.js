var log = console.log.bind(console);

log('Hello!');



window.onload = init;

window.onkeydown = keydown;
window.onmousemove = mousemove;

var lastClientX, lastClientY;

var timer = 0;


var mouseStopTimeout;

function mousestop() {
	log('mousestop');
}

function mousemove(event) {
	if (timer >= 5) {
		timer = 0;
		var clientX = event.clientX;
		var clientY = event.clientY;
		processNewXY(clientX, clientY);
	}
	timer++;
	clearTimeout(mouseStopTimeout);
	mouseStopTimeout = setTimeout(mousestop, 50);
	
}

function processNewXY(clientX, clientY) {
	
	var dx = clientX - lastClientX;
	var dy = clientY - lastClientY;

	var dxy_position = [
		// dx < 0, dx = 0, dx > 0
		[ 'northwest', 'north' , 'northeast' ], // dy > 0
		[ 'west',      '',       'east'      ], // dy = 0
		[ 'southwest', 'south' , 'southeast' ]  // dy < 0 
	]

	var dx_index, dy_index;

	if (dx > 0) {
		dx_index = 1;
	} else if (dx < 0) {
		dx_index = -1;
	} else {
		dx_index = 0;
	}

	if (dy > 0) {
		dy_index = 1;
	} else if (dy < 0) {
		dy_index = -1;
	} else {
		dy_index = 0;
	}

	dx_index++;
	dy_index++;

	var position = dxy_position[dy_index][dx_index];
	log(dx, dy, position);
	highlightPosition(position);


	lastClientX = clientX;
	lastClientY = clientY;
}

var keycodes = {
	'RIGHT': 39,
	'DOWN': 40,
	'LEFT': 37,
	'UP': 38
}

function keydown(e) {
	switch (e.keyCode) {
		case keycodes['UP']:
			log('up');
			highlightPosition('north');
			break;
		case keycodes['DOWN']:
			log('down');
			highlightPosition('south');
			break;
		case keycodes['LEFT']:
			log('left');
			highlightPosition('west');
			break;
		case keycodes['RIGHT']:
			log('right');
			highlightPosition('east');
			break;
		

	}
}

var positions = {
		'north': ['north'],
		'south': ['south'],
		 'east': ['east'],
		 'west': ['west'],
	'northeast': ['north', 'east'],
	'southeast': ['south', 'east'],
	'southwest': ['south', 'west'],
	'northwest': ['north', 'west']
}

var boxes = {};

var highlightClassName = 'highlighted';

var rotationBoxes = {};

function init() {

	var box;
	var body = document.getElementsByTagName('body')[0];
	log(body);

	var main = createDom('div', 'main');

	body.appendChild(main);

	for (var position in positions) {
		box = createDom('div', 'positionBox ' + position);
		setCssForPosition(box, position);
		boxes[position] = box;
		main.appendChild(box);
	}

	var rotationContainer = createDom('div', 'rotationContainer');



	box = createRotationBox('clockwise');
	rotationContainer.appendChild(box);
	box = createRotationBox('counterclockwise');
	rotationContainer.appendChild(box);

	main.appendChild(rotationContainer);


}

function createRotationBox(rotation) {
	var rotationLabels = {
		'clockwise': 'CC',
		'counterclockwise': 'CCW'
	}
	var box = createDom('div', 'rotationBox ' + rotation);
	box.textContent = rotationLabels[rotation];
	rotationBoxes[rotation] = box;
	return box;
}

function highlightPosition(position) {
	if (position) {
		highlightBox(boxes[position]);
	}
}

function highlightBox(box) {
	for (var position in boxes) {
		var mybox = boxes[position];
		unhighlightBox(mybox);
	}
	box.classList.add(highlightClassName);
}

function unhighlightBox(box) {
	box.classList.remove(highlightClassName);
}


function setCssForPosition(domNode, position) {
	var info = positions[position];
	var cssObj = {};
	domNode.style.top = '50%';
	domNode.style.left = '50%';
	if (contains(info, 'north')) {
		domNode.style.top = '0';
	}
	if (contains(info, 'south')) {
		domNode.style.bottom = '0';
		domNode.style.top = '';
	}
	if (contains(info, 'east')) {
		domNode.style.right = '0';
		domNode.style.left = '';
	}
	if (contains(info, 'west')) {
		domNode.style.left = '0';
	}
}

function createDom(tagname, classname) {
	var node = document.createElement(tagname);
	if (classname) {
		node.className = classname;
	}
	return node;
}

function contains(array, elem) {
	return array.indexOf(elem) >= 0;
}

