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

  getDocument(): void {
    let id = this.route.snapshot.paramMap.get('docid');
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
}
