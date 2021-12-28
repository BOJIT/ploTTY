/* This file contains a sample user component */

export default {
	getComponent: (Component) => {
		/* Core component initialisation */
		const c = new Component({
			description: 'Component description',
			icon: 'cog',
			inPorts: {
				augend: {
					datatype: 'number',
					required: true,
				},
				addend: {
					datatype: 'number',
					required: true,
					control: true,
				},
			},
			outPorts: {
				sum: {
					datatype: 'number',
				},
			},
		});

		/* Extra component fields */
		c.name = 'example';
		c.category = 'user';

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