import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-epr-document-reference',
  templateUrl: './epr-document-reference.component.html',
  styleUrls: ['./epr-document-reference.component.css']
})
export class EprDocumentReferenceComponent implements OnInit {

  @Input() documents :fhir.DocumentReference[];

  @Input() documentsTotal :number;


  constructor() { }

  ngOnInit() {
  }

}
