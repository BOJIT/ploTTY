import panels from "src/svelte/store/panels";

export default {
	name: 'time plot',
	category: 'panel',
	panel: 'PlotterTime',
	getComponent: (Component) => {
		/* Core component initialisation */
		const c = new Component({
			description: 'plots time data',
			icon: 'line-chart',
			inPorts: {
				data: {
					datatype: 'object',
					required: true,
				},
				options: {
					datatype: 'object',
					required: true,
				},
			},
			outPorts: {},
		});

		/* Extra component fields */
		c.name = 'time plot';
		c.category = 'panel';

		/* Component processing function */
		c.process((input) => {
			if(input.hasData('data')) {
				panels.panelUpdate({
					id: c.nodeId,
					port: 'data',
					data: input.getData('data')
				});
			}
		});

		return c;
	}
}
