import { noflo } from 'noflo';

export default {
	getComponent: () => {
		/* Core component initialisation */
		const c = new noflo.Component({
			description: 'filters based on an input string',
			icon: 'plus',
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
		c.name = 'filter';
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