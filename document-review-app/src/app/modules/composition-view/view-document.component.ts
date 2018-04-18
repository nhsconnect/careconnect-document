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
      this.systemType="FDMS";
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


    this.fhirService.getBinary(id).subscribe( document => {
      this.document = document;
    }, err=>{},
      ()=> {
        this.getComposition();
      }

      );
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

      // EPR doesn't convert document so upload to FDMS and retrieve it as PDF
      let operation : fhir.OperationDefinition = undefined;
      this.fhirService.postFDMSDocument(this.document).subscribe(data => {
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
      this.fhirService.postFDMSDocument(this.document).subscribe(data => {
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
