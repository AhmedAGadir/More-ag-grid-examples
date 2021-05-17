'use strict';

import React, { useState, useEffect, useRef } from 'react';
import { render } from 'react-dom';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import useDebounce from './useDebounce.jsx'

const MyCellRenderer = params => {
  useEffect(() => {
    setTimeout(() => {
      console.log('dispatching cellRendererReady event');
      params.api.dispatchEvent({ type: 'cellRendererReady' });
    }, 500);
  }, []);
  return (
    <span>**{params.value}**</span>
  )
}

const GridExample = () => {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [rowData, setRowData] = useState(null);

  const [renderedCellCount, setRenderedCellCount] = useState(0);

  const cellRendererReadyHandler = useDebounce(renderedCellCount, 1000);

  useEffect(() => {
    if (renderedCellCount > 0) {
      console.log('cell renderers have finished rendering');
    }
  }, [cellRendererReadyHandler])

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);

    const updateData = (data) => {
      setRowData(data);
    };

    fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
      .then((resp) => resp.json())
      .then((data) => updateData(data));

    params.api.addEventListener('cellRendererReady', () => {
      setRenderedCellCount(count => count + 1);
    });
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div
        id="myGrid"
        style={{
          height: '100%',
          width: '100%',
        }}
        className="ag-theme-alpine"
      >
        <AgGridReact
          defaultColDef={{
            flex: 1,
            minWidth: 100,
          }}
          enableRangeSelection={true}
          onGridReady={onGridReady}
          rowData={rowData}
        >
          <AgGridColumn
            field="athlete"
            minWidth={150}
            cellRendererFramework={MyCellRenderer} />
          <AgGridColumn field="age" maxWidth={90} />
          <AgGridColumn field="country" minWidth={150} />
          <AgGridColumn field="year" maxWidth={90} />
          <AgGridColumn field="date" minWidth={150} />
          <AgGridColumn field="sport" minWidth={150} />
          <AgGridColumn field="gold" />
          <AgGridColumn field="silver" />
          <AgGridColumn field="bronze" />
          <AgGridColumn field="total" />
        </AgGridReact>
      </div>
    </div>
  );
};

render(<GridExample></GridExample>, document.querySelector('#root'));
