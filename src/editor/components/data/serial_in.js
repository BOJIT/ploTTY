import { Component } from 'noflo';

export default {
	getComponent: () => {
		const c = new Component({
			name: 'serial in',
			description: 'Get stream of bytes from an open serial port',
			icon: 'plus',
			category: 'data',
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