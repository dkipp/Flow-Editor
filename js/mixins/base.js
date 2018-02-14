export const FbpBaseMixin = (superClass) => class extends superClass {

	constructor() {
		super();
		this.id = this.uuidv4();
	}

	static get properties() {
		return {
			id: {
				type: String,
				reflectToAttribute: true
			}
		};
	}



	uuidv4() {
		return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
			(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
		);
	}

	static rgb2YIQ(r, g, b) {
		return ((r*299)+(g*587)+(b*114))/1000;
	}
}