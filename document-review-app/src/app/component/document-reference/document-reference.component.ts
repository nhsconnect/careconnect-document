import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-document-reference',
  templateUrl: './document-reference.component.html',
  styleUrls: ['./document-reference.component.css']
})
export class DocumentReferenceComponent implements OnInit {

  @Input() document : fhir.DocumentReference;

  constructor() { }

  ngOnInit() {
  }
  getSNOMEDLink(code : string) {
    window.open("https://termbrowser.nhs.uk/?perspective=full&conceptId1="+code+"&edition=uk-edition&release=v20171001", "_blank");
  }
  getService() :string {
    if (this.document.context == undefined || this.document.context.practiceSetting == undefined ) return "";
    let display : string = "";

    if (this.document.context.practiceSetting.coding.length > 0) display = this.document.context.practiceSetting.coding[0].display;

    return display;
  }
}
