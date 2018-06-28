import {Component, Input, OnInit} from '@angular/core';
import {LinksService} from "../../service/links.service";

@Component({
  selector: 'app-document-reference-card',
  templateUrl: './document-reference-card.component.html',
  styleUrls: ['./document-reference-card.component.css']
})
export class DocumentReferenceCardComponent implements OnInit {

  @Input() document : fhir.DocumentReference;

  constructor(private linksService : LinksService) { }

  ngOnInit() {
  }
  getCodeSystem(system : string) : string {
    return this.linksService.getCodeSystem(system);
  }

  getSNOMEDLink(code : fhir.Coding) {
    if (this.linksService.isSNOMED(code.system)) {
      window.open(this.linksService.getSNOMEDLink(code), "_blank");
    }
  }
  getService() :string {
    if (this.document.context == undefined || this.document.context.practiceSetting == undefined ) return "";
    let display : string = "";

    if (this.document.context.practiceSetting.coding.length > 0) display = this.document.context.practiceSetting.coding[0].display;

    return display;
  }
}
