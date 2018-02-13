import {FbpNode} from './elements/fbp-node.js';
import {FbpConnection} from './elements/fbp-connection.js';


document.addEventListener("DOMContentLoaded", initApp);


function initApp(){
	addRandomNodes();
	addRandomXYConnections(5,15);


	let rOut = document.querySelector('#canvas').getRandomOutputPort();
	let tempCon = new FbpConnection([10,10], [100,100]);

	tempCon.outputPort = rOut;
	tempCon.setAttribute('slot', 'connections');
	document.querySelector('#canvas').appendChild(tempCon);

}


function addRandomXYConnections(min=1, max=10) {

	for (let i = 0; i < randRange(min, max); i++) {

		let rIn = document.querySelector('#canvas').getRandomInputPort();
		let rOut = document.querySelector('#canvas').getRandomOutputPort();

		if(rOut.parentNode == rIn.parentNode){
			continue;
		}

		let connection = new FbpConnection( rOut.xy, rIn.xy );
		connection.inputPort = rIn;
		connection.outputPort = rOut;

		// add connection
		connection.setAttribute('slot', 'connections');
		document.querySelector('#canvas').appendChild(connection);
	}
}


function addRandomNodes(min=5, max=10) {
	for (let i = 0; i < randRange(min, max); i++) {

		let node = new FbpNode( randomName() );
		node.setAttribute('id', uuidv4() );
		node.setAttribute('slot', 'nodes');
		//console.log(node);

		randomPosition(node, 20, 700);

		for (let i = 0; i < randRange(1, 4); i++) {
			node.appendChild( document.createElement("fbp-input-port") );
		}

		for (let i = 0; i < randRange(1, 2); i++) {
			node.appendChild( document.createElement("fbp-output-port") );
		}

		document.querySelector('#canvas').appendChild(node);
	}
}


function randomName(){
	return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, randRange(3,12));
}

function randomCanvasXY() {
	let c = document.querySelector('#canvas');
	let rX = randRange(0, 900);
	let rY = randRange(0, 700);
	return [rX, rY];
}

function randomPosition(e, min, max) {
	let x = randRange(min, max)
	let y = randRange(min, max)
	e.style.top = `${y}px`;
	e.style.left =`${x}px`;
}

function randRange(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}
