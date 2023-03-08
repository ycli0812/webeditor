import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import ReactDOM from 'react-dom/client';

// Style
import dynamicGridStyle from './DynamicGrid.module.css';

// Constant
const handlerSpace = 2;

function SlideHandler(props) {
    const {
        onMouseDown,
        direction,
        sliding
    } = props;

    useEffect(() => {
        if(sliding) {
            if(direction === 'vertical') {
                document.body.style.cursor = 'ns-resize';
            }
            if(direction === 'horizontal') {
                document.body.style.cursor = 'ew-resize';
            }
        } else {
            document.body.style.cursor = 'default';
        }
    }, [sliding]);

    const handlerStyle = {
        height: direction === 'vertical' ? handlerSpace : 'auto',
        width: direction === 'horizontal' ? handlerSpace : 'auto',
        cursor: direction === 'vertical' ? 'ns-resize' : 'ew-resize',
        zIndex: 'calc(inherit + 10)'
    };

    const decorStyle = {
        height: direction === 'vertical' ? 4 : '100%',
        width: direction === 'horizontal' ? 4 : '100%',
        position: 'absolute',
        // top: direction === 'vertical' ? 2 : 0,
        // left: direction === 'horizontal' ? 2 : 0,
        top: 0,
        left: 0,
        borderTop: direction === 'vertical' ? '1px solid #E0E0E0' : 'none',
        // borderBottom: direction === 'vertical' ? '1px solid #DDDDDD' : 'none',
        borderLeft: direction === 'horizontal' ? '1px solid #E0E0E0' : 'none',
        // borderRight: direction === 'horizontal' ? '1px solid #DDDDDD' : 'none'
        backgroundColor: sliding ? '#0090F1' : 'transparent',
        zIndex: '50'
    };

    return (
        <div
            className={dynamicGridStyle.handler}
            onMouseDown={onMouseDown}
            style={handlerStyle}>
            <div className={dynamicGridStyle.handlerHover} style={decorStyle}></div>
        </div>
    );
}

function Grid(props) {
    const {
        children,
        direction,
        space = 'auto',
    } = props;

    const gridRef = useRef(null);

    const style = {
        height: direction == 'vertical' ? space : 'auto',
        width: direction == 'horizontal' ? space : 'auto'
    }

    return (
        <div
            className={dynamicGridStyle.grid}
            ref={gridRef}
            style={style}>
            {children}
        </div>
    );
}

function DynamicGrid(props) {
    const {
        direction,
        template,
        children,
        style
    } = props;

    const [countChild, setCountChild] = useState(children.length === undefined ? 1 : children.length);
    const [layout, setLayout] = useState(new Array(countChild));
    const [avaliableSpace, setAvaliableSpace] = useState(0);
    const [sliding, setSliding] = useState(-1);
    // const [startX, setStartX] = useState(-1);
    // const [startY, setStartY] = useState(-1);

    const containerRef = useRef(null);

    useEffect(() => {
        // const { x, y } = containerRef.current.getBoundingClientRect();
        const totalSpace = direction === 'vertical' ? containerRef.current.clientHeight : containerRef.current.clientWidth;
        setAvaliableSpace(totalSpace - (countChild - 1) * handlerSpace);
        // setStartX(x + window.scrollX);
        // setStartY(y + window.scrollY);
    }, []);

    useEffect(() => {
        const newLayout = [];
        for (let i = 0; i < countChild; i++) {
            newLayout.push(avaliableSpace / countChild);
        }
        setLayout(newLayout);
    }, [avaliableSpace]);

    const content = [];
    if (children.length !== undefined) {
        children.forEach((item, index) => {
            content.push(
                <Grid key={index} direction={direction} space={layout[index]}>{item}</Grid>
            );
            if (index < countChild - 1) {
                content.push(
                    <SlideHandler
                        direction={direction}
                        onMouseDown={(ev) => handleMouseDown(ev, index)}
                        key={'handler' + index}
                        sliding={sliding === index}
                    />
                );
            }
        });
    } else {
        content.push(
            <Grid direction={direction} space={layout[0]} key={0}>{children}</Grid>
        );
    }

    function handleMouseMove(ev) {
        const newLayout = [...layout];
        if (sliding !== -1) {
            const { movementX, movementY } = ev;
            if (direction === 'vertical') {
                newLayout[sliding] += movementY;
                newLayout[sliding + 1] -= movementY;
                if (newLayout[sliding] >= 200 && newLayout[sliding + 1] >= 200) setLayout(newLayout);
                return;
            }
            if (direction === 'horizontal') {
                newLayout[sliding] += movementX;
                newLayout[sliding + 1] -= movementX;
                if (newLayout[sliding] >= 200 && newLayout[sliding + 1] >= 200) setLayout(newLayout);
                return;
            }
        }
    }

    function handleMouseDown(ev, index) {
        ev.preventDefault();
        console.log('mouse down on handler after grid', index, ev);
        setSliding(index);
    }

    function clearSliding(ev) {
        console.log('clear sliding')
        setSliding(-1);
    }

    const displayStyle = {
        flexDirection: direction === 'vertical' ? 'column' : 'row',
        height: '100%',
        width: '100%'
    };

    return (
        <div
            className={dynamicGridStyle.grids}
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseUp={clearSliding}
            onMouseLeave={clearSliding}
            style={displayStyle}
        >
            {content}
        </div>
    );
}

export default DynamicGrid;