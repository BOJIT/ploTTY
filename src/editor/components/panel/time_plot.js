export default {
	name: 'time plot',
	category: 'panel',
	getComponent: (Component) => {
		/* Core component initialisation */
		const c = new Component({
			description: 'plots time data',
			icon: 'line-chart',
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
			outPorts: {},
		});

		/* Extra component fields */
		c.name = 'time plot';
		c.category = 'panel';

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
