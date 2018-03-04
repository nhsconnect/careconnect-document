import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-find-document-item',
  templateUrl: './find-document-item.component.html',
  styleUrls: ['./find-document-item.component.css']
})
export class FindDocumentItemComponent implements OnInit {

  @Input() composition : fhir.Composition;

  constructor() { }

  ngOnInit() {
  }

}
