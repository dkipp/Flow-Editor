import { Element as PolymerElement } from '../polymer-3.0-preview/polymer-element.js';
import {FbpBaseMixin} from '../mixins/base.js';

export class FbpConnection extends FbpBaseMixin(PolymerElement) {
	
	static get is() { return 'fbp-connection' }

	static get properties() {
		return {
			in: {
				type: String,
				reflectToAttribute: true
			},
			out: {
				type: String,
				reflectToAttribute: true
			},
			inputPort: {
				type: Object,
				observer: '_portChanged'
			},
			outputPort: {
				type: Object,
				observer: '_portChanged'
			},
			isConnected: {
				type: Boolean,
				computed: '_computeConnected(outputPort, inputPort)'
			},
			loose: {
				type: Boolean,
				computed: '_computeLoose(outputPort, inputPort)',
				observer: '_looseChanged',
				reflectToAttribute: true
			},

			inXY: {
				type: Array,
				//observer: '_outputPortChanged'
			},
			outXY: {
				type: Array,
				//observer: '_outputPortChanged'
			},
			mouseXY: {
				type: Array,
			}
		}
	}

	constructor(outXY=[3,4], inXY=[1,2] ) {
		super();
		
		this.in = this.uuidv4();
		this.out = this.uuidv4();

		this.inXY = inXY;
		this.outXY = outXY;
		this.mouseXY = [0,0];
	}

	static get template() {
		let tpl = document.createElement('template');
		tpl.innerHTML = `
			<style>
				:host {
					display: block;
					position: absolute;
					top:0;
					left:0;
					mix-blend-mode: screen;
				}
			</style>
			<canvas id="canvas" width="1000px" height="1000px"></div>
		`;
		return tpl;
	}

	connectedCallback() {
		super.connectedCallback();
		this.draw();
	}

	disconnectedCallback() {
		super.disconnectedCallback();

		// removes posible bindings to enable gc
		this.outputPort = undefined;
		this.inputPort = undefined;
	}

	_computeConnected(outputPort, inputPort) {
		return this.hasOutput() && this.hasInput();
	}

	_computeLoose(outputPort, inputPort) {
		return !this.isConnected && ( this.hasOutput() || this.hasInput() );
	}

	hasOutput() {
		return (this.outputPort instanceof HTMLElement);
	}

	hasInput() {
		return (this.inputPort instanceof HTMLElement);
	}



	draw( mouseXY ) {

		// prepare canvas
		let canvas = this.shadowRoot.querySelector('#canvas');
		let ctx = canvas.getContext('2d');

		// clear canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// set styles
		ctx.strokeStyle = '#999'; //this._getRandColor();
		ctx.lineWidth = 2;


		let startXY, endXY;

		// dont draw if both sides are open
		if( !this.hasOutput() && !this.hasInput() ){
			return; 
		}

		// dont draw if not fully connected and mouseXY undefined
		if( !this.isConnected && !mouseXY){
			return;
		}


		startXY = this.hasOutput()? this.outXY : mouseXY;
		endXY = this.hasInput()? this.inXY : mouseXY;


		// drawind the connection
		ctx.beginPath();
		ctx.moveTo( ...startXY );
		ctx.bezierCurveTo(
			startXY[0] + 100, startXY[1],
			endXY[0] - 100, endXY[1],
			...endXY,
		);
		ctx.stroke();

		/*
		// draw output
		ctx.fillStyle = '#FF0';
		ctx.beginPath();
		ctx.arc( ...startXY, 5, 0, 2*Math.PI);
		ctx.fill();

		// draw input
		ctx.fillStyle = '#0FF';
		ctx.beginPath();
		ctx.arc(...endXY , 5, 0, 2*Math.PI);
		ctx.fill();
		*/
	}



	// Called whenever the declared properties change. 
	_portChanged(newValue, oldValue) {
		
		if(oldValue instanceof HTMLElement) {
			oldValue.removeEventListener('xy-changed', this._computeXY.bind(this));
		}

		if(newValue instanceof HTMLElement) {
			newValue.addEventListener('xy-changed', this._computeXY.bind(this));
		}
	}

	_looseChanged(newValue, oldValue) {

		if(oldValue){
			this.removeEventListener('mousemove', this._onMousemove);
		}

		if(newValue){
			this.addEventListener('mousemove', this._onMousemove);
		}
	}


	_computeXY(e) {
		//console.log('_computeXY');

		if(this.inputPort) {
			this.inXY = this.inputPort.xy;
		}
		
		if(this.inputPort) {
			this.outXY = this.outputPort.xy;
		}
		
		this.draw();
	}

	_onMousemove(e) {
		//this.mouseXY = [e.layerX,e.layerY];
		this.draw( [e.layerX, e.layerY] );
		//console.log('_onMousemove', e);
	}



	_getRandColor() {
		// ToDo: Optimize color based on:
		// http://juicystudio.com/article/luminositycontrastratioalgorithm.php#ccalgorithms
		let contrast, col;

		do {
			col = '#'+ Math.random().toString(16).slice(-6);
			contrast = this.hex2YIQ(col);
		}
		while( (contrast < 200) || (contrast > 240));

		return col;
	}

}

customElements.define(FbpConnection.is, FbpConnection);