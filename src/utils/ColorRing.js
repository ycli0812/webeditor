const colorRing = {
    black: '#000000',
    brown: '#9A3403',
    red: '#FA0001',
    orange: '#FF6501',
    yellow: '#FEFD02',
    green: '#028002',
    blue: '#0700FB',
    purple: '#85017B',
    grey: '#808080',
    white: '#FFFFFF',
    gloden: '#FDCC05',
    silver: '#C1C1C1'
};

function resistanceColor(r) {
    switch(r) {
        case 0: return colorRing.black;
        case 1: return colorRing.brown;
        case 2: return colorRing.red;
        case 3: return colorRing.orange;
        case 4: return colorRing.yellow;
        case 5: return colorRing.green;
        case 6: return colorRing.blue;
        case 7: return colorRing.purple;
        case 8: return colorRing.grey;
        case 9: return colorRing.white;
        default: return 'transparent';
    }
}

function timesColor(t) {
    switch(t) {
        case 1: return colorRing.black;
        case 10: return colorRing.brown;
        case 100: return colorRing.red;
        case 1000: return colorRing.orange;
        case 10000: return colorRing.yellow;
        case 100000: return colorRing.green;
        case 1000000: return colorRing.blue;
        case 10000000: return colorRing.purple;
        case 0.1: return colorRing.gloden;
        case 0.01: return colorRing.silver;
        default: return 'transparent';
    }
}

function toleranceColor(tol) {
    switch(tol) {
        case '1%': return colorRing.brown;
        case '2%': return colorRing.red;
        case '0.5%': return colorRing.green;
        case '0.25%': return colorRing.blue;
        case '0.1%': return colorRing.purple;
        case '0.05%': return colorRing.grey;
        case '5%': return colorRing.gloden;
        case '10%': return colorRing.silver;
        default: return 'transparent';
    }
}

function computeColorRing(resistance, unit, tolerance) {
    // 乘上单位，计算实际电阻值
    switch(unit) {
        case 'kom': {
            resistance *= 1000;
            break;
        }
        case 'mom': {
            resistance *= 1000000;
            break;
        }
        default: break;
    }
    // 计算乘数
    let times = 1;
    if(resistance > 999) {
        while(resistance / times > 999) times *= 10;
    }
    if(resistance < 1) {
        if(resistance / 0.01 < 999) times = 0.01;
        else times = 0.1;
    }
    // 获取三位
    const handred = Math.floor(resistance / times / 100);
    const ten = Math.floor(resistance / times % 100 / 10);
    const one = Math.floor(resistance / times % 10);
    return [
        resistanceColor(handred),
        resistanceColor(ten),
        resistanceColor(one),
        timesColor(times),
        toleranceColor(tolerance)
    ];
}

export default computeColorRing;