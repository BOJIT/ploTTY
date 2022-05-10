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

        const cleanup = () => {
            clearInterval(c.timer.interval);
            c.timer.deactivate();
            c.timer = null;
        }

        c.process((input, output, context) => {
            if (input.hasData('enable')) {
                if(input.getData('enable') === true) {
                    // Start timer
                    if(!c.timer) {
                        let count = 0;
                        c.timer = context;
                        c.timer.interval = setInterval(() => {
                            let countstring = "test packet: " + count + "\n";
                            output.send({
                                out: countstring
                            });
                            count++;
                        }, 1000);
                    }
                } else {
                    // stop timer
                    if (!c.timer) {
                        output.done();
                        return;
                    }
                    cleanup();
                    output.done();
                }
            }
        });

        c.tearDown = (callback) => {
            if (c.timer) {
                cleanup();
            }
            callback();
        }

        return c;
    }
}
