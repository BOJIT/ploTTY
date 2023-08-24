export default {
    "key": "Dual Serial",
    "metadata": {
        "version": "ed0f6e5",
        "exportDate": "2023-08-24T18:41:47.897Z"
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
            "input-1": {
                "component": "data/serial in",
                "metadata": {
                    "position": {
                        "x": -624.3388291835518,
                        "y": -36.813779265161486
                    },
                    "portConfig": {
                        "enable": {
                            "mode": "enum",
                            "chosenEnumeration": true
                        },
                        "port": {
                            "mode": "enum"
                        },
                        "baud": {
                            "mode": "enum",
                            "chosenEnumeration": 115200
                        }
                    },
                    "label": "input-1"
                }
            },
            "terminal": {
                "component": "widgets/terminal",
                "metadata": {
                    "position": {
                        "x": -110.16941459177593,
                        "y": 39.46144029691743
                    },
                    "portConfig": {
                        "data": {
                            "mode": "input"
                        },
                        "clear": {
                            "mode": "enum",
                            "chosenEnumeration": false
                        },
                        "echo": {
                            "mode": "enum",
                            "chosenEnumeration": false
                        }
                    }
                }
            },
            "input-2": {
                "component": "data/serial in",
                "metadata": {
                    "position": {
                        "x": -624.1694145917759,
                        "y": 105.3126415395497
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
                    },
                    "label": "input-2"
                }
            },
            "join": {
                "component": "core/join",
                "metadata": {
                    "position": {
                        "x": -460.2541218876638,
                        "y": -37.132380906946025
                    },
                    "portConfig": {
                        "in": {
                            "mode": "input"
                        },
                        "condition": {
                            "mode": "enum",
                            "chosenEnumeration": "newline"
                        },
                        "datatype": {
                            "mode": "enum",
                            "chosenEnumeration": "string"
                        }
                    }
                }
            },
            "join1": {
                "component": "core/join",
                "metadata": {
                    "position": {
                        "x": -460.2541218876638,
                        "y": 98.86761909305397
                    },
                    "portConfig": {
                        "in": {
                            "mode": "input"
                        },
                        "condition": {
                            "mode": "enum",
                            "chosenEnumeration": "newline"
                        },
                        "datatype": {
                            "mode": "enum",
                            "chosenEnumeration": "string"
                        }
                    }
                }
            },
            "text-colour": {
                "component": "core/text-colour",
                "metadata": {
                    "position": {
                        "x": -311.45933193301477,
                        "y": 99.41664465516956
                    },
                    "portConfig": {
                        "in": {
                            "mode": "input"
                        },
                        "colour": {
                            "mode": "enum",
                            "chosenEnumeration": "Yellow"
                        },
                        "mode": {
                            "mode": "enum",
                            "chosenEnumeration": "foreground"
                        }
                    }
                }
            }
        },
        "connections": [
            {
                "src": {
                    "process": "input-1",
                    "port": "out"
                },
                "tgt": {
                    "process": "join",
                    "port": "in"
                }
            },
            {
                "src": {
                    "process": "input-2",
                    "port": "out"
                },
                "tgt": {
                    "process": "join1",
                    "port": "in"
                }
            },
            {
                "src": {
                    "process": "text-colour",
                    "port": "out"
                },
                "tgt": {
                    "process": "terminal",
                    "port": "data"
                }
            },
            {
                "src": {
                    "process": "join1",
                    "port": "out"
                },
                "tgt": {
                    "process": "text-colour",
                    "port": "in"
                }
            },
            {
                "src": {
                    "process": "join",
                    "port": "out"
                },
                "tgt": {
                    "process": "terminal",
                    "port": "data"
                }
            }
        ]
    }
}
