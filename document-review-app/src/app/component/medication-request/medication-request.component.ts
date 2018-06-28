import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LinksService} from "../../service/links.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FhirService} from "../../service/fhir.service";
import {ResourceDialogComponent} from "../../dialog/resource-dialog/resource-dialog.component";
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material";
import {MedicationStatementDataSource} from "../../data-source/medication-statement-data-source";
import {MedicationRequestDataSource} from "../../data-source/medication-request-data-source";
import {BundleService} from "../../service/bundle.service";

@Component({
  selector: 'app-medication-request',
  templateUrl: './medication-request.component.html',
  styleUrls: ['./medication-request.component.css']
})
export class MedicationRequestComponent implements OnInit {

  @Input() medicationRequests : fhir.MedicationRequest[];

  @Input() showDetail : boolean = false;

  meds : fhir.Medication[];

  @Output() medicationRequest = new EventEmitter<any>();

  @Input() patientId : string;

  dataSource : MedicationRequestDataSource;

  displayedColumns = ['medication', 'medicationlink','status','dose','route','routelink','form', 'authored', 'status', 'resource'];


  constructor(private linksService : LinksService,
              private modalService: NgbModal,
              private fhirService : FhirService,
              private bundleService : BundleService,
              public dialog: MatDialog) { }

  ngOnInit() {
    if (this.patientId != undefined) {
      this.dataSource = new MedicationRequestDataSource(this.fhirService, this.patientId, []);
    } else {
      this.dataSource = new MedicationRequestDataSource(this.fhirService, undefined, this.medicationRequests);
    }
  }
  isSNOMED(system: string) : boolean {
    return this.linksService.isSNOMED(system);
  }
  getCodeSystem(system : string) : string {
    return this.linksService.getCodeSystem(system);
  }

  getDMDLink(code : fhir.Coding) {
    window.open(this.linksService.getDMDLink(code), "_blank");
  }
  getSNOMEDLink(code : fhir.Coding) {
    window.open(this.linksService.getSNOMEDLink(code), "_blank");

  }

  onClick(content , medicationRequest : fhir.MedicationRequest) {
    console.log("Clicked - " + medicationRequest.id);
    this.meds = [];

    let reference = medicationRequest.medicationReference.reference;
    console.log(reference);
    let refArray: string[] = reference.split('/');
    if (refArray.length>1) {
      this.fhirService.getEPRMedication(refArray[refArray.length-1]).subscribe(data => {
          if (data != undefined) {
            this.meds.push(<fhir.Medication>data);
          }
        },
        error1 => {
        },
        () => {
        console.log("Content = ");
          console.log(content);
          this.modalService.open(content, {windowClass: 'dark-modal'});
        }
      );
    }
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
