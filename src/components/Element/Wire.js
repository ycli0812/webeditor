import React, { useState, useEffect, createContext, useContext } from 'react';
import ReactDOM from 'react-dom/client';

function Wire(props) {
    const {
        x1,
        y1,
        x2,
        y2,
        zoom
    } = props;

    const gridSize = zoom * 5;

    return (
        <g>
            <line x1={x1 * gridSize} y1={y1 * gridSize} x2={x2 * gridSize} y2={y2 * gridSize} stroke='#000000' strokeWidth={4}></line>
        </g>
    );
}

export default Wire;