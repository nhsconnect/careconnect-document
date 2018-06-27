import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LinksService} from "../../service/links.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ResourceDialogComponent} from "../resource-dialog/resource-dialog.component";
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material";
import {ConditionDataSource} from "../../data-source/condition-data-source";
import {FhirService} from "../../service/fhir.service";
import {EncounterDataSource} from "../../data-source/encounter-data-source";

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

  displayedColumns = ['start','end', 'type','typelink','provider','participant', 'resource'];

  constructor(private linksService : LinksService
    , private modalService: NgbModal
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
  onClick(content ,encounter : fhir.Encounter) {
    this.selectedEncounter = encounter;
    this.modalService.open(content,{ windowClass: 'dark-modal' });
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
