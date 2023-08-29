export default {
    "key": "Example Patch",
    "metadata": {
        "version": "4065a7b",
        "exportDate": "2023-08-24T18:45:08.956Z"
    },
    "graph": {
        "caseSensitive": false,
        "properties": {
            "name": ""
        },
        "inports": {},
        "outports": {},
        "groups": [],
        "processes": {
            "example-input": {
                "component": "data/serial in",
                "metadata": {
                    "position": {
                        "x": 365.11054099827743,
                        "y": 342.1262101292176
                    },
                    "portConfig": {
                        "enable": {
                            "mode": "enum",
                            "chosenEnumeration": true
                        },
                        "port": {
                            "mode": "input"
                        },
                        "baud": {
                            "mode": "enum",
                            "chosenEnumeration": 115200
                        }
                    }
                }
            },
            "example-output": {
                "component": "core/console log",
                "metadata": {
                    "position": {
                        "x": 686.5552704991387,
                        "y": 253.29493494281166
                    },
                    "portConfig": {
                        "in": {
                            "mode": "input"
                        }
                    }
                }
            }
        },
        "connections": [
            {
                "src": {
                    "process": "example-input",
                    "port": "out"
                },
                "tgt": {
                    "process": "example-output",
                    "port": "in"
                }
            }
        ]
    }
}
