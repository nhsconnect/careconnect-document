import {Component, Input, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material";
import {ResourceDialogComponent} from "../resource-dialog/resource-dialog.component";

@Component({
  selector: 'app-organisation',
  templateUrl: './organisation.component.html',
  styleUrls: ['./organisation.component.css']
})
export class OrganisationComponent implements OnInit {

  @Input() organisation : fhir.Organization;

  @Input() detail : boolean;

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  getIdentifier(identifier : fhir.Identifier) : String {
    let name : String = identifier.system
    if (identifier.system.indexOf('ods-organization-code') != -1) {

      name = 'ODS Code';
    }
    return name;
  }
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

}
