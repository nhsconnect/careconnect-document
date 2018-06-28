import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LinksService} from "../../service/links.service";
import {ResourceDialogComponent} from "../../dialog/resource-dialog/resource-dialog.component";
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material";

import {FhirService} from "../../service/fhir.service";
import {EncounterDataSource} from "../../data-source/encounter-data-source";
import {LocationDialogComponent} from "../../dialog/location-dialog/location-dialog.component";
import {OrganisationDialogComponent} from "../../dialog/organisation-dialog/organisation-dialog.component";
import {PractitionerDialogComponent} from "../../dialog/practitioner-dialog/practitioner-dialog.component";
import {BundleService} from "../../service/bundle.service";

@Component({
  selector: 'app-encounter',
  templateUrl: './encounter.component.html',
  styleUrls: ['./encounter.component.css']
})
export class EncounterComponent implements OnInit {

  @Input() encounters : fhir.Encounter[];

  locations : fhir.Location[];

  @Input() showDetail : boolean = false;

  @Input() patient : fhir.Patient;

  @Output() encounter = new EventEmitter<any>();

  selectedEncounter : fhir.Encounter;

  @Input() patientId : string;

  dataSource : EncounterDataSource;

  displayedColumns = ['start','end', 'type','typelink','provider','providerLink','participant','participantLink', 'locationLink','resource'];

  constructor(private linksService : LinksService,
    public bundleService : BundleService,
    public dialog: MatDialog,
    public fhirService : FhirService) { }

  ngOnInit() {
    if (this.patientId != undefined) {
      this.dataSource = new EncounterDataSource(this.fhirService, this.patientId, []);
    } else {
      this.dataSource = new EncounterDataSource(this.fhirService, undefined, this.encounters);
    }
  }
  getCodeSystem(system : string) : string {
    return this.linksService.getCodeSystem(system);
  }

  isSNOMED(system: string) : boolean {
    return this.linksService.isSNOMED(system);
  }


  getSNOMEDLink(code : fhir.Coding) {
    if (this.linksService.isSNOMED(code.system)) {
      window.open(this.linksService.getSNOMEDLink(code), "_blank");
    }
  }

  showLocation(encounter) {


    this.locations = [];
    for (let reference of encounter.location) {
      console.log(reference.location.reference);
      this.bundleService.getResource(reference.location.reference).subscribe(
        (resource) => {

          if (resource != undefined && resource.resourceType === "Location") {
            console.log("Location " + reference.location.reference);
            this.locations.push(<fhir.Location> resource);
          }
        }
      );

      }

      const dialogConfig = new MatDialogConfig();

      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = {
        id: 1,
        locations: this.locations
      };
      let resourceDialog: MatDialogRef<LocationDialogComponent> = this.dialog.open(LocationDialogComponent, dialogConfig);

  }

  showOrganisation(encounter) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      id: 1,
      organisations : encounter
    };
    let resourceDialog : MatDialogRef<OrganisationDialogComponent> = this.dialog.open( OrganisationDialogComponent, dialogConfig);
  }

  showPractitioner(encounter) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      id: 1,
      practitioners: encounter
    };
    let resourceDialog : MatDialogRef<PractitionerDialogComponent> = this.dialog.open( PractitionerDialogComponent, dialogConfig);
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
