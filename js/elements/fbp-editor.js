import { Element as PolymerElement } from '../polymer-3.0-preview/polymer-element.js';

export class FbpEditor extends PolymerElement {
	static get template() {
		return `
			<h1>Hello FbpNode!</h1>
		`;
	}
}

customElements.define('fbp-editor', FbpNode);