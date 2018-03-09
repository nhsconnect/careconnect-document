import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FhirService} from "../../service/fhir.service";

@Component({
  selector: 'app-find-document',
  templateUrl: './find-document.component.html',
  styleUrls: ['./find-document.component.css']
})
export class FindDocumentComponent implements OnInit {

  patientId : string;

  document : fhir.Bundle = undefined;

  compositions : fhir.Composition[] = [];

  constructor(private route: ActivatedRoute
    ,private fhirService : FhirService
    ,private router: Router) { }



  ngOnInit() {
    this.getFindDocuments();
  }

  getFindDocuments(): void {
    let id = this.route.snapshot.paramMap.get('patientId');
    this.patientId = id;
    console.log("patientId = "+id);

    this.fhirService.getSearchCompositions(id).subscribe( document => {
        this.document = document;
      }, err=>{},
      ()=> {
        if (this.document != undefined && this.document.entry != undefined) {

        for (let entry of this.document.entry) {
          if (entry.resource.resourceType === "Composition") {
            this.compositions.push(<fhir.Composition>entry.resource);
          }
        }
      }
      });
  }

  selectComposition(compositionId : number) {
    console.log("Composition clicked = " + compositionId);
    if (compositionId !=undefined) {
      this.router.navigate(['doc/'+compositionId ] );
    }
  }
}
