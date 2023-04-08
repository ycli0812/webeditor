import React, { useState, useEffect, createContext, useContext, useRef, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import { DynamicGridProps } from './DynamicGrid';

// Style
import dynamicGridStyle from './DynamicGrid.module.css';

// Constant
const handlerSpace = 2;

function SlideHandler(props: any) {
    const {
        onMouseDown,
        direction,
        sliding
    } = props;

    useEffect(() => {
        if (sliding) {
            if (direction === 'vertical') {
                document.body.style.cursor = 'ns-resize';
            }
            if (direction === 'horizontal') {
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

    const decorStyle: React.CSSProperties = {
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

function Grid(props: any) {
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

function DynamicGrid(props: DynamicGridProps) {
    const {
        direction = 'vertical',
        cells = null,
        style = {},
        children,
        onChange = (layout: number[]) => { }
    } = props;

    const [countChild, setCountChild] = useState<number>(children.length === undefined ? 1 : children.length);
    const [layout, setLayout] = useState<number[]>(new Array(countChild));
    const [avaliableSpace, setAvaliableSpace] = useState<number>(0);
    const [sliding, setSliding] = useState<number>(-1);
    const [initSpacePre, setInitSpacePre] = useState<number>(0);
    const [initSpaceNxt, setInitSpaceNxt] = useState<number>(0);
    const [mouseDownPos, setMouseDownPos] = useState<number>(0);

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const totalSpace: any | number = direction === 'vertical' ? containerRef.current?.clientHeight : containerRef.current?.clientWidth;
        setAvaliableSpace(totalSpace - (countChild - 1) * handlerSpace);
    }, []);

    useEffect(() => {
        const newLayout: number[] = [];
        for (let i = 0; i < countChild; i++) {
            newLayout.push(avaliableSpace / countChild);
        }
        setLayout(newLayout);
    }, [avaliableSpace]);

    const content: React.ReactNode[] = [];
    // TODO if cells property is provided, ignore children, else use cells as grids
    
    if (children.length !== undefined) {
        children.forEach((item: React.ReactNode, index: number) => {
            content.push(
                <Grid key={index} direction={direction} space={layout[index]}>{item}</Grid>
            );
            if (index < countChild - 1) {
                content.push(
                    <SlideHandler
                        direction={direction}
                        onMouseDown={(ev: React.MouseEvent) => handleMouseDown(ev, index)}
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

    function handleMouseMove(ev: React.MouseEvent) {
        if (sliding !== -1) {
            const newLayout = [...layout];
            const { clientX, clientY } = ev;
            if (direction === 'vertical') {
                newLayout[sliding] = (initSpacePre + (clientY + window.scrollY - mouseDownPos));
                newLayout[sliding + 1] = (initSpaceNxt - (clientY + window.scrollY - mouseDownPos));
                if (newLayout[sliding] >= 20 && newLayout[sliding + 1] >= 20) setLayout(newLayout);
            }
            if (direction === 'horizontal') {
                newLayout[sliding] = (initSpacePre + (clientX + window.scrollX - mouseDownPos));
                newLayout[sliding + 1] = (initSpaceNxt - (clientX + window.scrollX - mouseDownPos));
                if (newLayout[sliding] >= 20 && newLayout[sliding + 1] >= 20) setLayout(newLayout);
            }
            onChange(newLayout);
        }
    }

    function handleMouseDown(ev: React.MouseEvent, index: number) {
        ev.preventDefault();
        const { clientX, clientY } = ev;
        if (direction === 'vertical') {
            setMouseDownPos(clientY + window.scrollY);
        } else {
            setMouseDownPos(clientX + window.scrollX);
        }
        setInitSpacePre(layout[index]);
        setInitSpaceNxt(layout[index + 1]);
        setSliding(index);
    }

    function clearSliding(ev: React.MouseEvent) {
        setSliding(-1);
    }

    const displayStyle: React.CSSProperties = {
        flexDirection: direction === 'vertical' ? 'column' : 'row',
    };

    return (
        <div
            className={dynamicGridStyle.grids}
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseUp={clearSliding}
            onMouseLeave={clearSliding}
            style={{ ...style, ...displayStyle }}
        >
            {content}
        </div>
    );
}

export default DynamicGrid;