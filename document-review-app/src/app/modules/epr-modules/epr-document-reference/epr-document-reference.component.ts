import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-epr-document-reference',
  templateUrl: './epr-document-reference.component.html',
  styleUrls: ['./epr-document-reference.component.css']
})
export class EprDocumentReferenceComponent implements OnInit {

  @Input() documents :fhir.DocumentReference[];

  @Input() documentsTotal :number;


  constructor(private router: Router) { }

  ngOnInit() {
  }

  selectDocument(document : fhir.DocumentReference) {
   // console.log("Document clicked = " + document.id);

    let array: string[] = document.content[0].attachment.url.split('/');
    let documentId :string = array[array.length-1];
   // console.log("Document Id = "+documentId);

    if (documentId !=undefined) {
      this.router.navigate(['doc/'+documentId ] );
    }
  }
}
