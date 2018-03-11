import {Component, Input, OnInit} from '@angular/core';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-document-section',
  templateUrl: './view-document-section.component.html',
  styleUrls: ['./view-document-section.component.css']
})
export class ViewDocumentSectionComponent implements OnInit {

  @Input() section : fhir.CompositionSection;

  @Input() document : fhir.Bundle;

  structuredText : string;

  entries : any[];


  constructor(private modalService: NgbModal

  ) { }

  ngOnInit() {
    this.entries = [];
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

  getReferencedItem(reference : string) : string {
    let structuredText = "";

    for (let resource of this.document.entry) {
      if (resource.fullUrl === reference) {

        switch(resource.resource.resourceType) {
          case "AllergyIntolerance" :
            let allergyIntolerance: fhir.AllergyIntolerance = <fhir.AllergyIntolerance> resource.resource;
            if (allergyIntolerance.code != null && allergyIntolerance.code.coding.length > 0) {
              this.entries.push( { "resource" : "AllergyIntolerance"
                , "code" : allergyIntolerance.code.coding[0].code
                , "display" : allergyIntolerance.code.coding[0].display});
            } else {
              this.entries.push( { "resource" : "AllergyIntolerance"});
            }
            break;
          case "Condition" :
            let condition: fhir.Condition = <fhir.Condition> resource.resource;
            this.entries.push( { "resource" : "Condition"
              , "code" : condition.code.coding[0].code

              , "display" : condition.code.coding[0].display});
            break;
          case "Encounter" :
            let encounter: fhir.Encounter = <fhir.Encounter> resource.resource;
            if (encounter.type != undefined && encounter.type[0].coding != null) {
              this.entries.push({
                "resource": "Encounter",
                "code": encounter.type[0].coding[0].code
                , "display" : encounter.type[0].coding[0].display
              });
            }
            break;
          case "List" :
            let list: fhir.List = <fhir.List> resource.resource;
            if (list.entry != undefined) {
              this.entries.push({
                "resource": "List"
                , "display" : "Entries "+list.entry.length
              });

              for (let entry of list.entry) {
                if (entry.item != undefined && entry.item.reference != undefined) this.getReferencedItem(entry.item.reference);
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
            if (medicationRequest.medicationCodeableConcept != undefined) structuredText += " MedicationRequest "+this.getSNOMEDLink(medicationRequest.medicationCodeableConcept.coding[0].code);
            break;
          case "MedicationStatement" :
            let medicationStatement :fhir.MedicationStatement = <fhir.MedicationStatement> resource.resource;
            if (medicationStatement.medicationReference != undefined) {
              this.entries.push({
                "resource": "MedicationStatement",
                "display" : "Medication Reference"
              });

              this.getReferencedItem(medicationStatement.medicationReference.reference);
            }
            if (medicationStatement.medicationCodeableConcept != undefined) structuredText += " MedicationStatement "+this.getSNOMEDLink(medicationStatement.medicationCodeableConcept.coding[0].code);
            break;
          case "Observation" :
            let observation :fhir.Observation = <fhir.Observation> resource.resource;
            this.entries.push({
              "resource": "Observation",
              "code": observation.code.coding[0],"link": this.getSNOMEDLink(observation.code.coding[0].code)
              , "display" : observation.code.coding[0].display
            });

            break;
          case "Procedure" :
            let procedure :fhir.Procedure = <fhir.Procedure> resource.resource;
            this.entries.push({
              "resource": "Procedure",
              "code": procedure.code.coding[0].code,
              "link": this.getSNOMEDLink(procedure.code.coding[0].code)
              , "display" : procedure.code.coding[0].display
            });

            break;
        }
      }
    }
    return structuredText;
  }

  getSNOMEDLink(code : string) {
    return "https://termbrowser.nhs.uk/?perspective=full&conceptId1="+code+"&edition=uk-edition&release=v20171001";
  }



}
