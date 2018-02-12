import { Element as PolymerElement } from '../polymer-3.0-preview/polymer-element.js';


export class FbpConnection extends PolymerElement {
	
	static get is() { return 'fbp-connection' }

	static get properties() {
		return {
			inputPort: {
				type: Object,
				//observer: '_inputPortChanged'
			},
			outputPort: {
				type: Object,
				//observer: '_outputPortChanged'
			},
			inXY: {
				type: Array,
				//observer: '_outputPortChanged'
			},
			outXY: {
				type: Array,
				//observer: '_outputPortChanged'
			},
			bbox: {
				type: Object,
			}

		}
	}

	ready() {
		// default values:
		super.ready();
	}

	constructor(inXY=[1,2], outXY=[3,4]) {
		super();
		//this.bbox = {left:0, top:0, width:10, height:10, padding:10, in:[0,0], out:[0,0]};

		console.log(inXY);
		this.inXY = inXY;
		this.outXY = outXY;
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
				}
			</style>
			<canvas id="canvas" width="1000px" height="1000px"></div>
		`;
		return tpl;
	}

	connectedCallback(e) {
		super.connectedCallback();
		//this._updateBBox();
		this.draw();
	}

	_updateBBox(){

		if(this.inputPort){
			
			let xyInput = this.inputPort.getPortXY();
			let xyOutput = this.outputPort.getPortXY();

			let xMin = Math.min(xyInput[0], xyOutput[0]);
			let xMax = Math.max(xyInput[0], xyOutput[0]);
			let yMin = Math.min(xyInput[1], xyOutput[1]);
			let yMax = Math.max(xyInput[1], xyOutput[1]);

			
			this.style.top = yMin + 'px';
			this.style.left = xMin + 'px';

			let canvas = this.shadowRoot.querySelector('#canvas');
			canvas.width = xMax - xMin;
			canvas.height = yMax - yMin;
		}
	}

	draw() {

		let canvas = this.shadowRoot.querySelector('#canvas');
		let ctx = canvas.getContext('2d');
		ctx.strokeStyle = '#333';
		ctx.lineWidth = 2;

		// line
		ctx.beginPath();
		ctx.moveTo( ...this.inXY );
		ctx.lineTo( ...this.outXY );
		ctx.stroke();

		// bezier
		ctx.strokeStyle = '#999';
		ctx.beginPath();
		ctx.moveTo(...this.outXY);
		ctx.lineTo( this.outXY[0] + 5, this.outXY[1] );
		ctx.bezierCurveTo(
			this.outXY[0] + 100, this.outXY[1],
			this.inXY[0] - 100, this.inXY[1],
			this.inXY[0] - 5, this.inXY[1],
		);
		ctx.lineTo(...this.inXY);
		ctx.stroke();

		
		// input
		ctx.fillStyle = '#83D0F2';
		ctx.beginPath();
		ctx.arc(...this.inXY, 5, 0, 2*Math.PI);
		ctx.fill();

		//output
		ctx.fillStyle = '#E66465';
		ctx.beginPath();
		ctx.arc(...this.outXY, 5, 0, 2*Math.PI);
		ctx.fill();
	}



	// Called whenever the declared properties change. 
	_inputPortChanged(newValue, oldValue) {
		console.log('_inputPortChanged():', newValue);
		this.bbox.in = this.inputPort.xy;
		this.inputPort.addEventListener('xy-changed', this._positionChanged.bind(this));
	}

	_outputPortChanged(newValue, oldValue) {
		console.log('_outputPortChanged():', newValue);
		this.bbox.out = this.outputPort.xy;
		this.outputPort.addEventListener('xy-changed', this._positionChanged.bind(this));
	}

	_inXYChanged(newValue, oldValue) {
		console.log('_inXYChanged():', newValue);
	}

	_outXYChanged(newValue, oldValue) {
		//console.log('_outXYChanged():', newValue);
	}

	_bboxChanged(newValue, oldValue) {
		
		if(this.inputPort.xy && this.outputPort.xy){

			//update position & canvas size
			let canvas = this.shadowRoot.querySelector('#canvas');
			canvas.width = Math.max(this.inputPort.xy[0] , this.outputPort.xy[0]);
			canvas.height = Math.max(this.inputPort.xy[1] ,this.outputPort.xy[1]);

			console.log('update canvas size to:', canvas.width, canvas.height);
			
			//this.style.top = (this.bbox.top - this.bbox.padding) + 'px';
			//this.style.left = (this.bbox.left - this.bbox.padding) + 'px';

			this.draw();
		}else{
			console.log('update canvas failed', this.inputPort, this.outputPort);
		}
	}


	_positionChanged(e) {
		this._bboxChanged(e);
	}

}

customElements.define(FbpConnection.is, FbpConnection);