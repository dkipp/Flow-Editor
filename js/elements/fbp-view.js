import { Element as PolymerElement } from '../polymer-3.0-preview/polymer-element.js';


export class FbpView extends PolymerElement {
	
	static get is() { return 'fbp-view' }

	static get template() {
		let tmpl = document.createElement('template');
		tmpl.innerHTML = `
			<style>:host {
				display: block;
			}
			.test {
				position: relative;
				background: #BBB;
			}
			</style>
			<b class="test">I'm in shadow dom!</b>
			<slot></slot>
		`;

		return tmpl;
	}
}

customElements.define('fbp-view', FbpView);