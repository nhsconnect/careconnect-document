import {Component, Input, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material";
import {ResourceDialogComponent} from "../../dialog/resource-dialog/resource-dialog.component";
import {OrganisationDataSource} from "../../data-source/organisation-data-source";
import {PractitionerDataSource} from "../../data-source/practitioner-data-source";
import {FhirService} from "../../service/fhir.service";

@Component({
  selector: 'app-practitioner',
  templateUrl: './practitioner.component.html',
  styleUrls: ['./practitioner.component.css']
})
export class PractitionerComponent implements OnInit {

  @Input() practitioners : fhir.Practitioner[];

  @Input() showResourceLink : boolean = true;

  constructor(public dialog: MatDialog,
              public fhirService : FhirService) { }

  dataSource : PractitionerDataSource;

  displayedColumns = ['practitioner', 'identifier', 'contact', 'resource'];
  ngOnInit() {
    this.dataSource = new PractitionerDataSource(this.fhirService,  this.practitioners);
  }

  getLastName(practitioner : fhir.Practitioner) : String {
    if (practitioner == undefined) return "";
    if (practitioner.name == undefined || practitioner.name.length == 0)
      return "";

    let name = "";
    if (practitioner.name[0].family != undefined) name += practitioner.name[0].family.toUpperCase();
    return name;

  }
  getIdentifier(identifier : fhir.Identifier) : String {
    let name : String = identifier.system
    if (identifier.system == 'https://fhir.nhs.uk/Id/sds-user-id') {
      name = 'SDS User Id';
    } else {identifier.system == 'https://fhir.nhs.uk/Id/local-practitioner-identifier'} {
      name = 'Local Id';
    }
    return name;
  }
  getFirstName(practitioner : fhir.Practitioner) : String {
    if (practitioner == undefined) return "";
    if (practitioner.name == undefined || practitioner.name.length == 0)
      return "";
    // Move to address
    let name = "";
    if (practitioner.name[0].given != undefined && practitioner.name[0].given.length>0) name += ", "+ practitioner.name[0].given[0];

    if (practitioner.name[0].prefix != undefined && practitioner.name[0].prefix.length>0) name += " (" + practitioner.name[0].prefix[0] +")" ;
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
