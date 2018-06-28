import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LinksService} from "../../service/links.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FhirService} from "../../service/fhir.service";
import {ResourceDialogComponent} from "../../dialog/resource-dialog/resource-dialog.component";
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material";
import {ProcedureDataSource} from "../../data-source/procedure-data-source";
import {MedicationStatementDataSource} from "../../data-source/medication-statement-data-source";
import {MedicationDialogComponent} from "../../dialog/medication-dialog/medication-dialog.component";

@Component({
  selector: 'app-medication-statement',
  templateUrl: './medication-statement.component.html',
  styleUrls: ['./medication-statement.component.css']
})
export class MedicationStatementComponent implements OnInit {

  @Input() medicationStatements : fhir.MedicationStatement[];

  @Input() meds : fhir.Medication[] = [];

  @Output() medicationStatement = new EventEmitter<any>();

  @Input() patientId : string;

  dataSource : MedicationStatementDataSource;

  displayedColumns = ['medication', 'medicationlink','status','dose','route','routelink','form', 'asserted', 'resource'];


  selectedMeds : fhir.Medication[];

  constructor(private linksService : LinksService
      ,private modalService: NgbModal
      ,private fhirService : FhirService,
              public dialog: MatDialog) { }

  ngOnInit() {
    if (this.patientId != undefined) {
      this.dataSource = new MedicationStatementDataSource(this.fhirService, this.patientId, []);
    } else {
      this.dataSource = new MedicationStatementDataSource(this.fhirService, undefined, this.medicationStatements);
    }
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
  isSNOMED(system: string) : boolean {
    return this.linksService.isSNOMED(system);
  }

  onClick(medicationStatement : fhir.MedicationStatement) {


    console.log("Clicked - " + medicationStatement.id);
    this.selectedMeds = [];

    if (this.meds.length> 0) {

      if (medicationStatement.medicationReference != null) {
        console.log("medicationReference - " + medicationStatement.medicationReference.reference);
        for(let medtemp of this.meds) {
          console.log('meds list '+medtemp.id)
          if (medtemp.id == medicationStatement.medicationReference.reference) {
            this.selectedMeds.push(medtemp);
          }
        }
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
          id: 1,
          medications: this.selectedMeds
        };
        let resourceDialog : MatDialogRef<MedicationDialogComponent> = this.dialog.open( MedicationDialogComponent, dialogConfig);
      }
    } else {
      let reference = medicationStatement.medicationReference.reference;
      console.log(reference);
      let refArray: string[] = reference.split('/');
      if (refArray.length>1) {
        this.fhirService.getEPRMedication(refArray[refArray.length - 1]).subscribe(data => {
            if (data != undefined) {
              this.meds.push(<fhir.Medication>data);
              this.selectedMeds.push(<fhir.Medication>data);
            }
          },
          error1 => {
          },
          () => {
            console.log("Content = ");
            const dialogConfig = new MatDialogConfig();

            dialogConfig.disableClose = true;
            dialogConfig.autoFocus = true;
            dialogConfig.data = {
              id: 1,
              medications: this.selectedMeds
            };
            let resourceDialog : MatDialogRef<MedicationDialogComponent> = this.dialog.open( MedicationDialogComponent, dialogConfig);
          }
        );
      }
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
