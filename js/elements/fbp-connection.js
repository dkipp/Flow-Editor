import { Element as PolymerElement } from '../polymer-3.0-preview/polymer-element.js';


export class FbpConnection extends PolymerElement {
	
	static get is() { return 'fbp-connection' }

	static get properties() {
		return {
			inputPort: {
				type: Object,
				observer: '_portChanged'
			},
			outputPort: {
				type: Object,
				observer: '_portChanged'
			},
			connected: {
				type: Boolean,
				computed: '_computeConnected(outputPort, inputPort)'
			},
			open: {
				type: Boolean,
				computed: '_computeOpen(outputPort, inputPort)',
				observer: '_openChanged'
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
		//this.bbox = {left:0, top:0, width:10, height:10, padding:10, in:[0,0], out:[0,0]};
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

		// removes posible events
		this.outputPort = null;
		this.inputPort = null;
	}


	_computeConnected(outputPort, inputPort) {
		return (outputPort instanceof HTMLElement) && (inputPort instanceof HTMLElement);
	}

	_computeOpen(outputPort, inputPort) {
		if( this.connected){
			return false;
		}
		return (outputPort instanceof HTMLElement) || (inputPort instanceof HTMLElement);
	}

	_openChanged(newValue, oldValue) {
		console.log('_openChanged');
	}

	draw() {

		if( this.isTemp() ){
			this._drawTempConnection();
		}else{
			this._drawValidConnection();
		}
	}

	_drawValidConnection() {

		let canvas = this.shadowRoot.querySelector('#canvas');
		let ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		ctx.strokeStyle = '#333';
		ctx.lineWidth = 2;

		/* line
		ctx.beginPath();
		ctx.moveTo( ...this.inXY );
		ctx.lineTo( ...this.outXY );
		ctx.stroke();
		*/

		// bezier
		ctx.strokeStyle = '#999';
		ctx.beginPath();
		ctx.moveTo( ...this.outXY);
		ctx.bezierCurveTo(
			this.outXY[0] + 100, this.outXY[1],
			this.inXY[0] - 100, this.inXY[1],
			...this.inXY,
		);
		ctx.stroke();

		/*
		//output dot
		ctx.fillStyle = '#FF0';
		ctx.beginPath();
		ctx.arc(...this.outXY, 5, 0, 2*Math.PI);
		ctx.fill();

		// input dot
		ctx.fillStyle = '#0FF';
		ctx.beginPath();
		ctx.arc(...this.inXY, 5, 0, 2*Math.PI);
		ctx.fill();
		*/
	}

	_drawTempConnection() {

		console.log('_drawTempConnection');

		let canvas = this.shadowRoot.querySelector('#canvas');
		let ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		//add eventlistener
		//this.addEventListener('mousemove', this._onMousemove);


		// draw output
		let xy = (this.outputPort)? this.outXY : this.mouseXY;
		ctx.fillStyle = '#FF0';
		ctx.beginPath();
		ctx.arc( ...xy, 5, 0, 2*Math.PI);
		ctx.fill();

		// draw input
		xy = (this.inputPort)? this.inXY : this.mouseXY;
		ctx.fillStyle = '#0FF';
		ctx.beginPath();
		ctx.arc(...xy , 5, 0, 2*Math.PI);
		ctx.fill();

	}


	// Called whenever the declared properties change. 
	_portChanged(newValue, oldValue) {
		
		if(oldValue instanceof HTMLElement) {
			oldValue.removeEventListener('xy-changed', this._computeXY.bind(this));
		}

		if(newValue instanceof HTMLElement) {
			newValue.addEventListener('xy-changed', this._computeXY.bind(this));
		}

		/*
		if( !this.isTemp() ){
			//this.removeEventListener('mousemove', this._onMousemove);
		}
		*/
	}

	_inXYChanged(newValue, oldValue) {
		console.log('_inXYChanged():', newValue);
	}

	_outXYChanged(newValue, oldValue) {
		//console.log('_outXYChanged():', newValue);
	}



	_positionChanged(e) {
		this._bboxChanged(e);
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
		this.mouseXY = [e.layerX,e.layerY];
		this.draw();
		console.log('_onMousemove', e);
	}

	isTemp() {
		return !(this.inputPort && this.outputPort);
	}

}

customElements.define(FbpConnection.is, FbpConnection);