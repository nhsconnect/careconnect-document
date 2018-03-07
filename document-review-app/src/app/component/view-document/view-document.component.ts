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

  getPopoverTitle(section : fhir.CompositionSection) :string {
    return "Structured view of section"; //+section.code.coding[0];
  }
  getPopover(section : fhir.CompositionSection) : string {

    let structuredText="Section "+this.getSNOMEDLink(section.code.coding[0].code);
    if (section.entry != undefined) {
      structuredText += " has referenced "+section.entry.length+" items.<br>";
      let count = section.entry.length;
      for (let entry  of section.entry) {
        structuredText = structuredText + '<br>';
        structuredText += this.getReferencedItem(entry.reference);
      }

    } else {
      structuredText += "<br>No entries referenced.";
    }
    return structuredText;
  }

  getReferencedItem(reference : string) : string {
    let structuredText = "";
    for (let resource of this.document.entry) {
      if (resource.fullUrl === reference) {
        //structuredText = structuredText + resource.resource.resourceType;
        switch(resource.resource.resourceType) {
          case "AllergyIntolerance" :
            let allergyIntolerance :fhir.AllergyIntolerance = <fhir.AllergyIntolerance> resource.resource;
            structuredText += "AllergyIntolerance ";
            if (allergyIntolerance.code != null && allergyIntolerance.code.coding.length>0) structuredText += this.getSNOMEDLink(allergyIntolerance.code.coding[0].code);
            break;
          case "Condition" :
            let condition :fhir.Condition = <fhir.Condition> resource.resource;
            structuredText += "Condition "+this.getSNOMEDLink(condition.code.coding[0].code);
            break;
          case "Encounter" :
            let encounter :fhir.Encounter = <fhir.Encounter> resource.resource;
            structuredText += "Encounter "+this.getSNOMEDLink(encounter.type[0].coding[0].code);
            break;
          case "List" :
            let list :fhir.List = <fhir.List> resource.resource;
            structuredText += "List with "+ list.entry.length +" entries: <br>";
            for (let entry of list.entry) {
              if (entry.item != undefined && entry.item.reference != undefined) structuredText += "<br>"+this.getReferencedItem(entry.item.reference);
            }
            break;
          case "Medication" :
            let medication :fhir.Medication = <fhir.Medication> resource.resource;
            if (medication.code != undefined) {
              structuredText += "Medication "+this.getSNOMEDLink(medication.code.coding[0].code);
            }
            break;
          case "MedicationRequest" :
            let medicationRequest :fhir.MedicationRequest = <fhir.MedicationRequest> resource.resource;
            if (medicationRequest.medicationReference != undefined) {
               structuredText += " MedicationRequest Reference "+medicationRequest.medicationReference.reference;
               structuredText += this.getReferencedItem(medicationRequest.medicationReference.reference);
            }
            if (medicationRequest.medicationCodeableConcept != undefined) structuredText += " MedicationRequest "+this.getSNOMEDLink(medicationRequest.medicationCodeableConcept.coding[0].code);
            break;
          case "MedicationStatement" :
            let medicationStatement :fhir.MedicationStatement = <fhir.MedicationStatement> resource.resource;
            if (medicationStatement.medicationReference != undefined) {
              structuredText += " MedicationStatement Reference <br>" + medicationStatement.medicationReference.reference;
              structuredText += "<br>"+this.getReferencedItem(medicationStatement.medicationReference.reference);
            }
            if (medicationStatement.medicationCodeableConcept != undefined) structuredText += " MedicationStatement "+this.getSNOMEDLink(medicationStatement.medicationCodeableConcept.coding[0].code);
            break;
          case "Observation" :
            let observation :fhir.Observation = <fhir.Observation> resource.resource;
            structuredText += "Observation " +this.getSNOMEDLink(observation.code.coding[0].code);
            break;
          case "Procedure" :
            let procedure :fhir.Procedure = <fhir.Procedure> resource.resource;
            structuredText += "Procedure "+this.getSNOMEDLink(procedure.code.coding[0].code);
            break;
        }
      }
    }
    return structuredText;
  }

  getSNOMEDLink(code : string) {
    return "<a href='https://termbrowser.nhs.uk/?perspective=full&conceptId1="+code+"&edition=uk-edition&release=v20171001'>"+code+"</a>";
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

  downloadPDFActual(documentid : string) {
    let thefile = {};
    this.fhirService.getCompositionDocumentPDF(documentid)
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

  downloadPDF() {
    console.log("Download PDF");


    if (this.systemType === "EPR") {

      // EPR doesn't convert document so upload to EDMS and retrieve it as PDF
      let operation : fhir.OperationDefinition = undefined;
      this.fhirService.postEDMSDocument(this.document).subscribe(data => {
          console.log(data);
          operation = data;
          // thefile = new Blob([data], { type: "application/octet-stream" });
        },
        error => console.log("Error downloading the file.", error),
        () => {
          if (operation != undefined) {
            this.downloadPDFActual(operation.id);
          }
        }
      );
    } else {
      this.downloadPDFActual(this.docId);
    }
  }

  downloadHTML() {
    console.log("Download HTML");

    if (this.systemType === "EPR") {

      // EPR doesn't convert document so upload to EDMS and retrieve it as HTML

      let operation : fhir.OperationDefinition = undefined;
      this.fhirService.postEDMSDocument(this.document).subscribe(data => {
          console.log(data);
          operation = data;
         // thefile = new Blob([data], { type: "application/octet-stream" });
        },
        error => console.log("Error downloading the file.", error),
        () => {
            if (operation != undefined) {
              this.downloadHTMLActual(operation.id);
            }
        }
      );
    } else {
      this.downloadHTMLActual(this.docId);
    }
  }

  downloadHTMLActual(docuemntid : string) {
    console.log("Download HTML");

    let thefile = {};
    this.fhirService.getCompositionDocumentHTML(docuemntid)
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
