import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import { useSelector, useDispatch } from 'react-redux';

function Breadboard(props) {
    // destruct props
    const { id } = props;

    // use hooks
    const { x, y } = useSelector(state => state.editor.elementSet[id]);
    const getValue = useFeatureValueGetter(id);
    const getUnit = useFeatureUnitGetter(id);
    const getPinPos = usePinPositionGetter(id);

    const cols = getValue('column');
    const extended = getValue('extended');
    const holes = [];
    const sides = [];
    const holeSize = zoom * 3;
    for (let b = 0; b < 2; b++) {
        for (let m = 0; m < 5; m++) {
            for (let n = 0; n < cols; n++) {
                holes.push(
                    <rect
                        key={cols * 5 * b + m * cols + n}
                        id={'svg_' + m * n}
                        height={holeSize}
                        width={holeSize}
                        y={pixelY + gridSize - holeSize / 2 + b * 6 * gridSize + m * gridSize}
                        x={pixelX + gridSize - holeSize / 2 + n * gridSize}
                        stroke='#000'
                        fill='#777777' />
                );
            }
        }
    }
    if (extended) {
        for (let m = 0; m < 2; m++) {
            for (let n = 0; n < cols; n++) {
                sides.push(
                    <rect
                        key={m * cols + n}
                        id={'svg_' + m * n}
                        height={holeSize}
                        width={holeSize}
                        y={pixelY + gridSize * 13 - holeSize / 2 + m * gridSize}
                        x={pixelX + gridSize - holeSize / 2 + n * gridSize}
                        stroke='#000'
                        fill='#777777' />
                );
            }
        }
        for (let m = 0; m < 2; m++) {
            for (let n = 0; n < cols; n++) {
                sides.push(
                    <rect
                        key={m * cols + n + cols * 2}
                        id={'svg_' + m * n}
                        height={holeSize}
                        width={holeSize}
                        y={pixelY - gridSize * 2 - holeSize / 2 + m * gridSize}
                        x={pixelX + gridSize - holeSize / 2 + n * gridSize}
                        stroke='#000'
                        fill='#777777' />
                );
            }
        }
    }
}