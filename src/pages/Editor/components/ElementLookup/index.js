import React, { useState, useEffect, createContext, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import { useSelector } from 'react-redux';

// Style
import elementLookupStyle from './ElementLookup.module.css';

// Antd Components
import { Table } from 'antd';

function ElementLookup(props) {
    const { selectedList, circuit: {elementSet} } = useSelector(state => state.editor);

    const { Column } = Table;

    const data = [];
    // Object.keys(elementSet).forEach((item, index) => {
    //     data.push({
    //         id: item,
    //         type: elementSet[item].type
    //     });
    // });

    return (
        <div>
            <Table dataSource={data} size='small' pagination={false}>
                <Column title='Type' dataIndex='type' ellipsis />
                <Column className={elementLookupStyle.column} title='ID' dataIndex='id' ellipsis />
            </Table>
        </div>
    );
}

export default ElementLookup;