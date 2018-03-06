import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FhirService} from "../../service/fhir.service";

@Component({
  selector: 'app-view-document',
  templateUrl: './view-document.component.html',
  styleUrls: ['./view-document.component.css']
})
export class ViewDocumentComponent implements OnInit {

  @Input() document : fhir.Bundle;
  @Input() systemType : string;

  constructor(private route: ActivatedRoute
  , private fhirService : FhirService ) { }

  ngOnInit() {


    if (this.systemType != "EPR") {
      let id = this.route.snapshot.paramMap.get('docid');
      this.getDocument(id);
    } else {
      if (this.document!=null) {
        this.getComposition();
      }
    }
  }


  composition : fhir.Composition = undefined;
  patient : fhir.Patient = undefined;
  sections : fhir.CompositionSection[] = [];
  docId : string;

  getDocument(id : string): void {

    this.docId = id;


    this.fhirService.getCompositionDocument(id).subscribe( document => {
      this.document = document;
    }, err=>{},
      ()=> {
        this.getComposition();
      }

      );
  }

  getPopover(section : fhir.CompositionSection) : string {
    let structuredText=""
    if (section.entry != undefined) {
      let count = section.entry.length;
      for (let entry  of section.entry) {
        structuredText = structuredText + '<br>';
        for (let resource of this.document.entry) {
          if (resource.fullUrl === entry.reference) {
            //structuredText = structuredText + resource.resource.resourceType;
            switch(resource.resource.resourceType) {
              case "AllergyIntolerance" :
                let allergyIntolerance :fhir.AllergyIntolerance = <fhir.AllergyIntolerance> resource.resource;
                structuredText += " SNOMED "+allergyIntolerance.code.coding[0].code;
                break;
              case "Condition" :
                let condition :fhir.Condition = <fhir.Condition> resource.resource;
                structuredText += " SNOMED "+condition.code.coding[0].code;
                break;
              case "Encounter" :
                let encounter :fhir.Encounter = <fhir.Encounter> resource.resource;
                structuredText += " SNOMED "+encounter.type[0].coding[0].code;
                break;
              case "MedicationRequest" :
                let medicationRequest :fhir.MedicationRequest = <fhir.MedicationRequest> resource.resource;
                structuredText += " Reference "+medicationRequest.medicationReference.reference;
                break;
              case "MedicationStatement" :
                let medicationStatement :fhir.MedicationStatement = <fhir.MedicationStatement> resource.resource;
                structuredText += " Reference "+medicationStatement.medicationReference.reference;
                break;
              case "Observation" :
                let observation :fhir.Observation = <fhir.Observation> resource.resource;
                structuredText += " SNOMED "+observation.code.coding[0].code;
                break;
              case "Procedure" :
                let procedure :fhir.Procedure = <fhir.Procedure> resource.resource;
                structuredText += " SNOMED "+procedure.code.coding[0].code;
                break;
            }
          }
        }
      }
      return "This section has referenced "+count+" items." +structuredText;
    }
    return "No entries referenced.";
  }

  getComposition() {
    for (let entry of this.document.entry) {
      if (entry.resource.resourceType === "Composition") {
        this.composition = <fhir.Composition>entry.resource;
        for (let section of this.composition.section) {
          this.sections.push(section);
        }
      } else if (entry.resource.resourceType === "Patient") {
        this.patient = <fhir.Patient> entry.resource;
      }
    }
  }

  downloadPDF() {
    console.log("Download PDF");

    let thefile = {};
    this.fhirService.getCompositionDocumentPDF(this.docId)
      .subscribe(data => {

        thefile = new Blob([data], {type: "application/pdf"});
          },
          error => {
            console.log("Error downloading the file." ,error);
          },
        () => {

          let a = window.document.createElement("a");
          a.href = window.URL.createObjectURL(thefile);
          a.download = "composition.pdf";
          document.body.appendChild(a);
          a.click();  // IE: "Access is denied"; see: https://connect.microsoft.com/IE/feedback/details/797361/ie-10-treats-blob-url-as-cross-origin-and-denies-access
          document.body.removeChild(a);
          }
        );



  }
  downloadHTML() {
    console.log("Download HTML");

    let thefile = {};
    this.fhirService.getCompositionDocumentHTML(this.docId)
      .subscribe(data => {

        thefile = new Blob([data], { type: "application/octet-stream" });
      },
        error => console.log("Error downloading the file.", error),
        () => {

          let a = window.document.createElement("a");
          a.href = window.URL.createObjectURL(thefile);
          a.download = "composition.html";
          document.body.appendChild(a);
          a.click();  // IE: "Access is denied"; see: https://connect.microsoft.com/IE/feedback/details/797361/ie-10-treats-blob-url-as-cross-origin-and-denies-access
          document.body.removeChild(a);
        }
        );



  }
}
