import { Component } from 'noflo';

export default {
	getComponent: () => {
		const c = new Component({
			name: 'time plot',
			description: 'plots an input against time on a graph',
			icon: 'plus',
			category: 'panel',
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

		return c.process((input, output) => {
			if (!input.hasData('augend', 'addend')) { return; }
			const [augend, addend] = input.getData('augend', 'addend');
			output.sendDone({
			sum: Number(augend) + Number(addend),
			});
		});
	}
}