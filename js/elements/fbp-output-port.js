import { Element as PolymerElement } from '../polymer-3.0-preview/polymer-element.js';


export class FbpOutputPort extends PolymerElement {
	
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
			}
		}
	}

	constructor() {
		super();
		this.xy = [200,200];
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
					_padding: 0 .4em;
				}
				span {
					flex-grow: 1;
					text-align: right;
				}

			</style>
			<fbp-port-connector></fbp-port-connector>
			<span class="nodename">[[portname]]</span>
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

}

customElements.define(FbpOutputPort.is, FbpOutputPort);