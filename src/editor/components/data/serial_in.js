export default {
	name: 'serial in',
	category: 'data',
	getComponent: (Component) => {
		/* Core component initialisation */
		const c = new Component({
			description: 'Gets a stream of bytes from a Serial port',
			icon: 'plug',
			inPorts: {},
			outPorts: {
				out: {
					datatype: 'object',
				},
			},
			autoOrdering: false
		});

		// TODO what is component context?

		c.setUp = (callback) => {
			c.timer = setInterval(() => {
				console.log("Serial Out");
			}, 2000);
			callback();
		}

		c.tearDown = (callback) => {
			if (c.timer) {
				clearInterval(c.timer);
			}
			callback();
		}

		return c;
	}
}
