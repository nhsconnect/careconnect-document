import {Component, Input, OnInit} from '@angular/core';
import {LinksService} from "../../service/links.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FhirService} from "../../service/fhir.service";

@Component({
  selector: 'app-medication-request',
  templateUrl: './medication-request.component.html',
  styleUrls: ['./medication-request.component.css']
})
export class MedicationRequestComponent implements OnInit {

  @Input() medicationRequests : fhir.MedicationRequest[];

  @Input() showDetail : boolean = false;

  @Input() meds : fhir.Medication[];

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
}
