import { Element as PolymerElement } from '../polymer-3.0-preview/polymer-element.js';
import {FbpBaseMixin} from '../mixins/base.js';

export class FbpConnection extends FbpBaseMixin(PolymerElement) {
	
	static get is() { return 'fbp-connection' }

	static get properties() {
		return {
			in: {
				type: String,
				observer: '_inChanged',
				reflectToAttribute: true
			},
			out: {
				type: String,
				observer: '_outChanged',
				reflectToAttribute: true
			},
			_pIn: {
				type: Object,
				observer: '_portChanged'
			},
			_pOut: {
				type: Object,
				observer: '_portChanged'
			},
			isConnected: {
				type: Boolean,
				computed: '_computeConnected(_pOut, _pIn)'
			},
			loose: {
				type: Boolean,
				computed: '_computeLoose(_pOut, _pIn)',
				observer: '_looseChanged',
				reflectToAttribute: true
			},

			inXY: {
				type: Array,
				//observer: '__pOutChanged'
			},
			outXY: {
				type: Array,
				//observer: '__pOutChanged'
			},
			mouseXY: {
				type: Array,
			},

			_distance: {
				type: Number,
				computed: '_computeDistance(inXY, outXY)'
			},
			_distanceX: {
				type: Number,
				computed: '_computeDistanceX(inXY, outXY)'
			},

			_distanceY: {
				type: Number,
				computed: '_computeDistanceY(inXY, outXY)'
			}
		}
	}

	constructor(outXY=[3,4], inXY=[1,2] ) {
		super();
		
		//this.in = this.uuidv4();
		//this.out = this.uuidv4();

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
		this._pOut = undefined;
		this._pIn = undefined;
	}

	_computeConnected(_pOut, _pIn) {
		return this.hasOutput() && this.hasInput();
	}

	_computeLoose(_pOut, _pIn) {
		return !this.isConnected && ( this.hasOutput() || this.hasInput() );
	}

	hasOutput() {
		return (this._pOut instanceof HTMLElement);
	}

	hasInput() {
		return (this._pIn instanceof HTMLElement);
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
			startXY[0] + Math.abs(this._distanceX/3), startXY[1],
			endXY[0] - Math.abs(this._distanceX/3), endXY[1],
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
			oldValue.updateConnectionState();

			// ToDo: informe port
		}

		if(newValue instanceof HTMLElement) {
			newValue.addEventListener('xy-changed', this._computeXY.bind(this));
			newValue.updateConnectionState();
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

		if(this._pIn) {
			this.inXY = this._pIn.xy;
		}
		
		if(this._pIn) {
			this.outXY = this._pOut.xy;
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



	_inChanged(newValue, oldValue) {
		//console.log('_inChanged', newValue);
		this._pIn = document.getElementById(newValue);

		if(this._pIn) {
			//this._pIn.dispatchEvent(new CustomEvent('kick', {detail: {kicked: true}}));
			//this._pIn.requestConnection();
		}
	}
	/*
	_pInChanged(newValue, oldValue) {
		//console.log('_pInChanged', newValue);
	}
	*/

	_outChanged(newValue, oldValue) {
		this._pOut = document.getElementById(newValue);
	}
	/*
	_pOutChanged(newValue, oldValue) {
		//console.log('_pOutChanged', newValue);
	}
	*/



	_computeDistance(inXY, outXY) {
		return Math.sqrt( Math.pow( outXY[0] - inXY[0], 2) + Math.pow( outXY[0] - inXY[0], 2) );
	}
	_computeDistanceX(inXY, outXY) {
		return ( inXY[0] - outXY[0]);
	}
	_computeDistanceY(inXY, outXY) {
		return Math.abs( outXY[0] - inXY[0]);
	}
}

customElements.define(FbpConnection.is, FbpConnection);