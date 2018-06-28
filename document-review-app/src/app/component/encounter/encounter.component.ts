import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LinksService} from "../../service/links.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ResourceDialogComponent} from "../../dialog/resource-dialog/resource-dialog.component";
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material";
import {ConditionDataSource} from "../../data-source/condition-data-source";
import {FhirService} from "../../service/fhir.service";
import {EncounterDataSource} from "../../data-source/encounter-data-source";
import {LocationDialogComponent} from "../../dialog/location-dialog/location-dialog.component";
import {OrganisationDialogComponent} from "../../dialog/organisation-dialog/organisation-dialog.component";
import {PractitionerDialogComponent} from "../../dialog/practitioner-dialog/practitioner-dialog.component";

@Component({
  selector: 'app-encounter',
  templateUrl: './encounter.component.html',
  styleUrls: ['./encounter.component.css']
})
export class EncounterComponent implements OnInit {

  @Input() encounters : fhir.Encounter[];

  @Input() showDetail : boolean = false;

  @Input() patient : fhir.Patient;

  @Output() encounter = new EventEmitter<any>();

  selectedEncounter : fhir.Encounter;

  @Input() patientId : string;

  dataSource : EncounterDataSource;

  displayedColumns = ['start','end', 'type','typelink','provider','providerLink','participant','participantLink', 'locationLink','resource'];

  constructor(private linksService : LinksService
   // , private modalService: NgbModal
    , public dialog: MatDialog
    , public fhirService : FhirService) { }

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

  showLocation(reference) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      id: 1,
      locations: reference
    };
    let resourceDialog : MatDialogRef<LocationDialogComponent> = this.dialog.open( LocationDialogComponent, dialogConfig);
  }

  showOrganisation(reference) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      id: 1,
      organisations : reference
    };
    let resourceDialog : MatDialogRef<OrganisationDialogComponent> = this.dialog.open( OrganisationDialogComponent, dialogConfig);
  }

  showPractitioner(reference) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      id: 1,
      practitioners: reference
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
