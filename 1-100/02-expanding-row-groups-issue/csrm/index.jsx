'use strict';

import React, { useState } from 'react';
import { render } from 'react-dom';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

const GridExample = () => {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [rowData, setRowData] = useState(null);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);

    const updateData = (data) => {
      setRowData(data);
    };

    fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
      .then((resp) => resp.json())
      .then((data) => updateData(data.slice(0, 100)));
  };

  function expandAll() {
    gridApi.forEachNode((node) => {
      if (node.group) {
        let id = node.id;
        console.log('node id', id);
        try {
          let retrievedNode = gridApi.getRowNode(id);
          console.log('expanding retrieved node');
          retrievedNode.setExpanded(true);
        } catch (err) {
          console.error(
            'could not retrieve node through gridApi.getRowNode',
            err
          );
        }
      }
    });
  }

  return (
    <div>
      <button onClick={expandAll}>Expand all groups</button>
      <div style={{ width: '100%', height: '100vh' }}>
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
            autoGroupColumnDef={{
              minWidth: 200,
            }}
            enableRangeSelection={true}
            onGridReady={onGridReady}
            rowData={rowData}
          >
            <AgGridColumn field="athlete" minWidth={150} />
            <AgGridColumn field="age" maxWidth={90} />
            <AgGridColumn field="country" minWidth={150} rowGroup />
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
    </div>
  );
};

render(<GridExample></GridExample>, document.querySelector('#root'));
