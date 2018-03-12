import {Component, Input, OnInit} from '@angular/core';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {isNumber} from "util";

@Component({
  selector: 'app-view-document-section',
  templateUrl: './view-document-section.component.html',
  styleUrls: ['./view-document-section.component.css']
})
export class ViewDocumentSectionComponent implements OnInit {

  @Input() section : fhir.CompositionSection;

  @Input() document : fhir.Bundle;


  entries : any[];

  medicationStatements : fhir.MedicationStatement[];
  conditions : fhir.Condition[];
  procedures : fhir.Procedure[];
  observations : fhir.Observation[];
  allergies : fhir.AllergyIntolerance[];
  encounters : fhir.Encounter[];


  constructor(private modalService: NgbModal

  ) { }

  ngOnInit() {
    this.entries = [];
    this.medicationStatements =[];
    this.conditions=[];
    this.procedures=[];
    this.observations=[];
    this.encounters=[];
    this.allergies=[];

    this.getPopover(this.section);

  }


  getPopover(section : fhir.CompositionSection)  {


    if (section.entry != undefined) {
      for (let entry  of section.entry) {
        this.getReferencedItem(entry.reference);
      }
    }
  }

  open(content) {
    this.modalService.open(content, { windowClass: 'dark-modal' });
  }

  getReferencedItem(reference : string)  {

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
                  console.log(entry.item.reference);
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
            if (medication.code != undefined) {
              this.entries.push({
                "resource": "Medication",
                "code": medication.code.coding[0].code,

                "display" : medication.code.coding[0].display
              });
            }
            break;
          case "MedicationRequest" :
            let medicationRequest :fhir.MedicationRequest = <fhir.MedicationRequest> resource.resource;
            if (medicationRequest.medicationReference != undefined) {
              this.entries.push({
                "resource": "MedicationRequest",
                 "display" : "Medication Reference"
              });
             this.getReferencedItem(medicationRequest.medicationReference.reference);
            }
            if (medicationRequest.medicationCodeableConcept != undefined) {
              this.entries.push({
                "resource": "MedicationRequest",
                "code" : medicationRequest.medicationCodeableConcept.coding[0].code,
                "display" : medicationRequest.medicationCodeableConcept.coding[0].display
              });
             // structuredText += " MedicationRequest " + this.getSNOMEDLink(medicationRequest.medicationCodeableConcept.coding[0].code);
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
          default : this.entries.push({
            "resource": resource.resource.resourceType

          });
        }
      }
    }

  }

  isSNOMED(code: string) : boolean {
    if (code == undefined) return false;
    if (!((+code).toString() === code)) {
      //console.log("Not a number = "+code);
      return false;
    }
    if (code.length<6) return false;
    return true;

  }

  getDMDLink(code : string) {
    return "http://dmd.medicines.org.uk/DesktopDefault.aspx?VMP="+code+"&toc=nofloat";
  }
  getSNOMEDLink(code : string) {
    return "https://termbrowser.nhs.uk/?perspective=full&conceptId1="+code+"&edition=uk-edition&release=v20171001";
  }



}
