import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FhirService} from "../../service/fhir.service";

@Component({
  selector: 'app-view-document',
  templateUrl: './view-document.component.html',
  styleUrls: ['./view-document.component.css']
})
export class ViewDocumentComponent implements OnInit {

  constructor(private route: ActivatedRoute
  , private fhirService : FhirService ) { }

  ngOnInit() {
    this.getDocument();
  }

  document : fhir.Bundle = undefined;
  composition : fhir.Composition = undefined;
  patient : fhir.Patient = undefined;
  sections : fhir.CompositionSection[] = [];
  docId : string;

  getDocument(): void {
    let id = this.route.snapshot.paramMap.get('docid');
    this.docId = id;
    console.log("docid = "+id);

    this.fhirService.getCompositionDocument(id).subscribe( document => {
      this.document = document;
    }, err=>{},
      ()=> {

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
      });
  }
  downloadPDF() {
    console.log("Download PDF");

    let thefile = {};
    this.fhirService.getCompositionDocumentPDF(this.docId)
      .subscribe(data => {
            thefile = new Blob([data], {type: "application/pdf"});
          },
          error => {
            console.log("Error downloading the file." + error);
          },
        () => {
                console.log('Completed file download.');
          }
        );

   // let url = window.URL.createObjectURL(thefile);
   // window.open(url);

  }
  downloadHTML() {
    console.log("Download HTML");

    let thefile = {};
    this.fhirService.getCompositionDocumentHTML(this.docId)
      .subscribe(data => thefile = new Blob([data], { type: "application/octet-stream" }), //console.log(data),
        error => console.log("Error downloading the file." + error),
        () => console.log('Completed file download.'));

   // let url = window.URL.createObjectURL(thefile);
   // window.open(url);

  }
}
