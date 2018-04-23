import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FhirService} from "../../../service/fhir.service";

@Component({
  selector: 'app-epr-document-reference',
  templateUrl: './epr-document-reference.component.html',
  styleUrls: ['./epr-document-reference.component.css']
})
export class EprDocumentReferenceComponent implements OnInit {

  @Input() documents :fhir.DocumentReference[];

  @Input() documentsTotal :number;


  constructor(private router: Router, private FhirService : FhirService) { }

  ngOnInit() {
  }

  selectDocument(document : fhir.DocumentReference) {
   // console.log("Document clicked = " + document.id);

    let array: string[] = document.content[0].attachment.url.split('/');
    let documentId :string = array[array.length-1];
   // console.log("Document Id = "+documentId);

    if (documentId !=undefined && document.content[0].attachment.contentType == 'application/fhir+xml' ) {
      this.router.navigate(['doc/'+documentId ] );
    } else {
      this.FhirService.getBinaryRaw(documentId).subscribe(
        (res) => {
          var fileURL = URL.createObjectURL(res);
          window.open(fileURL);
        }
      );
    }
  }
}
