import {Component, Input, OnInit} from '@angular/core';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {isNumber} from "util";
import {LinksService} from "../../service/links.service";
import {PatientEprService} from "../../service/patient-epr.service";
import {MatDialog} from "@angular/material";

@Component({
  selector: 'app-view-document-section',
  templateUrl: './view-document-section.component.html',
  styleUrls: ['./view-document-section.component.css']
})
export class ViewDocumentSectionComponent implements OnInit {

  @Input() section : fhir.CompositionSection;

  @Input() document : fhir.Bundle;


  // Reference for modal size https://stackoverflow.com/questions/46977398/ng-bootstrap-modal-size
  resource = undefined;

  entries : any[];

  medicationStatements : fhir.MedicationStatement[];
  prescriptions : fhir.MedicationRequest[];
  medications : fhir.Medication[];
  conditions : fhir.Condition[];
  procedures : fhir.Procedure[];
  observations : fhir.Observation[];
  allergies : fhir.AllergyIntolerance[];
  encounters : fhir.Encounter[];
  patients : fhir.Patient[];
  practitioners : fhir.Practitioner[];
  organisations : fhir.Organization[];

  showStructured : boolean = false;

  constructor(private modalService: NgbModal
              ,public dialog: MatDialog
      , private linksService : LinksService
      ,public patientEPRService : PatientEprService
  ) { }

  ngOnInit() {
    this.entries = [];
    this.medicationStatements =[];
    this.prescriptions =[];
    this.medications=[];
    this.conditions=[];
    this.procedures=[];
    this.observations=[];
    this.encounters=[];
    this.allergies=[];
    this.patients=[];
    this.practitioners=[];
    this.organisations=[];
    this.getPopover(this.section);

  }


  getPopover(section : fhir.CompositionSection)  {


    if (section.entry != undefined) {
      for (let entry  of section.entry) {
        this.getReferencedItem(entry.reference);
      }
    }
  }

  open() {
    this.showStructured = !this.showStructured;
  }

  getReferencedItem(reference : string)  {
    //console.log("In getReferenced and medications count = "+this.medications.length);
    for (let resource of this.document.entry) {
      if (resource.fullUrl === reference || resource.resource.id === reference ) {

        switch(resource.resource.resourceType) {
          case "AllergyIntolerance" :
            let allergyIntolerance: fhir.AllergyIntolerance = <fhir.AllergyIntolerance> resource.resource;
            this.allergies.push(allergyIntolerance);
            break;
          case "Condition" :
            let condition: fhir.Condition = <fhir.Condition> resource.resource;
            this.conditions.push(condition);

            break;
          case "Encounter" :
            let encounter: fhir.Encounter = <fhir.Encounter> resource.resource;
            this.encounters.push(encounter);
            break;
          case "List" :
            let list: fhir.List = <fhir.List> resource.resource;
            if (list.entry != undefined) {
              if (list.code != undefined && list.code.coding.length > 0) {
                this.entries.push({
                  "resource": "List"
                  , "code" : list.code.coding[0].code
                  , "display" : "Entries "+list.entry.length
                });
              } else {
                this.entries.push({
                  "resource": "List"
                  , "display" : "Entries "+list.entry.length
                });
              }

              for (let entry of list.entry) {

                if (entry.item != undefined && entry.item.reference != undefined) {
                 // console.log(entry.item.reference);
                  this.getReferencedItem(entry.item.reference);
                }
                else {
                  this.entries.push({
                    "resource": "Error"
                    , "display" : "Missing Reference"
                  });
                }
              }
            }
            break;
          case "Medication" :
            let medication :fhir.Medication = <fhir.Medication> resource.resource;
            medication.id = resource.fullUrl;

              this.medications.push(medication);

            break;
          case "MedicationRequest" :
            let medicationRequest :fhir.MedicationRequest = <fhir.MedicationRequest> resource.resource;
            this.prescriptions.push(medicationRequest);
            if (medicationRequest.medicationReference != undefined) {
             this.getReferencedItem(medicationRequest.medicationReference.reference);
            }

            break;
          case "MedicationStatement" :
            let medicationStatement :fhir.MedicationStatement = <fhir.MedicationStatement> resource.resource;
            this.medicationStatements.push(medicationStatement);
            if (medicationStatement.medicationReference != undefined) {
              this.getReferencedItem(medicationStatement.medicationReference.reference);
            }
            break;
          case "Observation" :
            let observation :fhir.Observation = <fhir.Observation> resource.resource;
            this.observations.push(observation);
            break;
          case "Procedure" :
            let procedure :fhir.Procedure = <fhir.Procedure> resource.resource;
            this.procedures.push(procedure)
            break;
          case "Patient" :
            let patient :fhir.Patient = <fhir.Patient> resource.resource;
            this.patients.push(patient);
            break;
          case "Practitioner":
            let practitioner : fhir.Practitioner = <fhir.Practitioner> resource.resource;
            this.practitioners.push(practitioner);
            break;
          case "Organization":
            let organization : fhir.Organization = <fhir.Organization> resource.resource;
            this.organisations.push(organization);
            break;
          default : this.entries.push({
            "resource": resource.resource.resourceType

          });
        }
      }
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

  onResoureSelected(event ) {
    this.resource = event;
    this.patientEPRService.setResource(event);
  }

}
