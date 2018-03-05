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
