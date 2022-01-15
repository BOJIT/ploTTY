export default {
	name: 'serial in',
	category: 'data',
	getComponent: (Component) => {
		/* Core component initialisation */
		const c = new Component({
			description: 'Gets a stream of bytes from a Serial port',
			icon: 'plug',
			inPorts: {
				enable: {
					datatype: 'boolean',
					default: true,
					enum: [
						true,
						false
					]
				},
				port: {
					datatype: 'string',
					default: 'none',
					enum: () => {
						return [
							'COM1',
							'COM2'
						];
					}
				},
				baud: {
					datatype: 'number',
					default: 9600,
					enum: [
						9600,
						1200,
						2400,
						4800,
						19200,
						38400,
						57600,
						115200
					]
				}
			},
			outPorts: {
				out: {
					datatype: 'object',
				},
			},
			autoOrdering: false
		});

		// TODO what is component context?

		c.process((input, output, context) => {

		});


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
