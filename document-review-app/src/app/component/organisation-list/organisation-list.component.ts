import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ResourceDialogComponent} from "../resource-dialog/resource-dialog.component";
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material";

@Component({
  selector: 'app-organisation-list',
  templateUrl: './organisation-list.component.html',
  styleUrls: ['./organisation-list.component.css']
})
export class OrganisationListComponent implements OnInit {

  @Input() organisations : fhir.Organization[];

  @Output() organisation = new EventEmitter<any>();

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }


}
