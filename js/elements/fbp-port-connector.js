import { Element as PolymerElement } from '../polymer-3.0-preview/polymer-element.js';


export class FbpPortConnector extends PolymerElement {
	
	static get is() { return 'fbp-port-connector' }

	static get template() {
		let tpl = document.createElement('template');
		tpl.innerHTML = `
			<style>
				:host {
					display: inline-block;
				}
				.dot {
					background: #777;
					cursor: pointer;
					_width: 4px;
					_height: 4px;
					_border-radius: 3px;
					border: 2px solid #777;
					_margin: auto .4em;
				}
				.dot:hover, .dot.selected {
					background: #000;
					border-color: #329B6E;
				}

			</style>
			<div class="dot" on-click="handleClick"></div>
		`;
		return tpl;
	}

	handleClick(e) {
		console.log(e);
	}
}

customElements.define(FbpPortConnector.is, FbpPortConnector);