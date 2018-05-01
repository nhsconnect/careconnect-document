import {Component, Input, OnInit} from '@angular/core';
import {LinksService} from "../../service/links.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-encounter',
  templateUrl: './encounter.component.html',
  styleUrls: ['./encounter.component.css']
})
export class EncounterComponent implements OnInit {

  @Input() encounters : fhir.Encounter[];

  @Input() showDetail : boolean = false;

  @Input() patient : fhir.Patient;

  selectedEncounter : fhir.Encounter;

  constructor(private linksService : LinksService
    ,private modalService: NgbModal) { }

  ngOnInit() {
  }
  getCodeSystem(system : string) : string {
    return this.linksService.getCodeSystem(system);
  }

  isSNOMED(system: string) : boolean {
    return this.linksService.isSNOMED(system);
  }


  getSNOMEDLink(code : fhir.Coding) {
    if (this.linksService.isSNOMED(code.system)) {
      window.open(this.linksService.getSNOMEDLink(code), "_blank");
    }
  }
  onClick(content ,encounter : fhir.Encounter) {
    this.selectedEncounter = encounter;
    this.modalService.open(content,{ windowClass: 'dark-modal' });
  }
}
