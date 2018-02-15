import {FbpNode} from './elements/fbp-node.js';
import {FbpConnection} from './elements/fbp-connection.js';


document.addEventListener("DOMContentLoaded", initApp);


function initApp(){
	addRandomNodes();
	addRandomXYConnections(5,15);


	let rIn = document.querySelector('#editor').getRandomInputPort();
	let tempCon = new FbpConnection([150,150], [100,100]);

	/*
	tempCon.inputPort = rIn;
	tempCon.setAttribute('slot', 'connections');
	document.querySelector('#editor').appendChild(tempCon);
	*/

}


function addRandomNodes(min=5, max=10) {

	for (let i = 0; i < randRange(min, max); i++) {

		let node = new FbpNode( randomName() );
		//console.log(node);

		randomPosition(node, 20, 700);

		for (let i = 0; i < randRange(1, 4); i++) {
			node.createIn( randomName() );  //document.createElement("fbp-input-port")
		}

		for (let i = 0; i < randRange(1, 2); i++) {
			node.createOut( randomName() ); //document.createElement("fbp-output-port")
		}

		document.querySelector('#editor').addNode(node);
	}
}


function addRandomXYConnections(min=1, max=10) {

	for (let i = 0; i < randRange(min, max); i++) {

		let rIn = document.querySelector('#editor').getRandomInputPort();
		let rOut = document.querySelector('#editor').getRandomOutputPort();

		if(rOut.parentNode == rIn.parentNode){
			continue;
		}

		let connection = new FbpConnection( rOut.xy, rIn.xy );
		connection.inputPort = rIn;
		connection.outputPort = rOut;

		// add connection
		connection.setAttribute('slot', 'connections');
		document.querySelector('#editor').appendChild(connection);
	}
}


function randomName(){
	return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, randRange(3,12));
}

function randomCanvasXY() {
	let c = document.querySelector('#editor');
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

