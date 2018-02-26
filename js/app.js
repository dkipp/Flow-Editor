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

	let mathMethods = getAllMethods(Math);

	for (let i = 0; i < randRange(min, max); i++) {

		let name = mathMethods[Math.floor(Math.random()*mathMethods.length)];
		let node = new FbpNode( {label:'Math.'+name} );
		//console.log(node);

		randomPosition(node, 20, 700);

		for (let i = 0; i < randRange(1, 4); i++) {
			node.createIn({label: randomName()} );  //document.createElement("fbp-input-port")
		}

		node.createOut( {label:name} ); //document.createElement("fbp-output-port")

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
		connection.in = rIn.id;
		connection.out = rOut.id;

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




function testFunct2Node() {

	let STRIP_COMMENTS = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/mg;
	let methods = getAllMethods(Math);

	methods.forEach(function(val, idx, array) {
		console.log(val + ' -> ' + Math[val].toString().replace(STRIP_COMMENTS, ''));// anzahle parameter: 'methodname.length'
	});

	
}

function getAllMethods(object) {
    return Object.getOwnPropertyNames(object).filter(function(property) {
        return typeof object[property] == 'function';
    });
}

