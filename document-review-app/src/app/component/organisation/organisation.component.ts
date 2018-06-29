import {Component, Input, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material";
import {ResourceDialogComponent} from "../../dialog/resource-dialog/resource-dialog.component";

import {OrganisationDataSource} from "../../data-source/organisation-data-source";
import {FhirService} from "../../service/fhir.service";

@Component({
  selector: 'app-organisation',
  templateUrl: './organisation.component.html',
  styleUrls: ['./organisation.component.css']
})
export class OrganisationComponent implements OnInit {

  @Input() organisations : fhir.Organization[];

  @Input() showResourceLink : boolean = true;

  dataSource : OrganisationDataSource;

  displayedColumns = ['organisation', 'identifier', 'contact', 'resource'];

  constructor(public dialog: MatDialog,
              public fhirService : FhirService) { }

  ngOnInit() {
    this.dataSource = new OrganisationDataSource(this.fhirService,  this.organisations);
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
