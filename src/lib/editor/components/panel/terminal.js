import panels from "src/svelte/store/panels";

export default {
    name: 'terminal',
    category: 'panel',
    panel: 'Terminal',
    getComponent: (Component) => {
        /* Core component initialisation */
        const c = new Component({
            description: 'outputs data to a terminal',
            icon: 'terminal',
            inPorts: {
                data: {
                    datatype: 'string',
                    required: true,
                },
                clear: {
                    datatype: 'bang'
                },
            },
            outPorts: {},
        });
        
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
