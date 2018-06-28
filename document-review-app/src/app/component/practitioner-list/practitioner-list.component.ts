import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ResourceDialogComponent} from "../../dialog/resource-dialog/resource-dialog.component";
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material";

@Component({
  selector: 'app-practitioner-list',
  templateUrl: './practitioner-list.component.html',
  styleUrls: ['./practitioner-list.component.css']
})
export class PractitionerListComponent implements OnInit {

  @Input() practitioners : fhir.Practitioner[];

  @Output() practitioner = new EventEmitter<any>();

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }
/*
  select(resource) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      id: 1,
      resource: resource
    };
    let resourceDialog : MatDialogRef<ResourceDialogComponent> = this.dialog.open( ResourceDialogComponent, dialogConfig);
  }
  */
}
