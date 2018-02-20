import { Element as PolymerElement } from '../polymer-3.0-preview/polymer-element.js';
import {FbpBaseMixin} from '../mixins/base.js';

export class FbpPort extends FbpBaseMixin(PolymerElement) {
	
	static get is() { return 'fbp-port' }

	// Declare properties for the element's public API
	static get properties() {
		return {
			label: {
				type: String,
				value: "in",
				reflectToAttribute: true
			},
			connected: {
				type: Boolean,
				value: false,
				notify: true,
				readOnly: true,
				reflectToAttribute: true
			},

			/*
				'' Only One
				'+' Minimum One
				'*' Zero or More
				'?' Zero or One
			*/
			rule: {
				type: String,
				value: '?',
				reflectToAttribute: true
			},
			valid: {
				type: Boolean,
				value: false,
				computed: '_conmputeValid(connected, rule)'
			}
		}
	}

	constructor(options) {
		super();
		this.label = (options && options.label) || 'label';
	}

	connections() {
		return this.editorCanvas().connectionsByPortID(this.id);
	}

	stupidMethodName() {
		// set read-only property
		this._setConnected( this.connections().length > 0 );
	}

	_conmputeValid(connected, rule) {
		console.log('_conmputeValid');
		return true;
	}


}

customElements.define(FbpPort.is, FbpPort);