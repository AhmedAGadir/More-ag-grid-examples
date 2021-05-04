'use strict';

import React, { useState } from 'react';
import { render } from 'react-dom';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css';

const GridExample = () => {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);

    const updateData = (data) => {
      var fakeServer = new FakeServer(data);
      var datasource = new ServerSideDatasource(fakeServer);
      params.api.setServerSideDatasource(datasource);
    };

    fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
      .then((resp) => resp.json())
      .then((data) => updateData(data));
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
    <div style={{ width: '100%', height: '100vh' }}>
      <button onClick={expandAll}>Expand all groups</button>
      <div
        id="myGrid"
        style={{
          height: '100%',
          width: '100%',
        }}
        className="ag-theme-alpine-dark"
      >
        <AgGridReact
          defaultColDef={{
            flex: 1,
            minWidth: 120,
            resizable: true,
            sortable: true,
          }}
          autoGroupColumnDef={{
            flex: 1,
            minWidth: 280,
            field: 'athlete',
          }}
          rowModelType={'serverSide'}
          serverSideStoreType={'partial'}
          suppressAggFuncInHeader={true}
          cacheBlockSize={5}
          animateRows={true}
          onGridReady={onGridReady}
        >
          <AgGridColumn
            colId="country"
            valueGetter="data.country"
            rowGroup={true}
            hide={true}
          />
          <AgGridColumn field="sport" rowGroup={true} hide={true} />
          <AgGridColumn field="year" minWidth={100} />
          <AgGridColumn field="gold" aggFunc="sum" />
          <AgGridColumn field="silver" aggFunc="sum" />
          <AgGridColumn field="bronze" aggFunc="sum" />
        </AgGridReact>
      </div>
    </div>
  );
};

function ServerSideDatasource(server) {
  return {
    getRows: function (params) {
      // console.log('[Datasource] - rows requested by grid: ', params.request);
      var response = server.getData(params.request);
      setTimeout(function () {
        if (response.success) {
          params.success({
            rowData: response.rows,
            rowCount: response.lastRow,
          });
        } else {
          params.fail();
        }
      }, 1000);
    },
  };
}

render(<GridExample></GridExample>, document.querySelector('#root'));
