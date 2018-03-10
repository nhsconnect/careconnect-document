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

  getService(service : fhir.Extension[]) :string {
    let display : string = "";
    for( let extension of service) {
      if (extension.url === "https://fhir.nhs.uk/STU3/StructureDefinition/Extension-ITK-CareSettingType-1") {
        display = extension.valueCodeableConcept.coding[0].display;
      }
    }
    return display;
  }


}
