import { Element as PolymerElement } from '../polymer-3.0-preview/polymer-element.js';
import {FbpPort} from './fbp-port.js';

export class FbpOutputPort extends FbpPort {
	
	static get is() { return 'fbp-output-port' }

	// Declare properties for the element's public API
	static get properties() {
		return {
			portname: {
				type: String,
				value: "Out"
			},
			xy: {
				type: Array,
				notify: true
			},

		}
	}

	constructor(options) {
		super(options);
		this.xy = [200,200];
	}

	ready() {
		this.parentElement.addEventListener('xy-changed', this._computeXY.bind(this));
		super.ready();
	}

	connectedCallback(e) {
		super.connectedCallback();
		this._computeXY();

		this.getConnections();
	}

	static get template() {
		let tpl = document.createElement('template');
		tpl.innerHTML = `
			<style>
				:host {
					display: flex;
					flex-flow: row-reverse nowrap;
					justify-content: space-around;
					align-items: center;
					_height: 1.5em;
				}
				fbp-port-connector {
					padding: 0 .4em;
				}
				span {
					flex-grow: 1;
					text-align: right;
					color: #DDD;
					font-size: .7rem;
				}

			</style>
			<fbp-port-connector on-click="_handleClick"></fbp-port-connector>
			<span class="nodename">[[label]]</span>
		`;
		return tpl;
	}

	getPortXY() {
		let dotRect = this.getBoundingClientRect(); //this.shadowRoot.querySelector('fbp-port-connector').getBoundingClientRect();
		let parentRect = this.parentNode.getBoundingClientRect();

		//let style = window.getComputedStyle(dot, null);
		let rect = new DOMRect();
		rect.x = (dotRect.x - parentRect.x) + parseFloat(this.parentNode.style.left, 10);
		rect.y = (dotRect.y - parentRect.y) + parseFloat(this.parentNode.style.top, 10);
		rect.width = dotRect.width;
		rect.height = dotRect.height;
		return [rect.x + rect.width, rect.y + rect.height/2];
	}

	_computeXY(e) {

		this.xy = this.getPortXY();
		return;
		
		let rect = this.getBoundingClientRect();
		console.log('port::_computeXY', rect);

		if(rect){
			this.xy = [rect.x, rect.y];
		}
	}

	_handleClick(e) {
		//console.log('_handleClick');
		this.dispatchEvent(new CustomEvent('output-connector-click', {bubbles: true, composed: true} ));
	}

}

customElements.define(FbpOutputPort.is, FbpOutputPort);