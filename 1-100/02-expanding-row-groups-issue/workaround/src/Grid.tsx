import React from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import "ag-grid-enterprise";
import { GridReadyEvent, GridApi, ColumnApi, ColDef } from "ag-grid-community";
import { fetchData, fetchLargeData, Athlete } from "./api";

const columnDefs: ColDef[] = [
  {
    headerName: "ID",
    field: "id",
    width: 70,
    enableRowGroup: true
    // cellRenderer: "loadingRenderer"
  },
  {
    headerName: "Athlete",
    field: "athlete",
    width: 150,
    editable: true,
    enableRowGroup: true
  },
  {
    headerName: "Age",
    field: "age",
    width: 90,
    editable: true
  },
  {
    headerName: "Country",
    rowGroup: true,
    field: "country",
    width: 120
  },
  {
    headerName: "Year",
    field: "year",
    width: 90
  },
  {
    headerName: "Date",
    field: "date",
    width: 110
  },
  {
    headerName: "Sport",
    field: "sport",
    width: 110
  },
  {
    headerName: "Gold",
    field: "gold",
    width: 100
  },
  {
    headerName: "Silver",
    field: "silver",
    width: 100
  },
  {
    headerName: "Bronze",
    field: "bronze",
    width: 100
  },
  {
    headerName: "Total",
    field: "total",
    width: 100
  }
];

type AgGridApi = {
  grid?: GridApi;
  column?: ColumnApi;
};

function Grid() {
  const [rowData, setRowData] = React.useState<Athlete[]>([]);
  const [rowGroupPanelShow, setRowGroupPanelShow] = React.useState("always");
  const apiRef = React.useRef<AgGridApi>({
    grid: undefined,
    column: undefined
  });
  const onGridReady = (params: GridReadyEvent) => {
    apiRef.current.grid = params.api;
    apiRef.current.column = params.columnApi;
  };

  React.useEffect(() => {
    fetchData().then((data) => {
      setRowData(data);
    });
  }, []);

  const showRowGroupPanel = () => {
    const el = document.querySelector(`#myTableId .ag-column-drop-wrapper`);
    el.style.display = "";
  };
  const hideRowGroupPanel = () => {
    const el = document.querySelector(`#myTableId .ag-column-drop-wrapper`);
    el.style.display = "none";
  };

  console.log(rowGroupPanelShow);

  return (
    <div style={{ height: "80vh" }}>
      <button
        onClick={() => {
          apiRef.current.grid?.forEachNode((node) => {
            if (node.id === "row-group-1") {
              node.setExpanded(true);
            }
          });
        }}
      >
        Expand Russia
      </button>
      <div
        style={{ height: "100%", width: "100%" }}
        className="ag-theme-balham"
        id="myTableId"
      >
        <AgGridReact
          rowData={rowData}
          suppressRowClickSelection
          columnDefs={columnDefs}
          rowGroupPanelShow={rowGroupPanelShow}
          onRowGroupOpened={(params) => {
            console.log("onRowGroupOpened", params.node.id); //returning row-group-5
          }}
          autoGroupColumnDef={{ minWidth: 200 }}
          defaultColDef={{
            autoHeight: true,
            cellClass: "cell-wrap-text",
            enableRowGroup: true
          }}
          onGridReady={onGridReady}
          components={{
            loadingRenderer: (params) => {
              if (params.value !== undefined) {
                return params.value;
              } else {
                return '<img src="https://raw.githubusercontent.com/ag-grid/ag-grid/master/grid-packages/ag-grid-docs/src/images/loading.gif">';
              }
            }
          }}
        />
      </div>
    </div>
  );
}

export default Grid;
