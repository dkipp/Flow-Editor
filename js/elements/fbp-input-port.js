import { Element as PolymerElement } from '../polymer-3.0-preview/polymer-element.js';
import {FbpBaseMixin} from '../mixins/base.js';

export class FbpInputPort extends FbpBaseMixin(PolymerElement) {
	
	static get is() { return 'fbp-input-port' }

	// Declare properties for the element's public API
	static get properties() {
		return {
			label: {
				type: String,
				value: "in",
				reflectToAttribute: true
			},
			portname: {
				type: String,
				value: "In"
			},
			xy: {
				type: Array,
				notify: true
			}
		}
	}

	constructor(label) {
		super();

		if(label) { this.label = label; }
		
		this.xy = [200,200];
	}

	ready() {
		this.parentElement.addEventListener('xy-changed', this._computeXY.bind(this));
		super.ready();
	}

	connectedCallback(e) {
		super.connectedCallback();
		this._computeXY();
	}

	static get template() {
		let tpl = document.createElement('template');
		tpl.innerHTML = `
			<style>
				:host {
					display: flex;
					flex-flow row nowrap;
					justify-content: space-around;
					align-items: center;
					_height: 1.5em;
				}
				fbp-port-connector {
					padding: 0 .4em;
				}
				span {
					flex-grow: 1;
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
		rect.x = (dotRect.x - parentRect.x) + this.parentNode.xy[0];
		rect.y = (dotRect.y - parentRect.y) + this.parentNode.xy[1];
		rect.width = dotRect.width;
		rect.height = dotRect.height;
		return [rect.x+8.5, rect.y + rect.height/2];
	}

	_computeXY(e) {

		this.xy = this.getPortXY();
		return;

		let rect = this.getBoundingClientRect();
		//console.log('port::_computeXY', rect);

		if(rect){
			
			this.xy = [rect.x, rect.y];
		}
	}

	_handleClick(e) {
		console.log(`connected to:${this.id}`, document.querySelectorAll(`fbp-connection[in="${this.id}"]`) );

	}

}

customElements.define(FbpInputPort.is, FbpInputPort);