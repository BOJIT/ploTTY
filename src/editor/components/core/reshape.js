import { Component } from 'noflo';

export default {
	getComponent: () => {
		/* Core component initialisation */
		const c = new Component({
			description: 'reshapes a data packet',
			icon: 'shapes',
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
		c.name = 'reshape';
		c.category = 'core';

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