import { Component } from 'noflo';

export default {
	getComponent: () => {
		/* Core component initialisation */
		const c = new Component({
			description: 'Gets a stream of bytes from a Serial port',
			icon: 'plug',
			inPorts: {},
			outPorts: {
				sum: {
					datatype: 'number',
				},
			},
		});

		/* Extra component fields */
		c.name = 'serial in';
		c.category = 'data';

		/* Component processing function */
		c.process((input, output) => {
			if (!input.hasData('augend', 'addend')) { return; }
			const [augend, addend] = input.getData('augend', 'addend');
			output.sendDone({
			sum: Number(augend) + Number(addend),
			});
		});

		return c;
	}
}