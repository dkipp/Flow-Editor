import { Element as PolymerElement } from '../polymer-3.0-preview/polymer-element.js';


export class FbpEditorCanvas extends PolymerElement {
	
	static get is() { return 'fbp-editor-canvas' }

	constructor() {
		super();
		this.ddOffset = [];
	}

	static get template() {
		let tpl = document.createElement('template');
		tpl.innerHTML = `
			<style>
				:host {
					display: block;
					position: relative;
					background: #292929;
					height: 800px;
					width: 1000px;
					font-family: monospace;
					color: #FFF;

					display: flex;
				}

				.test {
				}
			</style>
			<div id="nodes" on-dragstart="_handleDragstart" on-dragend="_handleDragend">
				<slot name="connections"></slot>
				<slot name="nodes"></slot>
			</div>
		`;

		return tpl;
	}

	getNodes() {
		return this.querySelectorAll('fbp-node');
	}

	getNodeById(id="") {
		return this.querySelector('fbp-node#'+id);
	}

	getRandomNode() {
		let n = this.getNodes();
		let max = n.length;

		if(max > 0){
			let i = Math.floor( Math.random() * max );
			return n.item( i );
		}

		return null;
	}

	getRandomInputPort() {
		let p = this.querySelectorAll('fbp-input-port');

		if(p.length > 0){
			let i = Math.floor( Math.random() * p.length );
			return p.item( i );
		}

		return null;
	}

	getRandomOutputPort() {
		let p = this.querySelectorAll('fbp-output-port');

		if(p.length > 0){
			let i = Math.floor( Math.random() * p.length );
			return p.item( i );
		}
		
		return null;
	}

	connectedCallback(e) {
		super.connectedCallback();
		
		// bind events
		this.addEventListener('dragover', this._handleDragover, false);
	}

	_handleDragstart(e) {
		let style = window.getComputedStyle(e.target, null);
		this.ddOffset[0] = (parseInt(style.getPropertyValue("left"),10) - e.clientX);
		this.ddOffset[1] = (parseInt(style.getPropertyValue("top"),10) - e.clientY);
	}

	_handleDragend(e) {
		e.target.style.left = (e.clientX + this.ddOffset[0]) + 'px';
		e.target.style.top = (e.clientY + this.ddOffset[1]) + 'px';
		e.target._computeXY();
		e.preventDefault();
		return false;
	}

	_handleDragover(e) {
		//console.log('handleDragover', e);
		e.preventDefault();
		return false;
	}

	
}

customElements.define(FbpEditorCanvas.is, FbpEditorCanvas);