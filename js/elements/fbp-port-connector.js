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
				.connector {
					background: #777;
					cursor: pointer;
					width: 5px;
					height: 5px;
					border-radius: 4px;
					_border: 1px solid #777;
					margin: auto 2px;
				}
				.connector:hover, .connector.selected {
					_background: #000;
					margin: auto 0;
					border: 2px solid #999;
				}

			</style>
			<div class="connector"></div>
		`;
		return tpl;
	}
}

customElements.define(FbpPortConnector.is, FbpPortConnector);