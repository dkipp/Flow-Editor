import { Element as PolymerElement } from './polymer-3.0-preview/polymer-element.js';

import {FbpEditorCanvas} from './elements/fbp-editor-canvas.js';
import {FbpNode} from './elements/fbp-node.js';
import {FbpInputPort} from './elements/fbp-input-port.js';
import {FbpOutputPort} from './elements/fbp-output-port.js';
import {FbpPortConnector} from './elements/fbp-port-connector.js';
import {FbpConnection} from './elements/fbp-connection.js';

// Create a class for the element
window.customElements.define('fbp-graph', class extends HTMLElement {

	static get tpl() {
		return "dsfgdsf";
  }
	
	constructor() {
		super();
		this._bindEvents();
		this._dnd = {};
	}

	_bindEvents() {
		this.addEventListener('dragstart', this._onDragStart.bind(this), false);
		this.addEventListener('dragend', this._onDragEnd.bind(this), false);
	}

	_onDragStart(e) {
		console.log('_onDragStart', e);
		this._dnd.target = e.target;
		this._dnd.offsetX = this.offsetLeft - this.scrollLeft + this.clientLeft + e.offsetX;
		this._dnd.offsetY = this.offsetTop - this.scrollTop + this.clientTop + e.offsetY;
		this._dnd.pageX = e.pageX;
		this._dnd.pageY = e.pageY;
		this._dnd.clientX = e.clientX;
		this._dnd.clientY = e.clientY;
	}

	_onDragEnd(e) {
		console.log('_onDragEnd', e);
		this._dnd.target.style.top = (e.clientY - this._dnd.offsetY) + "px";
		this._dnd.target.style.left = (e.clientX - this._dnd.offsetX ) + "px";
	}

	connectedCallback () {
		//this.myShadowRoot.appendChild(this.template);
	}

});

window.customElements.define('fbp-oldnode', class extends HTMLElement {

	constructor() {
		super();
		this.myShadowRoot = this.attachShadow({mode: 'open'});

		let tmpl = document.createElement('template');
		tmpl.innerHTML = `
		  <style>:host .label { text-align:center; margin-bottom:.3em }</style>
		  <div class="label">Sum</div>
		  <slot></slot>
		`;
		this.myShadowRoot.appendChild(tmpl.content.cloneNode(true));
	}

	static get observedAttributes() { return ['id']; }

	_bindEvents() {
		//this.addEventListener('dragstart', this._onDragStart.bind(this), false);
		//this.addEventListener('dragend', this._onDragEnd.bind(this), false);
		//this.addEventListener('fbp-input-update', this._onInputValueChanged.bind(this), false);
	}

	_onInputValueChanged(e) {
		this.process();
	}

	process() {
		let i1 = this.get('in1') || 0;
		let i2 = this.get('in2') || 0;

		console.log('sum:', i1 + i2);
	}

	get(name) {
		let e = this.querySelector(`fbp-input[label="${name}"]`);
		console.log(e);
		return e.value || null;
	}


	connectedCallback () {
		this.style.top = ( Math.random() * (600 - 10) + 10) + "px";
		this.style.left = ( Math.random() * (800 - 10) + 10) + "px";

		console.log( this.tpl );
	}

});

window.customElements.define('fbp-input', class extends HTMLElement {

	constructor() {
		super();
		this.data = {};
	}

	//static get observedAttributes() { return ['value']; }

	set value(val) {
		this.data.value = val;
		let event = new CustomEvent('fbp-input-update', { detail: val, bubbles: true });
		this.dispatchEvent(event);
	}

	get value() {
		return this.data.value || 0;
	}

});

window.customElements.define('fbp-output', class extends HTMLElement {
	//static get observedAttributes() { return ['value']; }

	set value(val) {
		let event = new CustomEvent('fbp-output-update', { detail: val, bubbles: true });
		this.dispatchEvent(event);
	}
});






/*

set out(val) {
		if (val) {
			this.setAttribute('out', val);
		} else {
			this.removeAttribute('out');
		}
	}

*/