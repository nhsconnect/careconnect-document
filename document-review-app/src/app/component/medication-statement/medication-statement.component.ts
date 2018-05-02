import {Component, Input, OnInit} from '@angular/core';
import {LinksService} from "../../service/links.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FhirService} from "../../service/fhir.service";

@Component({
  selector: 'app-medication-statement',
  templateUrl: './medication-statement.component.html',
  styleUrls: ['./medication-statement.component.css']
})
export class MedicationStatementComponent implements OnInit {

  @Input() medicationStatements : fhir.MedicationStatement[];

  @Input() meds : fhir.Medication[] = [];

  selectedMeds : fhir.Medication[];

  constructor(private linksService : LinksService
      ,private modalService: NgbModal
      ,private fhirService : FhirService) { }

  ngOnInit() {

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

  onClick(content , medicationStatement : fhir.MedicationStatement) {
    console.log("Clicked - " + medicationStatement.id);
    this.selectedMeds = [];
    if (this.meds.length> 0) {

      if (medicationStatement.medicationReference != null) {
        console.log("medicationReference - " + medicationStatement.medicationReference.reference);
        for(let medtemp of this.meds) {
          console.log('meds list '+medtemp.id)
          if (medtemp.id == medicationStatement.medicationReference) {
            this.selectedMeds.push(medtemp);
          }
        }
        this.modalService.open(content, {windowClass: 'dark-modal'});
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
            console.log(content);
            this.modalService.open(content, {windowClass: 'dark-modal'});
          }
        );
      }
    }
  }
}
