/**
 * 电路Model
 * 规则和设计：
 * 元件引脚与网格对齐，以便直接“插入”面包板，但模型不一定
 * 连线的起止坐标用网格坐标标记，也就是连线只能连接网格点，连线不强制沿水平或垂直方向
 * TODO: 连线由多段线段组成，必须水平或垂直
*/
const circuitModel = {
    elementSet: {
        'R1': {
            type: 'resistor',
            x: 0,
            y: 0,
            selected: false,
            features: [
                {   
                    name: 'resistance',
                    value: 1.1,
                    unit: 'K om'
                }
            ],
            pins: [
                {
                    id: 'p1',
                    gridPos: {x: 0, y: 0}
                },
                {
                    id: 'p2',
                    gridPos: {x: 0, y: 0}
                }
            ]
        },
        'R2': {
            type: 'resistor',
            x: 4,
            y: 4,
            selected: false,
            features: [
                {   
                    name: 'resistance',
                    value: 2,
                    unit: 'K om'
                }
            ],
            pins: [
                {
                    id: 'p1',
                    gridPos: {x: 0, y: 0}
                },
                {
                    id: 'p2',
                    gridPos: {x: 0, y: 0}
                }
            ]
        },
        'BD1': {
            type: 'breadboard',
            x: 0,
            y: 0,
            selected: false,
            features: [
                {   
                    name: 'columns',
                    value: 20,
                    unit: '1'
                }
            ]
        },
    },
    connection: [
        [{x: 0, y: 0}, {x: 1, y: 1}]
    ]
};

export default circuitModel;