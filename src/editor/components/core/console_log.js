export default {
	name: 'console log',
	category: 'core',
	getComponent: (Component) => {
		/* Core component initialisation */
		const c = new Component({
			description: 'Logs packets to browser console',
			icon: 'info',
			inPorts: {
				in: {
					datatype: 'object',
					required: true,
					default: {}
				}
			}
		});

		/* Component processing function */
		c.process((input) => {
			if (!input.hasData('in')) { return; }
			const msg = input.getData('in');
			console.log(msg);
			output.done();
		});

		return c;
	}
}
