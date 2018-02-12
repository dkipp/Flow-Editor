// Create a class for the element
window.customElements.define('x-product', class extends HTMLElement {

	static get observedAttributes() { return ['name', 'img', 'url', 'objdata']; }


	constructor() {
		super();	// Always call super first in constructor
	}

	// Called every time the element is inserted into the DOM. Useful for running setup code, such as fetching resources or rendering. Generally, you should try to delay work until this time.
	connectedCallback() {
		console.log("connectedCallback");
		this.renderMe();
	}

	//Called every time the element is removed from the DOM. Useful for running clean up code.
	disconnectedCallback() {
		console.log("disconnectedCallback");
	}

	//Called when an observed attribute has been added, removed, updated, or replaced. Also called for initial values when an element is created by the parser, or upgraded. Note: only attributes listed in the observedAttributes property will receive this callback. 
	attributeChangedCallback(attrName, oldVal, newVal) {
		console.log("attributeChangedCallback");

		if(attrName == 'objdata'){
			console.log(newVal);
		}
	}


	renderMe() {
		// Create a standard img element and set its attributes.
		var img = document.createElement('img');
		img.alt = this.getAttribute('name');
		img.src = this.getAttribute('img');
		img.width = '150';
		img.height = '150';
		img.className = 'product-img';

		// Add the image to the custom element.
		this.appendChild(img);

		// Add an event listener to the image.
		img.addEventListener('click', () => {
			window.location = this.getAttribute('url');
		});

		// Create a link to the product.
		var link = document.createElement('a');
		link.innerText = this.getAttribute('name');
		link.href = this.getAttribute('url');
		link.className = 'product-name';

		// Add the link to the custom element.
		this.appendChild(link);
	}

});
