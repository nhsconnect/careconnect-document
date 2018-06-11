import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FhirService} from "../../service/fhir.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-view-document',
  templateUrl: './view-document.component.html',
  styleUrls: ['./view-document.component.css']
})
export class ViewDocumentComponent implements OnInit {

  @Input() document : fhir.Bundle;
  @Input() systemType : string;

  @ViewChild('modalWait') modalWait;

  @ViewChild('modalIssue') modalIssue;



  constructor(private route: ActivatedRoute
  , private fhirService : FhirService
  ,private modalService: NgbModal) { }

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

    let modalWaitRef = this.modalService.open( this.modalWait,{ windowClass: 'dark-modal' });

    this.fhirService.getBinary(id).subscribe( document => {
      let binary : fhir.Binary = document;
      //console.log(atob(binary.content));
      this.document = JSON.parse(atob(binary.content));
    }, err=>{

        modalWaitRef.close();

        let modalIssueRef = this.modalService.open( this.modalIssue,{ windowClass: 'dark-modal' });

      },
      ()=> {

        this.getComposition();
        modalWaitRef.close();
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
    console.log("Download PDF "+ this.systemType);
    this.downloadPDFActual(this.docId);

  }

  downloadHTML() {
    console.log("Download HTML");
    this.downloadHTMLActual(this.docId);

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
