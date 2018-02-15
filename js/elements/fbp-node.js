import { Element as PolymerElement } from '../polymer-3.0-preview/polymer-element.js';
import {FbpBaseMixin} from '../mixins/base.js';

export class FbpNode extends FbpBaseMixin(PolymerElement) {

	constructor(label="") {
		super();
		if (label) {
			this.label = label;
		}
	}
	
	static get is() { return 'fbp-node' }

	// Declare properties for the element's public API
	static get properties() {
		return {
			label: {
				type: String,
				value: "Node Name",
				observer: '_nodenameChanged'
			},
			draggable: {
				type: String,
				value: 'true',
				reflectToAttribute: true
			},
			xy: {
				type: Array,
				notify: true
			}
		};
	}

	ready() {
		this.xy = [0,0];
		//this._computeXY();
		//this.addEventListener('dragend', this._computeXY.bind(this) );
		super.ready(); // ensure listeners are added once, before the element stamps its template and reacts to initial property values
	}

	static get template() {
		let tpl = document.createElement('template');
		tpl.innerHTML = `
			<style>
				:host {
					display: block;
					position: absolute;
					top:30px;
					left:100px;
					background: rgba(70, 70, 70, 0.92);
					min-width: 10em;
					line-height: 1.5em;
					border-radius: 4px;
					overflow: hidden;
					box-shadow: 0px 1px 1px 1px rgba(0, 0, 0,.2);
				}
				.nodename {
					display: block;
					text-align:center;
				}
				.nodename span {
					display: inline-block;
					margin: auto .4em;
				}
			</style>
			<strong class="nodename"><span>[[label]]</span></strong>
			<slot></slot>
		`;
		return tpl;
	}


	getInputPorts() {
		return this.querySelectorAll('fbp-input-port');
	}

	getOutputPorts() {
		return this.querySelectorAll('fbp-output-port');
	}

	connectedCallback(e) {
		super.connectedCallback();
		this._computeXY();
	}

	// Called whenever the declared properties change. 
	_nodenameChanged(newValue, oldValue) {
		this._setNodeColor(newValue);
	}

	_setNodeColor(label) {
		// ToDo: Optimize color based on:
		// http://juicystudio.com/article/luminositycontrastratioalgorithm.php#ccalgorithms
		let contrast, col;

		do {
			col = '#'+ Math.random().toString(16).slice(-6);
			contrast = this.hex2YIQ(col);
		}
		while( contrast > 160 || contrast < 20);

		console.log('contrast:', contrast);
		this.shadowRoot.querySelector('.nodename').style.backgroundColor = col;
	}


	_computeXY() {
		//console.log('_computeXY');
		this.xy = [parseFloat(this.style.left, 10), parseFloat(this.style.top, 10)];
	}

}

customElements.define(FbpNode.is, FbpNode);