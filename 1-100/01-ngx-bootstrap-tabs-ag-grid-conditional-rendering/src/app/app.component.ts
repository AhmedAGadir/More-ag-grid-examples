import { Component, ViewChild } from "@angular/core";
import { TabsetComponent, TabDirective } from "ngx-bootstrap/tabs";
@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  // disableSwitching: boolean;
  columnApi: any;
  @ViewChild("tabset") tabset: TabsetComponent;
  @ViewChild("first") first: any;
  @ViewChild("second") second: any;

  showGrid: Boolean = false;

  toggleGrid() {
    this.showGrid = !this.showGrid;
    if (!this.showGrid) {
      this.columnApi = null;
    }
  }

  confirmTabSwitch($event) {
    if (this.second.nativeElement.classList.contains("active")) {
      if (this.columnApi && this.showGrid) {
        this.autoSizeCols();
      }
    }
  }

  autoSizeCols() {
    this.columnApi.autoSizeAllColumns();
  }

  columnDefs = [{ field: "make" }, { field: "model" }, { field: "price" }];

  rowData = [
    { make: "Toyota", model: "Celica", price: 35000 },
    { make: "Ford", model: "Mondeo", price: 32000 },
    { make: "Porsche", model: "Boxter", price: 72000 }
  ];

  onFirstDataRendered(params) {
    this.columnApi = params.columnApi;
    this.autoSizeCols();
  }
}
