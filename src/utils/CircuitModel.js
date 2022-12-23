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
            features: [
                {   
                    name: 'resistance',
                    value: 1.1,
                    unit: 'K om'
                },
                {
                    name: 'tolerance',
                    value: '1%'
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
                },
                {
                    name: 'tolerance',
                    value: '1%'
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
                    value: 10,
                    unit: '1'
                },
                {
                    name: 'tolerance',
                    value: '1%'
                }
            ]
        },
        'w1': {
            type: 'wire',
            x: 0,
            y: 0,
            features: [
                {
                    name: 'x1',
                    value: 0
                },
                {
                    name: 'y1',
                    value: 0
                },
                {
                    name: 'x2',
                    value: 1
                },
                {
                    name: 'y2',
                    value: 2
                }
            ]
        }
    },
    connection: []
};

export default circuitModel;